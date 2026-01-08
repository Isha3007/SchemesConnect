from pydantic import BaseModel
from typing import List

class Scheme(BaseModel):
    title: str
    category: str
    description: str
    eligibility: str
    documents: List[str]
    applyLink: str
    source: str
