from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class CategoryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    image: Optional[str] = "no-image.jpg"

class CategoryCreate(CategoryBase):
    createdBy: Optional[str] = "system"

class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = None
    image: Optional[str] = None

class CategoryResponse(CategoryBase):
    id: str = Field(..., alias="_id")
    createdBy: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        populate_by_name = True

class CategoryPaginatedResponse(BaseModel):
    total: int
    page: int
    pages: int
    categories: List[CategoryResponse]
