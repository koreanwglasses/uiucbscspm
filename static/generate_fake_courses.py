import json
import os

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))

def generate_course(num):
    return {
        "id": f"CS{num:03d}",
        "name": f"CS {num:03d}",
        "creditHours": 3,
        "semestersOffered": ["fall", "spring"],
        "requirementsSatisfied": [],
        "prereqs": [],
        "followupCourses": []
    }

classes = [{
    "id": "CS467_3",
    "name": "CS 467",
    "description": "Social Visualiation\n\n<description>",
    "creditHours": 3,
    "semestersOffered": ["fall"],
    "requirementsSatisfied": [],
    "prereqs": [],
    "followupCourses": []
}, *(generate_course(num) for num in range(10))]

json.dump(classes, open(os.path.join(SCRIPT_DIR, 'courses.json'), 'w'))
