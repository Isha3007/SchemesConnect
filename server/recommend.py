import json
import os
from langchain_chroma import Chroma
from langchain_groq import ChatGroq
from get_embedding_function import get_embedding_function
from scheme_extractor import SCHEME_PROMPT

CHROMA_PATH = "chroma"

def recommend_schemes(profile: dict):
    INCOME_MAP = {
        "Below 2.5 Lakh": "<250000",
        "2.5L-5L": "250000-500000",
        "5L-10L": "500000-1000000",
        "Above 10L": ">1000000"
    }

    normalized_income = INCOME_MAP.get(
        profile.get("income"),
        "Not specified"
    )
    embedding_function = get_embedding_function()
    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embedding_function
    )

    query = f"""
    Age: {profile['age']}
    Gender: {profile['gender']}
    Occupation: {profile['occupation']}
    Income: {normalized_income}
    Location: {profile['location']}
    Caste: {profile['casteCategory']}
    Disability: {profile['disability']}

    Recommend relevant Indian government schemes.
    """

    results = db.similarity_search_with_score(query, k=10)

    model = ChatGroq(
        model="llama-3.1-8b-instant",
        api_key=os.environ["GROQ_API_KEY"],
        temperature=0.2
    )

    seen_titles = set()
    schemes = []

    for doc, score in results:
        prompt = SCHEME_PROMPT.format(
                    context=doc.page_content,
                    age=profile["age"],
                    gender=profile["gender"],
                    occupation=profile["occupation"],
                    income=profile["income"],
                    location=profile["location"],
                    caste=profile["casteCategory"],
                    disability=profile["disability"],
                )

        response = model.invoke(prompt)

        try:
            scheme = json.loads(response.content)
            result = json.loads(response.content)

            if result.get("irrelevant"):
                continue

            title = scheme.get("title", "").strip()
            if not title or title in seen_titles:
                continue

            seen_titles.add(title)

            scheme["id"] = len(schemes) + 1
            scheme["confidence"] = round(1 - score, 2)
            scheme["source"] = doc.metadata.get("source", "Government Portal")

            schemes.append(scheme)

        except Exception:
            continue

    return schemes
