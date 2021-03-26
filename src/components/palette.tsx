import * as React from "react";
import { Course, CourseSelection } from "../model/course";
import { CourseTile, TileEventHandler } from "./course-tile";
import styles from "./palette.module.css";

export const Palette: React.FC<{
  courses: Course[];
  selectedCourses: CourseSelection[];
  onTileEvent: TileEventHandler;
}> = ({ courses, selectedCourses, onTileEvent }) => {
  return (
    <div className={styles.palette}>
      {courses?.length && (
        // Be sure to pass onDropTile like I did here ┐ That's how data gets
        // passed back up to the main application     ↓
        <CourseTile course={courses[0]} onTileEvent={onTileEvent} />
      )}
    </div>
  );
};
