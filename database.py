from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Get database configuration from environment variables
DB_TYPE = os.getenv('DB_TYPE', 'sqlite')  # default to sqlite if not specified
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'your_db_name')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_URL = os.getenv('POSTGRES_URL', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')

# Configure database URL based on type
if DB_TYPE == 'sqlite':
    
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(BASE_DIR, "database.db")
    os.makedirs(os.path.dirname(db_path), exist_ok=True)

    SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
elif DB_TYPE == 'vercelpostgresql':
    SQLALCHEMY_DATABASE_URL = f"{DB_URL}"
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
elif DB_TYPE == 'postgresql':
    SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
else:
    raise ValueError(f"Unsupported database type: {DB_TYPE}")

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        print(f"Database error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

