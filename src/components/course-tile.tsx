import * as React from "react";
import { Course } from "../model/course";

export const CourseTile: React.FC<{
  course: Course;
}> = ({ course }) => {
  return (
    <div
      style={{
        width: "200px",
        height: "50px",
        borderStyle: "solid",
        borderWidth: "1px",
      }}
    >
      {course.id}
    </div>
  );
};
