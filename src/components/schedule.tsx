import * as React from "react";
import { CourseSelection } from "../model/course";
import { JSONMap, range } from "../utils";
import { Connector } from "./connector";
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

export type CellData = { semester: string; year: number; position: number };

export const getCellAt = (clientX: number, clientY: number): CellData => {
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

  const cellRefs = React.useRef(new JSONMap<CellData, HTMLDivElement>());

  return (
    <div className={styles.schedule}>
      <h2>Schedule</h2>
      <div>
        {rows.map(({ semester, year, selectedCourses }, i) => (
          <Row
            key={i}
            year={year}
            semester={semester}
            selectedCourses={selectedCourses}
            onTileEvent={onTileEvent}
            onCellRef={(cell, ref) => cellRefs.current.set(cell, ref)}
          />
        ))}
      </div>
      {selectedCourses.map((selectedCourse, i) => {
        const prequisiteSelections = selectedCourses.filter(
          ({ course }) =>
            selectedCourse.course.prereqs.includes(course.id.slice(0, 5)) // TODO: make a more robust prereq searcher
        );

        return prequisiteSelections.map((prequisiteSelection, j) => {
          const start = cellRefs.current.get({
            semester: prequisiteSelection.semester,
            year: prequisiteSelection.year,
            position: prequisiteSelection.position,
          });
          const end = cellRefs.current.get({
            semester: selectedCourse.semester,
            year: selectedCourse.year,
            position: selectedCourse.position,
          });
          return (
            start &&
            end && <Connector start={start} end={end} key={`${i},${j}`} />
          );
        });
      })}
    </div>
  );
};

const Row = ({
  year,
  semester,
  selectedCourses,
  onTileEvent,
  onCellRef,
}: {
  year: number;
  semester: string;
  selectedCourses: CourseSelection[];
  onTileEvent: TileEventHandler;
  onCellRef: (cell: CellData, ref: HTMLDivElement) => void;
}) => (
  <div className={styles.row} key={`${year}-${semester}`}>
    <p>
      {semester} {year}
    </p>
    {range(Math.max(5, ...selectedCourses.map(({ position }) => position))).map(
      (position) => (
        <Cell
          key={position}
          selectedCourse={selectedCourses.find(
            (selectedCourse) => selectedCourse.position === position
          )}
          onTileEvent={onTileEvent}
          ref={(ref) => onCellRef({ semester, year, position }, ref)}
        />
      )
    )}
  </div>
);

const Cell = React.forwardRef(
  (
    {
      selectedCourse,
      onTileEvent,
    }: {
      selectedCourse: CourseSelection;
      onTileEvent: TileEventHandler;
    },
    ref: React.ForwardedRef<HTMLDivElement>
  ) => (
    <div className={styles.cell} ref={ref}>
      {selectedCourse && (
        <CourseTile
          course={selectedCourse.course}
          onTileEvent={onTileEvent}
          key={selectedCourse.course.id}
        />
      )}
    </div>
  )
);
