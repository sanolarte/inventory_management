from abc import ABC, abstractmethod
from typing import List, Optional
from app.domain.models import Product

class ProductRepository(ABC):
    @abstractmethod
    def list_all(self) -> List[Product]:
        """Retrieve all products"""
        raise NotImplementedError
    
    def retrieve_product(self) -> Product:
        """Get one product by id"""
        raise NotImplementedError
