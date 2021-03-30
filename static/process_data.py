import os
import json
import csv

path_info = 'info.csv'
path_terms = 'terms.csv'

Courses = []

# Requirement satisfied course lists
team_project = [427, 428, 429, 445, 465, 467, 493, 494, 497, 498]
software_foundations = [422, 426, 427, 428, 429, 476, 477, 492, 493, 494, 498, 522, 524, 526, 527, 528, 576, 598]
algorithm_and_models = [413, 473, 475, 476, 477, 481, 482, 498, 571, 572, 573, 574, 575, 576, 579, 583, 584, 598]
intelligence_and_big_data = [410, 411, 412, 414, 440, 443, 445, 446, 447, 466, 467, 498, 510, 511, 512, 543, 544, 546, 548, 566, 576, 598]
human_and_social_impact = [460, 461, 463, 465, 467, 468, 498, 563, 565]
media = [414, 418, 419, 445, 465, 467, 468, 498, 519, 565, 598]
scientific_parallel = [419, 450, 457, 466, 482, 483, 484, 498, 519, 554, 555, 556, 558]
distributed_systems = [423, 424, 425, 431, 436, 438, 439, 460, 461, 463, 483, 484, 498, 523, 524, 525, 538, 563]
machines = [423, 424, 426, 431, 433, 484, 498, 523, 526, 533, 536, 541, 584, 598]

# useful for ensuring paths are consistent. Use with os.path.join(SCRIPT_DIR, ...)
SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))

with open(path_info, 'r') as f:
    reader = csv.reader(f)
    for row in reader:  # Each row is info of one course
        dic = {'id': row[0], 'name': row[1], 'description': row[2], 'creditHours': int(row[4]), 'semestersOffered':[],
               'requirementsSatisfied': [], 'prereqs': row[3].strip('[').strip(']').strip("'").split("', '"),
               'followupCourses': []}
        if dic['prereqs'] == ['']:
            dic['prereqs'].pop(0)
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
for course in Courses:
    course_num = int(course['name'].split('CS')[1])
    if course_num in team_project:
        course['requirementsSatisfied'].append('Team Project')
    if course_num in software_foundations:
        course['requirementsSatisfied'].append('Software Foundations')
    if course_num in algorithm_and_models:
        course['requirementsSatisfied'].append('Algorithms and Models of Computation')
    if course_num in intelligence_and_big_data:
        course['requirementsSatisfied'].append('Intelligence and Big Data')
    if course_num in human_and_social_impact:
        course['requirementsSatisfied'].append('Human and Social Impact')
    if course_num in media:
        course['requirementsSatisfied'].append('Media')
    if course_num in scientific_parallel:
        course['requirementsSatisfied'].append('Scientific, Parallel, and High Performance Computing')
    if course_num in distributed_systems:
        course['requirementsSatisfied'].append('Distributed Systems, Networking, and Security')
    if course_num in machines:
        course['requirementsSatisfied'].append('Machines')

# Generate the followupCourses list
for course in Courses:
    for other_course in Courses:
        if course['name'] in other_course['prereqs']:
            if other_course['name'] not in course['followupCourses']:
                course['followupCourses'].append(other_course['name'])



with open(os.path.join(SCRIPT_DIR, "courses.json"), "w") as c:
    json.dump(Courses, c)
