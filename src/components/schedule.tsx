import * as React from "react";
import { Course, CourseSelection } from "../model/course";
import { CourseDatabase } from "../model/course-database";
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
  const courseDatabase = CourseDatabase.getInstance();

  type Row = {
    semester: "fall" | "spring";
    year: number;
    selectedCourses: (CourseSelection & { tentative?: boolean })[];
  };

  const rows: Row[] = semesters.map((sem) => ({
    ...sem,
    selectedCourses: new Array(5).fill(null),
  }));

  selectedCourses.forEach(
    (selection) =>
      (rows.find(
        (row) =>
          row.semester === selection.semester && row.year === selection.year
      ).selectedCourses[selection.position] = selection)
  );

  const tentativeSelections: (CourseSelection & { tentative: true })[] = [];
  rows.forEach((row, i) => {
    if (i === 0) return;

    const prevRow = rows[i - 1];
    const previouslyTaken: CourseSelection[] = []
      .concat(...rows.map((row) => row.selectedCourses))
      .filter((x) => x);
    const followupCourses: string[] = []
      .concat(
        ...prevRow.selectedCourses.map(
          (selectedCourse) =>
            !selectedCourse?.tentative && selectedCourse?.course.followupCourses
        )
      )
      .filter((x) => x /* filter out falsy values */)
      .filter(
        (followup) =>
          /* filter courses already selected or suggested */
          ![...tentativeSelections, ...selectedCourses].find(
            (selection) => selection.course.id.slice(0, 5) === followup
          )
      )
      .filter((followup) =>
        /* filter out courses where prereqs are not met */
        courseDatabase
          .getCourseById(followup)
          .prereqs.map(
            (prereq) =>
              !!previouslyTaken.find(
                (selection) => selection.course.id.slice(0, 5) === prereq
              )
          )
          .reduce((a, b) => a && b, true)
      );
    let j = 0;
    row.selectedCourses.forEach((selection, k) => {
      if (!selection && j < followupCourses.length) {
        const tentativeSelection = {
          course: courseDatabase.getCourseById(followupCourses[j++]),
          year: row.year,
          semester: row.semester,
          position: k,
          tentative: true as const,
        };
        row.selectedCourses[k] = tentativeSelection;
        tentativeSelections.push(tentativeSelection);
      }
    });
  });

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
  selectedCourses: (CourseSelection & { tentative?: boolean })[];
  onTileEvent: TileEventHandler;
  onCellRef: (cell: CellData, ref: HTMLDivElement) => void;
}) => {
  return (
    <div className={styles.row} key={`${year}-${semester}`}>
      <p>
        {semester} {year}
      </p>
      {selectedCourses.map((selectedCourse, position) => {
        return (
          <Cell
            key={position}
            selectedCourse={selectedCourse}
            onTileEvent={onTileEvent}
            ref={(ref) => onCellRef({ semester, year, position }, ref)}
          />
        );
      })}
    </div>
  );
};

const Cell = React.forwardRef(
  (
    {
      selectedCourse,
      onTileEvent,
    }: {
      selectedCourse: CourseSelection & { tentative?: boolean };
      onTileEvent: TileEventHandler;
    },
    ref: React.ForwardedRef<HTMLDivElement>
  ) => (
    <div className={styles.cell} ref={ref}>
      {selectedCourse?.course && (
        <CourseTile
          course={selectedCourse.course}
          onTileEvent={onTileEvent}
          key={selectedCourse.course.id}
          tentative={selectedCourse.tentative}
        />
      )}
    </div>
  )
);
