import * as React from "react";
import { CourseSelection } from "../model/course";
import { CourseDatabase } from "../model/course-database";
import { courseSuggestions } from "../model/course-suggestions";
import { verifyPrerequisites } from "../model/verify-prerequisites";
import { JSONMap } from "../utils";
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
  selectedCourses: (CourseSelection & { tentative?: boolean })[];
  onTileEvent: TileEventHandler;
  suggestFollowupCourses?: boolean;
  suggestPrerequisiteCourses?: boolean;
}> = ({
  selectedCourses,
  onTileEvent,
  suggestFollowupCourses = false,
  suggestPrerequisiteCourses = false,
}) => {
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

  const findRowBySemester = ({
    semester,
    year,
  }: {
    semester: string;
    year: number;
  }) => rows.find((row) => row.semester === semester && row.year === year);

  selectedCourses.forEach(
    (selection) =>
      (findRowBySemester(selection).selectedCourses[
        selection.position
      ] = selection)
  );

  const tentativeSelections: (CourseSelection & { tentative: true })[] = [];
  const addTentativeSelection = (
    selection: CourseSelection & { tentative?: true }
  ) => {
    if (
      [...tentativeSelections, ...selectedCourses].find(
        (existingSelection) =>
          existingSelection.course.id.slice(0, 5) ===
          selection.course.id.slice(0, 5)
      )
    )
      /* Skip if already added */
      return;

    const row = findRowBySemester(selection);
    const position = row.selectedCourses.findIndex(
      (x) => !x /* find first empty slot */
    );

    const tentativeSelection = {
      ...selection,
      position,
      tentative: true as const,
    };
    row.selectedCourses[position] = tentativeSelection;
    tentativeSelections.push(tentativeSelection);
  };

  if (suggestPrerequisiteCourses) {
    /**
     * Selections whose prerequisites are not met
     */
    const targets = selectedCourses.filter(
      (selection) => !verifyPrerequisites(selectedCourses, selection)
    );

    []
      .concat(
        /* get suggestions for all target courses*/
        ...targets.map((target) => courseSuggestions(selectedCourses, target))
      )
      .forEach(
        (selection) => addTentativeSelection(selection) /* Show suggestion */
      );
  }

  if (suggestFollowupCourses) {
    rows.forEach((row, i) => {
      if (i === 0) return;

      const { semester, year } = row;

      const prevRow = rows[i - 1];
      []
        .concat(
          /* get all followup courses from previous row */
          ...prevRow.selectedCourses.map(
            (selectedCourse) =>
              !selectedCourse?.tentative &&
              selectedCourse?.course.followupCourses
          )
        )
        .filter((x) => x /* filter out falsy values */)
        .filter((followup) =>
          /* filter out courses where prereqs are not met */
          verifyPrerequisites(selectedCourses, {
            course: courseDatabase.getCourseById(followup),
            semester,
            year,
          })
        )
        .forEach((followup) =>
          /* Show suggestions */
          addTentativeSelection({
            course: courseDatabase.getCourseById(followup),
            semester,
            year,
          })
        );
    });
  }

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
      {[...tentativeSelections, ...selectedCourses].map((selectedCourse, i) => {
        const prequisiteSelections = [
          ...tentativeSelections,
          ...selectedCourses,
        ].filter(
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
          const tentative =
            prequisiteSelection.tentative || selectedCourse.tentative;
          return (
            start &&
            end && (
              <Connector
                start={start}
                end={end}
                key={`${i},${j}`}
                opacity={tentative ? 0.25 : 1}
              />
            )
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
