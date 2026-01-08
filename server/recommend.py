import json
from langchain_chroma import Chroma
from langchain_groq import ChatGroq
from get_embedding_function import get_embedding_function
from scheme_extractor import SCHEME_PROMPT
import os

CHROMA_PATH = "chroma"

def recommend_schemes(profile: dict):
    embedding_function = get_embedding_function()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    # 1️⃣ Build semantic query from profile
    query = f"""
    User Profile:
    Age: {profile['age']}
    Gender: {profile['gender']}
    Occupation: {profile['occupation']}
    Income: {profile['income']}
    Location: {profile['location']}
    Caste: {profile['casteCategory']}
    Disability: {profile['disability']}

    Find relevant government schemes.
    """

    # 2️⃣ Retrieve chunks
    results = db.similarity_search_with_score(query, k=6)

    schemes = []
    model = ChatGroq(
        model="llama-3.1-8b-instant",
        api_key=os.environ["GROQ_API_KEY"]
    )

    for doc, _score in results:
        prompt = SCHEME_PROMPT.format(
            context=doc.page_content
        )

        response = model.invoke(prompt)
        try:
            scheme = json.loads(response.content)
            scheme["source"] = doc.metadata.get("source", "")
            schemes.append(scheme)
        except Exception:
            continue

    return schemes
