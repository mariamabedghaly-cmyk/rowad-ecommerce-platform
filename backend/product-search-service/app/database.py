import logging
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings

logger = logging.getLogger("uvicorn.error")

DEFAULT_PRODUCTS = [
    {
        "_id": ObjectId("6720e5c9b83b123456789001"),
        "name": "Studio Wireless Headphones",
        "category": "ELECTRONICS",
        "price": 2499.0,
        "stock": 45,
        "description": "Immersive acoustics and active noise isolation.",
        "image": "/assets/6ce96.png",
        "createdBy": "system",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    },
    {
        "_id": ObjectId("6720e5c9b83b123456789002"),
        "name": "Everyday Court Sneakers",
        "category": "FASHION",
        "price": 1850.0,
        "stock": 30,
        "description": "Classic court silhouette crafted with durable leather.",
        "image": "/assets/c3f85.png",
        "createdBy": "system",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    },
    {
        "_id": ObjectId("6720e5c9b83b123456789003"),
        "name": "Minimal Ceramic Lamp",
        "category": "HOME & LIVING",
        "price": 1150.0,
        "stock": 20,
        "description": "Warm ambient lighting with tactile ceramic finish.",
        "image": "/assets/eb990.png",
        "createdBy": "system",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    },
    {
        "_id": ObjectId("6720e5c9b83b123456789004"),
        "name": "Everyday Carry Tote",
        "category": "ACCESSORIES",
        "price": 650.0,
        "stock": 50,
        "description": "Heavyweight canvas carry tote with reinforced handles.",
        "image": "/assets/tote.png",
        "createdBy": "system",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    },
]

DEFAULT_CATEGORIES = [
    {"_id": ObjectId("6720e5c9b83b123456789011"), "name": "ELECTRONICS", "description": "High-fidelity audio, wearables & tech gadgets"},
    {"_id": ObjectId("6720e5c9b83b123456789012"), "name": "FASHION", "description": "Everyday essentials, footwear & tailored apparel"},
    {"_id": ObjectId("6720e5c9b83b123456789013"), "name": "HOME & LIVING", "description": "Tactile objects, warm lighting & modern decor"},
    {"_id": ObjectId("6720e5c9b83b123456789014"), "name": "ACCESSORIES", "description": "Canvas totes, daily carry gear & leathercraft"},
]

class Database:
    client = None
    db = None

db_instance = Database()

async def ensure_catalog_seeded(db):
    try:
        count = await db.products.count_documents({})
        if count == 0:
            await db.products.insert_many([dict(p) for p in DEFAULT_PRODUCTS])
            await db.categories.insert_many([dict(c) for c in DEFAULT_CATEGORIES])
            logger.info("[Product & Search Service] Auto-seeded 4 default products and categories into database.")
    except Exception as err:
        logger.warning(f"[Product & Search Service] Seed warning: {err}")

async def connect_to_mongo():
    try:
        client = AsyncIOMotorClient(settings.MONGO_URI, serverSelectionTimeoutMS=1500)
        await client.admin.command("ping")
        db_instance.client = client
        db_instance.db = client[settings.DB_NAME]
        logger.info(f"[Product & Search Service] Connected to live MongoDB: {settings.DB_NAME}")
    except Exception as exc:
        logger.warning(f"[Product & Search Service] Live MongoDB unavailable ({exc}). Initializing high-speed in-memory MongoDB engine...")
        import mongomock_motor
        db_instance.client = mongomock_motor.AsyncMongoMockClient()
        db_instance.db = db_instance.client[settings.DB_NAME]

    await ensure_catalog_seeded(db_instance.db)

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        logger.info("[Product & Search Service] Closed MongoDB connection")

def get_database():
    return db_instance.db
