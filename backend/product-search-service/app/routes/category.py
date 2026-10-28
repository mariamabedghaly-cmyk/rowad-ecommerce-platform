import math
from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Query, status
from app.database import get_database
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    CategoryPaginatedResponse
)

router = APIRouter(prefix="/api/categories", tags=["Categories"])

def serialize_category(doc) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc

@router.get("/", response_model=CategoryPaginatedResponse)
async def get_categories(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    db = get_database()
    skip = (page - 1) * limit
    total = await db.categories.count_documents({})
    cursor = db.categories.find().skip(skip).limit(limit)
    categories = [serialize_category(cat) async for cat in cursor]

    return CategoryPaginatedResponse(
        total=total,
        page=page,
        pages=math.ceil(total / limit) if total > 0 else 1,
        categories=categories
    )

@router.get("/{id}", response_model=CategoryResponse)
async def get_category_by_id(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Category ID format")
    db = get_database()
    category = await db.categories.find_one({"_id": ObjectId(id)})
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return serialize_category(category)

@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(payload: CategoryCreate):
    db = get_database()
    existing = await db.categories.find_one({"name": payload.name})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category name already exists")
    
    doc = payload.model_dump()
    doc["createdAt"] = datetime.utcnow()
    doc["updatedAt"] = datetime.utcnow()
    res = await db.categories.insert_one(doc)
    doc["_id"] = str(res.inserted_id)
    return doc

@router.put("/{id}", response_model=CategoryResponse)
async def update_category(id: str, payload: CategoryUpdate):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Category ID format")
    db = get_database()
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided to update")

    update_data["updatedAt"] = datetime.utcnow()
    res = await db.categories.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": update_data},
        return_document=True
    )
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return serialize_category(res)

@router.delete("/{id}")
async def delete_category(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Category ID format")
    db = get_database()
    res = await db.categories.delete_one({"_id": ObjectId(id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return {"message": "Category deleted successfully"}
