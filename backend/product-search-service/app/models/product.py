from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ProductModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    name: str
    description: str
    price: float
    category: str
    stock: int = 0
    image: str = "no-image.jpg"
    createdBy: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
