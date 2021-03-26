import * as React from "react";
import { CourseSelection } from "../model/course";
import { CourseTile, DropTileEventHandler } from "./course-tile";
import styles from "./schedule.module.css";

export const Schedule: React.FC<{
  selectedCourses: CourseSelection[];
  onDropTile: DropTileEventHandler;
}> = ({ selectedCourses, onDropTile = () => false }) => {
  return (
    <div className={styles.schedule}>
      {selectedCourses?.length ? (
        <CourseTile
          course={selectedCourses[0].course}
          onDropTile={onDropTile}
        />
      ) : (
        "no courses selected"
      )}
    </div>
  );
};
