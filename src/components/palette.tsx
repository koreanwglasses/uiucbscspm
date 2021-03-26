import * as React from "react";
import { Course, CourseSelection } from "../model/course";
import { CourseTile } from "./course-tile";

export const Palette: React.FC<{
  courses: Course[];
  selectedCourses: CourseSelection[];
}> = ({ courses, selectedCourses }) => {
  return (
    <div>
      <CourseTile course={courses[0]} />
    </div>
  );
};
