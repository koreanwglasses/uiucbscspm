import { CourseSelection } from "./course";

export function courseSuggestions(
  selectedCourses: CourseSelection[],
  targetCourse: CourseSelection
) {
  // This is the top-down approach, user picks a course and we try to fill in the previous semesters with prereqs
  //determine previous semesters,year combos we can use
  //   (e.g if the target course is to be taken in Fall 2022, we have → Fall 2021, Spring 2022 left to use]
  //generate list ‘temp’ containing target course
  //generate ‘target’ = semester+year combo for target course
  //loop
  //replace all courses in ‘temp’ with their prerequisites list
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
