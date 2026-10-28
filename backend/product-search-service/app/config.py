from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PORT: int = 5002
    HOST: str = "0.0.0.0"
    MONGO_URI: str = "mongodb://localhost:27017"
    DB_NAME: str = "ecommerce_products_db"
    DEBUG: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
