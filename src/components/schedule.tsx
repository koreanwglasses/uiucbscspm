import * as React from "react";
import { CourseSelection } from "../model/course";
import { CourseTile, TileEventHandler } from "./course-tile";
import styles from "./schedule.module.css";

export const Schedule: React.FC<{
  selectedCourses: CourseSelection[];
  onTileEvent: TileEventHandler;
}> = ({ selectedCourses, onTileEvent }) => {
  return (
    <div className={styles.schedule}>
      <h1>Schedule</h1>
      {selectedCourses?.length ? (
        <CourseTile
          course={selectedCourses[0].course}
          onTileEvent={onTileEvent}
        />
      ) : (
        "no courses selected"
      )}
    </div>
  );
};
