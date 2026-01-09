from langchain_core.prompts import ChatPromptTemplate

SCHEME_PROMPT = ChatPromptTemplate.from_template("""
You are an expert government policy analyst.

USER PROFILE:
Age: {age}
Gender: {gender}
Occupation: {occupation}
Income: {income}
Location: {location}
Caste: {caste}
Disability: {disability}

From the CONTEXT below, extract ONE government scheme ONLY IF it is relevant to the user profile.
If NOT relevant, return:
{{ "irrelevant": true }}

CONTEXT:
{context}

If relevant, return ONLY valid JSON:

{{
  "title": "",
  "category": "",
  "description": "",
  "eligibility": "",
  "documents": [],
  "applyLink": "",
  "source": "",
  "whyRecommended": ""
}}

Rules:
- Do NOT hallucinate
- If income/occupation/location do NOT match eligibility → mark irrelevant
- Understand income ranges like:
  "Below 2.5 Lakh" = income < 250000
- Output JSON ONLY
""")
