import * as React from "react";
import { CourseSelection } from "../model/course";
import { range } from "../utils";
import { CourseTile, TileEventHandler } from "./course-tile";
import styles from "./schedule.module.css";

export const Schedule: React.FC<{
  selectedCourses: CourseSelection[];
  onTileEvent: TileEventHandler;
}> = ({ selectedCourses, onTileEvent }) => {
  type Row = {
    semester: "fall" | "spring";
    year: number;
    selectedCourses: CourseSelection[];
  };

  const rows: Row[] = [
    {
      semester: "fall",
      year: 2021,
      selectedCourses: [],
    },
    {
      semester: "spring",
      year: 2022,
      selectedCourses: [],
    },
    {
      semester: "fall",
      year: 2022,
      selectedCourses: [],
    },
    {
      semester: "spring",
      year: 2023,
      selectedCourses: [],
    },
    {
      semester: "fall",
      year: 2023,
      selectedCourses: [],
    },
    {
      semester: "spring",
      year: 2024,
      selectedCourses: [],
    },
    {
      semester: "fall",
      year: 2024,
      selectedCourses: [],
    },
    {
      semester: "spring",
      year: 2025,
      selectedCourses: [],
    },
  ];

  selectedCourses.forEach((selectedCourse) =>
    rows
      .find(
        (row) =>
          row.semester === selectedCourse.semester &&
          row.year === selectedCourse.year
      )
      .selectedCourses.push(selectedCourse)
  );

  return (
    <div className={styles.schedule}>
      <h1>Schedule</h1>
      {rows.map(({ semester, year, selectedCourses }) => (
        <div className={styles.row} key={`${year}-${semester}`}>
          <p>
            {semester} {year}
          </p>
          {range(
            Math.max(5, ...selectedCourses.map(({ position }) => position))
          ).map((i) => {
            const selectedCourse = selectedCourses.find(
              ({ position }) => position === i
            );
            return (
              <div className={styles.cell} key={i}>
                {selectedCourse && (
                  <CourseTile
                    course={selectedCourse.course}
                    onTileEvent={onTileEvent}
                    key={selectedCourse.course.id}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
