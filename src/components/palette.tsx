import * as React from "react";
import { Course, CourseSelection } from "../model/course";
import { CourseTile, DropTileEventHandler } from "./course-tile";
import styles from "./palette.module.css";

export const Palette: React.FC<{
  courses: Course[];
  selectedCourses: CourseSelection[];
  onDropTile: DropTileEventHandler;
}> = ({ courses, selectedCourses, onDropTile = () => false }) => {
  return (
    <div className={styles.palette}>
      {courses?.length && (
        // Be sure to pass onDropTile like I did here ┐ That's how data gets
        // passed back up to the main application     ↓
        <CourseTile course={courses[0]} onDropTile={onDropTile} />
      )}
    </div>
  );
};
