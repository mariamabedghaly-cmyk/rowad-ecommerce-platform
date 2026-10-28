from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

db_instance = Database()

async def connect_to_mongo():
    db_instance.client = AsyncIOMotorClient(settings.MONGO_URI)
    db_instance.db = db_instance.client[settings.DB_NAME]
    print(f"[Product & Search Service] Connected to MongoDB database: {settings.DB_NAME}")

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        print("[Product & Search Service] Closed MongoDB connection")

def get_database() -> AsyncIOMotorDatabase:
    return db_instance.db
