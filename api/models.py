import json
from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime
from sqlalchemy.dialects.sqlite import JSON
from database import Base
from datetime import date, datetime, timezone

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True)
    message = Column(String)
    sender = Column(String)  # 'user' or 'admin'
    timestamp = Column(DateTime, default=datetime.now(timezone.utc))

class BusinessListing(Base):
    __tablename__ = "business_listings"

    # Basic Identification
    id = Column(Integer, primary_key=True, index=True)
    ref_id = Column(String, unique=True, index=True)
    title = Column(String)
    business_name = Column(String)
    availability = Column(String)
    creation_datetime = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Business Overview
    business_type = Column(String)
    industry = Column(JSON)  # List[str]
    label = Column(JSON)  # List[str]
    foundation_date = Column(Date)
    number_of_partners = Column(Integer)

    # Location and Premises
    location = Column(String)
    address = Column(String)
    business_situs = Column(String)
    business_situs_owner_type = Column(String)
    size = Column(Float)

    # Financial Information
    price = Column(Float)
    min_price = Column(Float)
    price_include_inventory = Column(Boolean)
    deposit = Column(Float)
    first_installment = Column(Float)
    profit = Column(Float)
    turnover = Column(Float)

    # Operational Costs
    rent = Column(Float)
    renewal_rent = Column(Float)
    merchandise_cost = Column(Float)
    electricity_bill = Column(Float)
    water_bill = Column(Float)
    management_fee = Column(Float)
    air_conditioning_fee = Column(Float)
    rates_and_government_rent = Column(Float)
    renovation_and_equipment = Column(Float)
    other_expense = Column(Float)

    # Staff Information
    number_of_staff = Column(Integer)
    staff_salary = Column(Float)
    staff_remain = Column(String)
    mpf = Column(Float)

    # Business Details
    main_product_service = Column(JSON)  # List[str]
    main_product_service_percentage = Column(JSON)  # List[float]
    business_hours = Column(String)
    license = Column(JSON)  # List[str]

    # Lease Information
    lease_term = Column(Float)
    lease_expiry_date = Column(Date)

    # Transfer Details
    transfer_method = Column(JSON)  # List[str]
    reason = Column(JSON)  # List[str]
    involvement = Column(JSON)  # List[str]

    # Contact Information
    agent = Column(String)
    client_name = Column(String)
    mobile = Column(String)
    email = Column(String)
    meeting_location = Column(String)

    # Additional Information
    description = Column(JSON)  # List[str]

    def to_dict(self):
        def format_datetime(value):
            if isinstance(value, datetime):
                if value.tzinfo is None:
                    return value.replace(tzinfo=timezone.utc)
                return value.astimezone(timezone.utc)
            return value
        
        def format_date(value):
            if isinstance(value, date):
                return value.isoformat()
            return value
        
        def safe_json_loads(value):
            if value is None:
                return []
            if isinstance(value, list):
                return value
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return [value] if value else []


        return {
            "id": self.id,
            "ref_id": self.ref_id,
            "title": self.title,
            "business_name": self.business_name,
            "availability": self.availability,
            "creation_datetime": format_datetime(self.creation_datetime) if self.creation_datetime else None,
            "business_type": self.business_type,
            "industry": safe_json_loads(self.industry),
            "label": safe_json_loads(self.label),
            "foundation_date": format_date(self.foundation_date),
            "number_of_partners": self.number_of_partners,
            "location": self.location,
            "address": self.address,
            "business_situs": self.business_situs,
            "business_situs_owner_type": self.business_situs_owner_type,
            "size": self.size,
            "price": self.price,
            "min_price": self.min_price,
            "price_include_inventory": self.price_include_inventory,
            "deposit": self.deposit,
            "first_installment": self.first_installment,
            "profit": self.profit,
            "turnover": self.turnover,
            "rent": self.rent,
            "renewal_rent": self.renewal_rent,
            "merchandise_cost": self.merchandise_cost,
            "electricity_bill": self.electricity_bill,
            "water_bill": self.water_bill,
            "management_fee": self.management_fee,
            "air_conditioning_fee": self.air_conditioning_fee,
            "rates_and_government_rent": self.rates_and_government_rent,
            "renovation_and_equipment": self.renovation_and_equipment,
            "other_expense": self.other_expense,
            "number_of_staff": self.number_of_staff,
            "staff_salary": self.staff_salary,
            "staff_remain": self.staff_remain,
            "mpf": self.mpf,
            "main_product_service": safe_json_loads(self.main_product_service),
            "main_product_service_percentage": safe_json_loads(self.main_product_service_percentage),
            "business_hours": self.business_hours,
            "license": safe_json_loads(self.license),
            "lease_term": self.lease_term,
            "lease_expiry_date": format_date(self.lease_expiry_date),
            "transfer_method": safe_json_loads(self.transfer_method),
            "reason": safe_json_loads(self.reason),
            "involvement": safe_json_loads(self.involvement),
            "agent": self.agent,
            "client_name": self.client_name,
            "mobile": self.mobile,
            "email": self.email,
            "meeting_location": self.meeting_location,
            "description": safe_json_loads(self.description),
        }

