import * as fs from "fs/promises";
import * as path from "path";
import { Course, CourseSelection } from "../model/course";
import { courseSuggestions } from "../model/course-suggestions";
import { verifyRequirements } from "../model/verify-requirements";

(async () => {
  console.log(">>> Loading courses from static/courses.json ...");

  const coursesJson = await fs.readFile(
    path.resolve(__dirname, "../../static/courses.json"),
    "utf8"
  );
  const courses = JSON.parse(coursesJson) as Course[];

  const findCourseById = (id: string) =>
    courses.find((course) => course.id === id);

  console.log(">>> Running courseSuggestions ... ");

  try {
    const selectedCourses: CourseSelection[] = [
      /* fill this with your input */
    ];

    const targetCourse: CourseSelection = {
      course: findCourseById("CS467_3"),
      semester: "spring",
      year: 2021,
    }; /* <-- replace this */

    const result = courseSuggestions(selectedCourses, targetCourse);
    console.log(">>> courseSuggestions returned:");
    console.log(result);
  } catch (e) {
    console.error(">>> courseSuggestions failed! Error:");
    console.error(e);
  }

  console.log(">>> Running verifyRequirements... ");
  try {
    const selectedCourses: CourseSelection[] = [
      /* fill this with your input */
    ];

    const result = verifyRequirements(selectedCourses);
    console.log(">>> verifyRequirements returned");
    console.log(result);
  } catch (e) {
    console.error(">>> verifyRequirements failed!");
    console.error(e);
  }
})();
