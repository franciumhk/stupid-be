import json
import sys
import os
from database import SessionLocal, engine, get_db
from datetime import date, datetime, timedelta, timezone
from fastapi import FastAPI, Query, Depends, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.websockets import WebSocketDisconnect
from pydantic import ValidationError
from sqlalchemy import cast, Float, desc, or_, select
from sqlalchemy.orm import Session
from typing import Dict, List, Optional
import logging
import models, schemas
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

models.Base.metadata.create_all(bind=engine)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.admin_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        await self.broadcast_to_admins({"type": "new_chat", "client": client_id})

    def disconnect(self, client_id: str):
        del self.active_connections[client_id]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)

    async def broadcast_to_admins(self, message: dict):
        print(f"Broadcasting to {len(self.admin_connections)} admins: {message}")  # Add this line
        for admin in self.admin_connections:
            await admin.send_json(message)

    async def connect_admin(self, websocket: WebSocket):
        await websocket.accept()
        self.admin_connections.append(websocket)

    def disconnect_admin(self, websocket: WebSocket):
        self.admin_connections.remove(websocket)

manager = ConnectionManager()

# Dependency
def convert_to_db_compatible(data: dict) -> dict:
    for key, value in data.items():
        if isinstance(value, list):
            data[key] = json.dumps(value)
        if isinstance(value, datetime):
            if value.tzinfo is None:
                # If the datetime is naive, make it timezone-aware with UTC
                data[key] = value.replace(tzinfo=timezone.utc)
            else:
                # If it's already timezone-aware, ensure it's in UTC
                data[key] = value.astimezone(timezone.utc)
    return data

def store_message(db: Session, user_email: str, message: str, sender: str):
    new_message = models.Conversation(user_email=user_email, message=message, sender=sender, timestamp=datetime.now(timezone.utc))
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message

def get_recent_conversations(db: Session, user_email: str):
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
    return db.query(models.Conversation).filter(
        models.Conversation.user_email == user_email,
        models.Conversation.timestamp > seven_days_ago
    ).order_by(models.Conversation.timestamp.asc()).all()
    
@app.websocket("/ws/chat/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str, db: Session = Depends(get_db)):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            print(f"Received message from client {client_id}: {data}")
            
            # Store the message
            store_message(db, client_id, data["content"], data["sender"])
            
            await manager.broadcast_to_admins({
                "type": "message", 
                "client": client_id, 
                "sender": data["sender"], 
                "content": data["content"]
            })
            print(f"Broadcasted message to admins: {data}")
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        print(f"Client {client_id} disconnected")

@app.websocket("/ws/admin")
async def admin_websocket_endpoint(websocket: WebSocket, db: Session = Depends(get_db)):
    await manager.connect_admin(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            print(f"Received message from admin: {data}")
            if data["type"] == "admin_message":
                client_ws = manager.active_connections.get(data["client"])
                if client_ws:
                    await client_ws.send_json({"sender": "Admin", "content": data["content"]})
                    print(f"Sent admin message to client {data['client']}")
                    
                    # Store the admin message
                    store_message(db, data["client"], data["content"], "Admin")
    except WebSocketDisconnect:
        manager.disconnect_admin(websocket)
        print("Admin disconnected")

@app.get("/api/conversations/{user_email}")
async def get_conversations(user_email: str, db: Session = Depends(get_db)):
    conversations = get_recent_conversations(db, user_email)
    return [
        {
            "sender": conv.sender,
            "content": conv.message,
            "timestamp": conv.timestamp.isoformat()
        } for conv in conversations
    ]

@app.get("/api/latest-chats")
async def get_latest_chats(limit: int = 10, db: Session = Depends(get_db)):
    # Query to get the latest chats
    latest_chats = db.query(models.Conversation.user_email)\
        .distinct(models.Conversation.user_email)\
        .order_by(models.Conversation.user_email, desc(models.Conversation.timestamp))\
        .limit(limit)\
        .all()

    result = []
    for chat in latest_chats:
        user_email = chat.user_email
        messages = db.query(models.Conversation)\
            .filter(models.Conversation.user_email == user_email)\
            .order_by(desc(models.Conversation.timestamp))\
            .limit(5)\
            .all()
        
        result.append({
            "email": user_email,
            "messages": [
                {
                    "sender": msg.sender,
                    "content": msg.message,
                    "timestamp": msg.timestamp.isoformat()
                } for msg in reversed(messages)
            ]
        })

    return result

@app.get("/api/businesses/search", response_model=List[schemas.BusinessItemView])
def search_businesses(
    db: Session = Depends(get_db),
    keyword: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    min_turnover: Optional[float] = Query(None),
    max_turnover: Optional[float] = Query(None),
    location: Optional[str] = Query(None),
    industry: Optional[str] = Query(None),
    skip: int = Query(0),
    limit: int = Query(10)
):
    query = db.query(models.BusinessListing)
    try:
        if keyword is not None:
            query = query.filter(or_(
                models.BusinessListing.title.ilike(f"%{keyword}%"),
                models.BusinessListing.description.ilike(f"%{keyword}%")
            ))
        if min_price is not None:
            query = query.filter(cast(models.BusinessListing.price, Float) >= min_price)
        if max_price is not None:
            query = query.filter(cast(models.BusinessListing.price, Float) <= max_price)
        if min_turnover is not None:
            query = query.filter(cast(models.BusinessListing.turnover, Float) >= min_turnover)
        if max_turnover is not None:
            query = query.filter(cast(models.BusinessListing.turnover, Float) <= max_turnover)
        if location is not None:
            query = query.filter(models.BusinessListing.location.ilike(f"%{location}%"))
        if industry is not None:
            query = query.filter(models.BusinessListing.industry.ilike(f"%{industry}%"))

        businesses = query.offset(skip).limit(limit).all()
    except Exception as e:
            print(f"Error in search_businesses: {str(e)}")  # Log the error
            raise HTTPException(status_code=500, detail="An error occurred while searching businesses")
    # Convert SQLAlchemy models to Pydantic models using model_validate
    business_items = []
    for item in businesses:
        business_item = schemas.BusinessItemView(
            ref_id=item.ref_id,
            title=item.title,
            label=json.loads(item.label) if isinstance(item.label, str) else item.label,
            involvement=json.loads(item.involvement) if isinstance(item.involvement, str) else item.involvement,
            industry=json.loads(item.industry) if isinstance(item.industry, str) else item.industry,
            location=item.location,
            size=item.size,
            price=item.price,
            turnover=item.turnover
        )
        business_items.append(business_item)
    return business_items

# Add this error handler to catch validation errors that occur during request parsing
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error("RequestValidationError:")
    logger.error(exc.errors())
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )

@app.post("/api/businesses", response_model=schemas.BusinessListing)
async def create_listing(request: Request, listing: schemas.BusinessListingCreate, db: Session = Depends(get_db)):
    try:
        body = await request.body()
        logger.error("Raw POST content:")
        logger.error(body.decode())

        # Log the parsed JSON content
        json_body = await request.json()
        logger.error("Parsed JSON content:")
        logger.error(json.dumps(json_body, indent=2))

        # Validate the data against your Pydantic model
        listing = schemas.BusinessListingCreate(**json_body)

        db_compatible_dict = convert_to_db_compatible(listing.model_dump())
        db_listing = models.BusinessListing(**db_compatible_dict)
        db.add(db_listing)
        db.commit()
        db.refresh(db_listing)
        return schemas.BusinessListing(**db_listing.to_dict())

    except ValidationError as e:
            logger.error("Validation error:")
            logger.error(e.json())
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/api/businesses_items", response_model=List[schemas.BusinessItemView])
def read_business_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Select the columns we need
    stmt = select(
        models.BusinessListing.ref_id,
        models.BusinessListing.title,
        models.BusinessListing.label,
        models.BusinessListing.involvement,
        models.BusinessListing.industry,
        models.BusinessListing.location,
        models.BusinessListing.size,
        models.BusinessListing.price,
        models.BusinessListing.turnover
    ).offset(skip).limit(limit)

    result = db.execute(stmt)
    listings = result.all()

    # Convert the result to a list of BusinessItemView objects
    business_items = []
    for item in listings:
        business_item = schemas.BusinessItemView(
            ref_id=item.ref_id,
            title=item.title,
            label=json.loads(item.label) if isinstance(item.label, str) else item.label,
            involvement=json.loads(item.involvement) if isinstance(item.involvement, str) else item.involvement,
            industry=json.loads(item.industry) if isinstance(item.industry, str) else item.industry,
            location=item.location,
            size=item.size,
            price=item.price,
            turnover=item.turnover
        )
        business_items.append(business_item)

    return business_items

@app.get("/api/businesses", response_model=List[schemas.BusinessListing])
def read_listings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    listings = db.query(models.BusinessListing).offset(skip).limit(limit).all()
    logger.error(listings)
    businesses = []
    for item in listings:
        businesses.append(schemas.BusinessListing(**item.to_dict()))
    return businesses

@app.get("/api/businesses/{ref_id}", response_model=schemas.BusinessListing)
def read_listing(ref_id: str, db: Session = Depends(get_db)):
    db_listing = db.query(models.BusinessListing).filter(models.BusinessListing.ref_id == ref_id).first()
    if db_listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return schemas.BusinessListing(**db_listing.to_dict())

@app.put("/api/businesses/{ref_id}", response_model=schemas.BusinessListing)
def update_listing(ref_id: str, listing: schemas.BusinessListingUpdate, db: Session = Depends(get_db)):
    db_listing = db.query(models.BusinessListing).filter(models.BusinessListing.ref_id == ref_id).first()
    if db_listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    update_data = listing.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_listing, key, value)
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return schemas.BusinessListing(**db_listing.to_dict())

@app.delete("/api/businesses/{ref_id}", response_model=schemas.BusinessListing)
def delete_listing(ref_id: str, db: Session = Depends(get_db)):
    db_listing = db.query(models.BusinessListing).filter(models.BusinessListing.ref_id == ref_id).first()
    if db_listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    db.delete(db_listing)
    db.commit()
    return schemas.BusinessListing(**db_listing.to_dict())

@app.get("/api/businesses_info/{ref_id}", response_model=schemas.BusinessInfoView)
def read_business_info(ref_id: str, db: Session = Depends(get_db)):
    db_listing = db.query(models.BusinessListing).filter(models.BusinessListing.ref_id == ref_id).first()
    if db_listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return schemas.BusinessInfoView(**db_listing.to_dict())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
