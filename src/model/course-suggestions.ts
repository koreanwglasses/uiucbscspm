import { CourseSelection } from "./course";

export function courseSuggestions(
  selectedCourses: CourseSelection[],
  targetCourse: CourseSelection
): CourseSelection[] {
  // This is the top-down approach, user picks a course and we try to fill in the previous semesters with prereqs
  //determine previous semesters,year combos we can use
  //   (e.g if the target course is to be taken in Fall 2022, we have → Fall 2021, Spring 2022 left to use]

  //generate list ‘temp’ containing target course
  const temp = [targetCourse.course];
  const prereqs_left = true;

  // map semester + year combo to courses to take
  const mappings = new Map();

  const currentYear = 2021;
  const currentSem = 0; //fall is odd, spring is even

  let targetSem = 0;
  if (targetCourse.semester == "fall") targetSem = 1;

  let targetYear = targetCourse.year;

  //these are used in the loop case, they count backwards
  //the first round of prereqs we add must be put in the semester prior to the targetSem, targetYear pair
  targetSem = (targetSem - 1) % 2;

  if (targetSem == 1) targetYear -= 1;

  //generate ‘target’ = semester+year combo for target course
  //loop
  while (prereqs_left) {
    //replace all courses in ‘temp’ with their prerequisites list
    var added = new Set();
    let temp2: string[];
    //for each course in temp
    temp.forEach((course) => {
      const prereq_list = course.prereqs;

      //for each prereq in the prereq courses
      prereq_list.forEach((prereq) => {
        if (!added.has(prereq)) {
          added.add(prereq);
          temp2.push(prereq);
          mappings.set(prereq, convert(targetSem) + " " + targetYear);
        }
      });

      //need conversion between prereqs as a string and a Course object
      // temp = temp2
    });
  }

  //remove any prerequisites that are already in selectedCourses
  //add entire contents of ‘temp’ to schedule of ‘target’ - 1
  //end of loop - schedule is generated
  //check for validity
  //if a course is duplicated across semesters, choose the earliest time it exists and remove the other instances
  //generate a list of courses added with numbers representing time
  //loop backwards through list, ensure all courses with prerequisites have them met with lower time numbers than the target course
  //check credit hours per semester for feasibility [assuming no overloads, so 18 credit hour max]
  //return the entire list if this works, empty list if it is impossible

  throw new Error("method not implemented");
}

function convert(semester: number): string {
  if (semester == 0) return "Spring";
  else return "Fall";
}
