import { CourseSelection } from "./course";

/**
 * Returns a list of requirements that are satisfied
 */
export function verifyRequirements(
  selectedCourses: CourseSelection[]
): string[] {
  // enhanced for loop this into this format
  //    {“semester/year” → [courses]}
  /* Generate list of “grad requirements”
        - General requirements:
            -CS 125, 126, 173, 225, 233, 241, 357, 361, 374, 421
        - COMPUTER SCIENCE TECHNICAL AND ADVANCED ELECTIVES [at least 6 courses with at least 18 credit hours total]
            -Team project requirement [1 course]
            -Focus areas [at least 3 courses in one subcategory]
-General Advanced Electives [minimum of 6.0 credit hours needed]    
    */
  // confirm credit hours, courses match → find “a” valid mapping
  // track all reqs fulfilled by mapping courses, return this list
  throw new Error("method not implemented");
}
