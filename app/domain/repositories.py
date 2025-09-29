from abc import ABC, abstractmethod
from typing import List, Optional
from app.infrastructure.models import Product, User

class ProductRepository(ABC):
    @abstractmethod
    def list_all(self) -> List[Product]:
        """Retrieve all products"""
        raise NotImplementedError
    
    def retrieve_product(self) -> Product:
        """Get one product by id"""
        raise NotImplementedError

    def update(self) -> Product:
        """Update product by id"""
        raise NotImplementedError
    
    def delete(self):
        """Delete product by id"""
        raise NotImplementedError
    
    def create(self):
        """Create a new product"""
        raise NotImplementedError
    


class UserRepository(ABC):
    def get(self) -> User:
        """Get one user by username"""
        raise NotImplementedError