from agent import agent

from dotenv import load_dotenv
load_dotenv()

with open("tmp/cv_bsc_2019_po.pdf.extract", "r") as f:
    po = f.read()

with open("tmp/cv_bsc_2019_curriculum.pdf.extract", "r") as f:
    curriculum = f.read()

formatted_documents = f"""
DDD DocA1.pdf
{po}
DDD DocA2.pdf
{curriculum}
DDD
"""

prompt=f"""
Only include tokens in your response when explicitly asked for. Do not include any other tokens.
You are a uni planner assistant. You help students to plan their studies.
You will be given at least one documents.
Alawys pick one as the examination regulation. Output NO REGULATION and nothing else if there is no suitable document.
If possible pick another document as the curriculum. Ignore it if there is no suitable document.
Tread any other document as a potential source for more information on regulations and curriculae. Weigh them sensibly.
You will find the documents inbetween this specific token-pattern:
DDD DocumentName1
Document1
DDD DocumentName2
Document2
DDD DocumentNamex
...
DDD

You will be given a formular. Only Replace the placeholders (marked by enclosing <>) in the formular by evaluating the contents from the chosen documents.
You will find the formular inbetween this specific token-pattern:
FFF
...
FFF
Include the filled out formular in your response including the enclosing tokens.

Finally, generate a curriculum in json format. If a curriculum was supplied and it complies with the regulations from the examination regulation, use both as a source for generating the curriculum.
Otherwise use the examination regulation as a source for generating the curriculum. Generate as many semesters as SEMESTER_REGULAR_DURATION specifies.
Include the generated json-string after the filled out formular and inbetween this specific token-pattern:
JJJ
...
JJJ

---

{formatted_documents}

FFF
- EXAMINATION_REGULATION: <name of the document>
- CURRICULUM: <name of the document or None if not available>
- ADDITIONAL_DOCUMENTS: [<name of document>, ...]
- FIELD_OF_STUDY: <name of the field of study>
- ACADEMICAL_DEGREE: <name of the degree (short form)>
- REQUIRED_ECTS: <number of required ECTS to graduate>
- SEMESTER_REGULAR_DURATION: <number of expected semesters>
- MAXIMUM_SEMESTER_DURATION: <number of maximum semesters or -1 if not defined>
- DEFINES_CORE_STUDIES: <true or false>
FFF
"""

input(f"Token count: {len(prompt.split())}, press enter to continue...")

result = agent(
    deployment_name="gpt-4.5-preview",
    prompt=prompt,
    max_tokens=100000,
)
    
print(result)