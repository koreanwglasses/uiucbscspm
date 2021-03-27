import * as React from "react";
import { Course, CourseSelection } from "../model/course";
import { CourseTile, TileEventHandler } from "./course-tile";
import styles from "./palette.module.css";

export const isPalette = (element: HTMLElement) =>
  element.classList.contains(styles.palette);

export const Palette: React.FC<{
  courses: Course[];
  selectedCourses: CourseSelection[];
  onTileEvent: TileEventHandler;
}> = ({ courses, selectedCourses, onTileEvent }) => {
  // We only want to show the courses that have not yet been selected, so
  // we filter them out here
  //
  // This is slow O(n^2), that its okay for now
  const unselectedCourses = courses?.filter(
    (course) =>
      !selectedCourses.find(
        (selectedCourse) => course.id === selectedCourse.course.id
      )
  );

  return (
    <div className={styles.palette}>
      {/* We can use .map here to create a CourseTile component for each unselected course */}
      {unselectedCourses?.map((course) => (
        // Be sure to pass in onTileEvent and key the way it is here when you
        // make CourseTiles
        <CourseTile course={course} onTileEvent={onTileEvent} key={course.id} />
      ))}
    </div>
  );
};
