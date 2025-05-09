from agent import agent

from dotenv import load_dotenv
load_dotenv()

with open("tmp/cv_bsc_2019_sose25.pdf.extract", "r") as f:
    lecture_dates = f.read()

current_semester = 1

modules = """
{
    "semester": 1,
    "modules": [
        {"name": "Programmierung und Modellierung", "ects": 6},
        {"name": "Praktikum Programmierung und Modellierung", "ects": 3},
        {"name": "Grundlagen der Mathematik A: Lineare Algebra 1 / Analysis 1", "ects": 10},
        {"name": "Einführung in die Computervisualistik A", "ects": 3},
        {"name": "Grundlagen der Rechnerarchitektur", "ects": 6},
        {"name": "Fachwissenschaftliche Voraussetzungen", "ects": 5}
    ]
}
"""

time_slot_constraints = """
The student works on Monday.
The student doesn't want to study after 14:00 on Wednesdays.
"""

curriculum = """
{
  "curriculum": [
    {
      "semester": 1,
      "modules": [
        {"module": "Programmierung und Modellierung", "ects": 6},
        {"module": "Praktikum Programmierung und Modellierung", "ects": 3},
        {"module": "Grundlagen der Mathematik A: Lineare Algebra 1 / Analysis 1", "ects": 10},
        {"module": "Einführung in die Computervisualistik A", "ects": 3},
        {"module": "Fachwissenschaftliche Voraussetzungen", "ects": 5},
        {"module": "Grundlagen der Rechnerarchitektur", "ects": 6}
      ]
    },
    {
      "semester": 2,
      "modules": [
        {"module": "Algorithmen und Datenstrukturen", "ects": 9},
        {"module": "Grundlagen der Mathematik B: Lineare Algebra 2 / Analysis 2", "ects": 9},
        {"module": "Einführung in die Computervisualistik B", "ects": 3},
        {"module": "Praktikum CV-Programmierung", "ects": 2},
        {"module": "Grundlagen der Softwaretechnik", "ects": 6},
        {"module": "Bildverarbeitung 1", "ects": 7}
      ]
    },
    {
      "semester": 3,
      "modules": [
        {"module": "Bildverarbeitung 2", "ects": 5},
        {"module": "Computergraphik 1", "ects": 7},
        {"module": "Grundlagen der Theoretischen Informatik", "ects": 9},
        {"module": "Wahrnehmung und Kognition", "ects": 6},
        {"module": "Wahlpflicht Informatik", "ects": 6}
      ]
    },
    {
      "semester": 4,
      "modules": [
        {"module": "Computergraphik 2", "ects": 5},
        {"module": "Grundlagen der medizinischen Visualisierung", "ects": 6},
        {"module": "Logik für Informatiker", "ects": 6},
        {"module": "Räumliches Denken", "ects": 3},
        {"module": "Einführung in das Zeichnen", "ects": 3},
        {"module": "Wahlpflicht CV oder Informatik", "ects": 6}
      ]
    },
    {
      "semester": 5,
      "modules": [
        {"module": "Projektpraktikum", "ects": 10},
        {"module": "Proseminar", "ects": 3},
        {"module": "Projektmanagement", "ects": 6},
        {"module": "Einführung in die Software-Ergonomie", "ects": 6},
        {"module": "Interdisziplinärer Bereich Wahlmodul", "ects": 6}
      ]
    },
    {
      "semester": 6,
      "modules": [
        {"module": "Bachelorarbeit", "ects": 12},
        {"module": "Kolloquium", "ects": 3},
        {"module": "Interdisziplinärer Bereich Wahlmodul", "ects": 6},
        {"module": "Informatik der Systeme Wahlmodul", "ects": 6},
        {"module": "Interdisziplinärer Bereich Wahlmodul", "ects": 3}
      ]
    }
  ]
}
"""

prompt = initial_semester_part=f"""
You are planning the first semester of a student.

"""

ongoing_semester_part=f"""
You are planning semester {current_semester} of a student.

"""


prompt=f"""
Only include tokens in your response when explicitly asked for. Do not include any other tokens.
You are a uni planner assistant. You help students to plan their studies.
{initial_semester_part if current_semester == 1 else ongoing_semester_part}
You will be given a document containing lecture and tutorial dates for the upcoming semester.
You will find the dates for lectures and tutorials inbetween this specific token-pattern:
VVV
...
VVV

You will be given a set of modules (lecture and/or tutorial) in json format.
You can expect their counterparts within the document containing lecture and tutorial dates.
You will find the modules inbetween this specific token-pattern:
MMM
...
MMM

You will be given time slot constraint in natural language.
You will find the time slot constraint inbetween this specific token-pattern:
TTT
...
TTT

You will be given a curriculum in json format.
You will find the curriculum inbetween this specific token-pattern:
JJJ
...
JJJ

Otherwise generate a weekly timetable in json format by picking modules from the set of modules and assigning them to the time slots from the document containing lecture and tutorial dates.
If there is a conflict with other modules, pick one of them randomly.
If there is a conflict between a module and a time slot constraint, consider pre-empting a module from the curriculum, if it complies with all other time constraints and doesn't conflict with another module.
If few modules are selected from the set of modules, consider pre-empting a module from the curriculum, if it complies with all other time constraints and doesn't conflict with another module.
When considering pre-empting a module, rather pick modules from semester coming up sooner.
Include the generated json-string inbetween this specific token-pattern:
PPP
...
PPP

Finally, list all modules where a conflict with another module or a time constraint occured.

---

VVV
{lecture_dates}
VVV

MMM
{modules}
MMM

TTT
{time_slot_constraints}
TTT

JJJ
{curriculum}
JJJ
"""

input(f"Token count: {len(prompt.split())}, press enter to continue...")

result = agent(
    deployment_name="gpt-4.5-preview",
    prompt=prompt,
    max_tokens=25000,
)
    
print(result)