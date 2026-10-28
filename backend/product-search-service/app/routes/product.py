import math
from datetime import datetime
from bson import ObjectId
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.database import get_database
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductPaginatedResponse
)

router = APIRouter(prefix="/api/products", tags=["Products & Search"])

def serialize_product(doc) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc

@router.get("/", response_model=ProductPaginatedResponse)
async def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None, description="Regex full text search on name or description"),
    category: Optional[str] = Query(None, description="Category ID or name"),
    minPrice: Optional[float] = Query(None, ge=0),
    maxPrice: Optional[float] = Query(None, ge=0),
    inStock: Optional[bool] = Query(None)
):
    db = get_database()
    query_filter = {}

    if search:
        query_filter["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]

    if category:
        query_filter["category"] = category

    if minPrice is not None or maxPrice is not None:
        price_cond = {}
        if minPrice is not None:
            price_cond["$gte"] = minPrice
        if maxPrice is not None:
            price_cond["$lte"] = maxPrice
        query_filter["price"] = price_cond

    if inStock:
        query_filter["stock"] = {"$gt": 0}

    skip = (page - 1) * limit
    total = await db.products.count_documents(query_filter)
    cursor = db.products.find(query_filter).skip(skip).limit(limit)
    products = [serialize_product(p) async for p in cursor]

    return ProductPaginatedResponse(
        total=total,
        page=page,
        pages=math.ceil(total / limit) if total > 0 else 1,
        products=products
    )

@router.get("/{id}", response_model=ProductResponse)
async def get_product_by_id(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Product ID format")
    db = get_database()
    product = await db.products.find_one({"_id": ObjectId(id)})
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return serialize_product(product)

@router.get("/category/{category_id}")
async def get_products_by_category(category_id: str):
    db = get_database()
    cursor = db.products.find({"category": category_id})
    products = [serialize_product(p) async for p in cursor]
    return products

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(payload: ProductCreate):
    db = get_database()
    doc = payload.model_dump()
    doc["createdAt"] = datetime.utcnow()
    doc["updatedAt"] = datetime.utcnow()
    res = await db.products.insert_one(doc)
    doc["_id"] = str(res.inserted_id)
    return doc

@router.put("/{id}", response_model=ProductResponse)
async def update_product(id: str, payload: ProductUpdate):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Product ID format")
    db = get_database()
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided to update")

    update_data["updatedAt"] = datetime.utcnow()
    res = await db.products.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": update_data},
        return_document=True
    )
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return serialize_product(res)

@router.delete("/{id}")
async def delete_product(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Product ID format")
    db = get_database()
    res = await db.products.delete_one({"_id": ObjectId(id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return {"message": "Product deleted successfully"}
