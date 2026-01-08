from langchain_core.prompts import ChatPromptTemplate

SCHEME_PROMPT = ChatPromptTemplate.from_template("""
You are a government scheme information extractor.

Using ONLY the context below, extract ONE scheme in valid JSON:

Context:
{context}

Output JSON format:
{{
  "title": "",
  "category": "",
  "description": "",
  "eligibility": "",
  "documents": [],
  "applyLink": "",
  "source": ""
}}

Rules:
- Do NOT hallucinate
- If info missing, write "Not specified"
- Output JSON only
""")
