import os
import json
import csv

path_info = 'info.csv'
path_terms = 'terms.csv'

Courses = []

# useful for ensuring paths are consistent. Use with os.path.join(SCRIPT_DIR, ...)
SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))

with open(path_info, 'r') as f:
    reader = csv.reader(f)
    for row in reader:  # Each row is info of one course
        dic = {'id': row[0], 'name': row[1], 'description': row[2], 'creditHours': int(row[4]), 'semestersOffered':[],
               'requirementsSatisfied': [], 'prereqs': row[3].strip('[').strip(']').strip("'").split("', '"),
               'followupCourses': []}
        if dic['prereqs'] == ['']:
            dic['prereqs'] == []
        Courses.append(dic)

with open(path_terms, 'r') as t:
    reader1 = csv.reader(t)
    for row in reader1:
        for course in Courses:
            if row[0] == course['name']:
                semesters = []
                if len(row) > 1:
                    for col in range(1, len(row)):
                        semesters.append(row[col])
                course['semestersOffered'] = semesters
                break

# print(Courses)

# Requirement satisfied


with open(os.path.join(SCRIPT_DIR, "courses.json"), "w") as c:
    json.dump(Courses, c)
