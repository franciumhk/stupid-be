from pydantic import BaseModel, Field, ConfigDict, computed_field
from typing import List, Optional
from datetime import datetime, date, time, timezone
import re

class ConversationCreate(BaseModel):
    user_email: str
    message: str
    sender: str

class Conversation(BaseModel):
    id: int
    user_email: str
    message: str
    sender: str
    timestamp: datetime

    class Config:
        orm_mode = True

def generate_ref_id(location: str):
    now = datetime.now(timezone.utc)
    # Make midnight timezone-aware
    midnight = datetime.combine(now.date(), time.min, tzinfo=timezone.utc)
    minutes_since_midnight = int((now - midnight).total_seconds() / 60)

    year_last_two_digits = str(now.year)[-2:]
    week_number = now.strftime("%W")
    day_number = now.strftime("%w")

    # Format minutes as a 4-digit string
    minutes_str = f"{minutes_since_midnight:04d}"

    # Extract uppercase letters after "-" from location
    location_code = re.findall(r'-\s*([A-Z]+)', location)
    location_code = location_code[0] if location_code else ''
    ref_id = f"{location_code}{year_last_two_digits}{week_number}{day_number}{minutes_str}"
    print(ref_id)
    return ref_id

class BusinessListingBase(BaseModel):
    title: str
    business_name: str
    availability: str
    business_type: str
    industry: List[str]
    label: List[str]
    foundation_date: date
    number_of_partners: int
    location: str
    address: str
    business_situs: str
    business_situs_owner_type: str
    size: float
    price: float
    min_price: float
    price_include_inventory: bool
    deposit: float
    first_installment: float
    profit: float
    turnover: float
    rent: float
    renewal_rent: float
    merchandise_cost: float
    electricity_bill: float
    water_bill: float
    management_fee: float
    air_conditioning_fee: float
    rates_and_government_rent: float
    renovation_and_equipment: float
    other_expense: float
    number_of_staff: int
    staff_salary: float
    staff_remain: str
    mpf: float
    main_product_service: List[str]
    main_product_service_percentage: List[float]
    business_hours: str
    license: List[str]
    lease_term: float
    lease_expiry_date: date
    transfer_method: List[str]
    reason: List[str]
    involvement: List[str]
    agent: str
    client_name: str
    mobile: str
    email: str
    meeting_location: str
    description: List[str]

class BusinessListingCreate(BusinessListingBase):
    @computed_field
    @property
    def ref_id(self) -> str:
        return generate_ref_id(self.location)
    
    class Config:
        json_encoders = {
            datetime: lambda dt: dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt.astimezone(timezone.utc)
        }

class BusinessListing(BusinessListingBase):
    id: int
    ref_id: str
    creation_datetime: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    model_config = ConfigDict(from_attributes = True)

class BusinessListingResponse(BusinessListingBase):
    id: int
    ref_id: str
    creation_datetime: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    model_config = ConfigDict(from_attributes=True)
class BusinessListingUpdate(BaseModel):
    title: Optional[str] = None
    business_name: Optional[str] = None
    availability: Optional[str] = None
    business_type: Optional[str] = None
    industry: Optional[List[str]] = None
    label: Optional[List[str]] = None
    foundation_date: Optional[date] = None
    number_of_partners: Optional[int] = None
    location: Optional[str] = None
    address: Optional[str] = None
    business_situs: Optional[str] = None
    business_situs_owner_type: Optional[str] = None
    size: Optional[float] = None
    price: Optional[float] = None
    min_price: Optional[float] = None
    price_include_inventory: Optional[bool] = None
    deposit: Optional[float] = None
    first_installment: Optional[float] = None
    profit: Optional[float] = None
    turnover: Optional[float] = None
    rent: Optional[float] = None
    renewal_rent: Optional[float] = None
    merchandise_cost: Optional[float] = None
    electricity_bill: Optional[float] = None
    water_bill: Optional[float] = None
    management_fee: Optional[float] = None
    air_conditioning_fee: Optional[float] = None
    rates_and_government_rent: Optional[float] = None
    renovation_and_equipment: Optional[float] = None
    other_expense: Optional[float] = None
    number_of_staff: Optional[int] = None
    staff_salary: Optional[float] = None
    staff_remain: Optional[str] = None
    mpf: Optional[float] = None
    main_product_service: Optional[List[str]] = None
    main_product_service_percentage: Optional[List[float]] = None
    business_hours: Optional[str] = None
    license: Optional[List[str]] = None
    lease_term: Optional[float] = None
    lease_expiry_date: Optional[date] = None
    transfer_method: Optional[List[str]] = None
    reason: Optional[List[str]] = None
    involvement: Optional[List[str]] = None
    agent: Optional[str] = None
    client_name: Optional[str] = None
    mobile: Optional[str] = None
    email: Optional[str] = None
    meeting_location: Optional[str] = None
    description: Optional[List[str]] = None

    model_config = ConfigDict(from_attributes=True)

class BusinessListingInDB(BusinessListing):
    id: int

class BusinessItemView(BaseModel):
    ref_id: str
    title: str
    label: List[str]
    involvement: List[str]
    industry: List[str]
    location: str
    size: float
    price: float
    turnover: float

    model_config = ConfigDict(from_attributes=True)

class BusinessInfoView(BaseModel):
    ref_id: str
    title: str
    label: List[str]
    involvement: List[str]
    industry: List[str]
    location: str
    business_situs: str
    size: float
    price: float
    turnover: float
    transfer_method: List[str]
    profit: float
    reason: List[str]
    license: List[str]
    rent: float
    description: List[str]

    model_config = ConfigDict(from_attributes=True)
