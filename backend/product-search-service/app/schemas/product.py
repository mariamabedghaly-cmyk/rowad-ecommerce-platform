from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime

class ProductBase(BaseModel):
    name: str = Field(..., min_length=3)
    description: str
    price: float = Field(..., gt=0)
    category: str
    stock: int = Field(default=0, ge=0)
    image: Optional[str] = "no-image.jpg"

class ProductCreate(ProductBase):
    createdBy: Optional[str] = "system"

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    category: Optional[str] = None
    stock: Optional[int] = Field(None, ge=0)
    image: Optional[str] = None

class ProductResponse(ProductBase):
    id: str = Field(..., alias="_id")
    category_detail: Optional[Any] = None
    createdBy: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        populate_by_name = True

class ProductPaginatedResponse(BaseModel):
    total: int
    page: int
    pages: int
    products: List[ProductResponse]
