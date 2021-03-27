import * as React from "react";
import { CourseSelection } from "../model/course";
import { range } from "../utils";
import { CourseTile, TileEventHandler } from "./course-tile";
import styles from "./schedule.module.css";

const semesters: { semester: "fall" | "spring"; year: number }[] = [
  {
    semester: "fall",
    year: 2021,
  },
  {
    semester: "spring",
    year: 2022,
  },
  {
    semester: "fall",
    year: 2022,
  },
  {
    semester: "spring",
    year: 2023,
  },
  {
    semester: "fall",
    year: 2023,
  },
  {
    semester: "spring",
    year: 2024,
  },
  {
    semester: "fall",
    year: 2024,
  },
  {
    semester: "spring",
    year: 2025,
  },
];

export const getCellAt = (clientX: number, clientY: number) => {
  const elements = document.elementsFromPoint(clientX, clientY);

  const cell = elements.find((elem) => elem.classList.contains(styles.cell));

  if (!cell) return undefined;

  const row = cell.parentElement;
  const position = [...row.children].indexOf(cell) - 1;
  const rowIndex = [...row.parentElement.children].indexOf(row);
  const { semester, year } = semesters[rowIndex];

  return { semester, year, position };
};

export const isSchedule = (element: HTMLElement) =>
  element.classList.contains(styles.schedule);

export const Schedule: React.FC<{
  selectedCourses: CourseSelection[];
  onTileEvent: TileEventHandler;
}> = ({ selectedCourses, onTileEvent }) => {
  type Row = {
    semester: "fall" | "spring";
    year: number;
    selectedCourses: CourseSelection[];
  };

  const rows: Row[] = semesters.map((sem) => ({ ...sem, selectedCourses: [] }));

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
      <div>
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
    </div>
  );
};
