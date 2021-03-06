import { CourseSelection } from "./course";
import { CourseDatabase } from "./course-database";
import { Course } from "./course";

export function courseSuggestions(
  selectedCourses: CourseSelection[],
  targetCourse: CourseSelection
): CourseSelection[] {
  // This is the top-down approach, user picks a course and we try to fill in the previous semesters with prereqs
  //determine previous semesters,year combos we can use
  //   (e.g if the target course is to be taken in Fall 2022, we have → Fall 2021, Spring 2022 left to use]

  //generate list ‘temp’ containing target course
  var temp = new Array<Course>();
  temp.push(targetCourse.course);
  let prereqs_left = true;

  // map Course to CourseSelection
  const mappings = new Map<Course, CourseSelection>();

  const currentYear = 2021;
  const currentSem = 1; //fall is odd, spring is even

  var targetSem = 0;
  if (targetCourse.semester == "fall") targetSem = 1;

  var targetYear = targetCourse.year;

  //these are used in the loop case, they count backwards
  //the first round of prereqs we add must be put in the semester prior to the targetSem, targetYear pair

  if (targetSem == 0) {
    targetYear -= 1;
    targetSem = 1;
  } else {
    targetSem = 0;
  }

  //generate ‘target’ = semester+year combo for target course
  //loop

  const added = new Set();
  while (prereqs_left) {
    //replace all courses in ‘temp’ with their prerequisites list

    //temp2 will have the new list, we replace temp with temp2
    let temp2: Course[];
    temp2 = new Array<Course>();
    //for each course in temp
    temp.forEach((course) => {
      //console.log(course.name)
      const prereq_list = course.prereqs;

      //for each prereq in the prereq courses
      prereq_list.forEach((prereq) => {
        console.log("prereq: " + prereq);
        const course_form = convert_string_to_course(prereq);

        if (course_form.name != "undef") {
          if (!added.has(course_form)) {
            added.add(course_form);
            console.log(
              "added " +
                course_form.name +
                " with date " +
                convert_num_to_sem(targetSem) +
                " " +
                targetYear
            );
            temp2.push(course_form);

            //generate the course, add to output schedule
            const course_temp: Partial<CourseSelection> = {};
            course_temp.course = course_form;
            course_temp.semester = convert_num_to_sem(targetSem);
            course_temp.year = targetYear;

            mappings.set(course_form, course_temp as CourseSelection);
          } else {
            //we already added the course, but we need it as a prereq earlier in the schedule

            //replace prior mappings
            const course_temp: Partial<CourseSelection> = {};
            course_temp.course = course_form;
            course_temp.semester = convert_num_to_sem(targetSem);
            course_temp.year = targetYear;

            console.log(
              "altered " +
                course_form.name +
                " to date " +
                convert_num_to_sem(targetSem) +
                " " +
                targetYear
            );

            mappings.set(course_form, course_temp as CourseSelection);
          }
        } //end of sanity check conditional --> trying to use continue throws an error message?
      }); //end of prereq adding loop
    }); //end of course based loop

    console.log("end of course loop");

    //replace temp with temp2, all prereqs added
    temp = [...temp2];

    if (
      (targetYear < currentYear ||
        (targetYear == currentYear && targetSem < currentSem)) &&
      temp.length > 0
    ) {
      console.log("imposs " + targetYear + " " + targetSem);
      //schedule is impossible!
      const issue_output = new Array<CourseSelection>();
      //console.log("returned schedule!")

      return issue_output;
    }
    //adjust the semester, year variables
    if (targetSem == 0) {
      targetSem = 1;
      targetYear -= 1;
    } else {
      targetSem -= 1;
    }

    //console.log("Courses in temp at the end of the loop")
    //temp.forEach(element => { console.log("Course= " + element.name)

    //recheck while loop condition here
    if (temp.length == 0) {
      prereqs_left = false;
    }
  } //end of while loop

  //TODO in future versions:
  //Validity checks:
  //check credit hours per semester for feasibility [assuming no overloads, so 18 credit hour max]
  //return the entire list if this works, empty list if it is impossible

  //our final mappings contains the full set of courses needed
  //generate the list to return here
  const output_schedule = new Array<CourseSelection>();
  for (const key of mappings.keys()) {
    output_schedule.push(mappings.get(key));
  }

  console.log("returned schedule!");
  return output_schedule;

  //throw new Error("method not implemented");
}

function convert_num_to_sem(semester: number): string {
  if (semester == 0) return "spring";
  else return "fall";
}

function convert_string_to_course(course_title: string): Course {
  if (!course_title.includes("CS")) {
    var invalid_course: Partial<Course> = {};
    invalid_course.name = "undef";
    return invalid_course as Course;
  }
  return CourseDatabase.getInstance().getCourseById(course_title);
}
