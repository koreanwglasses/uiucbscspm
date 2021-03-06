import * as React from "react";
import "./layout.css";
import styles from "./app.module.css";
import { DropEvent, TileEventHandler } from "./components/course-tile";
import { Palette } from "./components/palette";
import { getCellAt, Schedule } from "./components/schedule";
import { CourseSelection } from "./model/course";
import { CourseDatabase } from "./model/course-database";
import { verifyRequirements } from "./model/verify-requirements";

export const App: React.FC = () => {
  const courses = CourseDatabase.getInstance().getAllCourses();
  const [selectedCourses, setSelectedCourses] = React.useState<
    CourseSelection[]
  >([]);

  const [suggestFollowupCourses, setSuggestFollowupCourses] = React.useState(
    true
  );
  const [
    suggestPrerequisiteCourses,
    setSuggestPrerequisiteCourses,
  ] = React.useState(false);

  const handleDropOnSchedule = (event: DropEvent) => {
    const cell = getCellAt(
      event.parentEvent.clientX,
      event.parentEvent.clientY
    );
    if (!cell) return false;

    if (
      selectedCourses.find(
        (selectedCourse) =>
          selectedCourse.semester === cell.semester &&
          selectedCourse.year === cell.year &&
          selectedCourse.position === cell.position
      )
    )
      return false;

    const newCourseSelection: CourseSelection = {
      ...cell,
      course: event.course,
    };

    setSelectedCourses([
      ...selectedCourses.filter(
        (selectedCourse) => selectedCourse.course.id !== event.course.id
      ),
      newCourseSelection,
    ]);

    return true;
  };

  const handleDropOnPalette = (event: DropEvent) => {
    const courseIndex = selectedCourses.findIndex(
      (selectedCourse) => event.course.id === selectedCourse.course.id
    );

    if (courseIndex === -1) return false;

    setSelectedCourses([
      ...selectedCourses.slice(0, courseIndex),
      ...selectedCourses.slice(courseIndex + 1),
    ]);

    return true;
  };

  const handleTileEvent: TileEventHandler = (event) => {
    if (event.type === "drop") {
      if (event.target === "schedule") {
        return handleDropOnSchedule(event);
      }
      if (event.target === "palette") {
        return handleDropOnPalette(event);
      }
    }
    return false;
  };

  return (
    <div className={styles.container}>
      <div className={styles.panelsContainer}>
        <div className={styles.scheduleContainer}>
          <h1>UIUC BSCS PM</h1>
          <p>
            Requirements met: {verifyRequirements(selectedCourses).join(", ")}
          </p>
          <input
            type="checkbox"
            defaultChecked={suggestFollowupCourses}
            onInput={(e) => setSuggestFollowupCourses(e.currentTarget.checked)}
          />{" "}
          Suggest Followup Courses <br />
          <input
            type="checkbox"
            defaultChecked={suggestPrerequisiteCourses}
            onInput={(e) =>
              setSuggestPrerequisiteCourses(e.currentTarget.checked)
            }
          />{" "}
          Suggest Prerequisite Courses <br />
          <br />
          <a href="https://github.com/koreanwglasses/uiucbscspm">
            View source on Github
          </a>
          <Schedule
            selectedCourses={selectedCourses}
            onTileEvent={handleTileEvent}
            suggestFollowupCourses={suggestFollowupCourses}
            suggestPrerequisiteCourses={suggestPrerequisiteCourses}
          />
        </div>
        <div className={styles.paletteContainer}>
          <Palette
            courses={courses}
            selectedCourses={selectedCourses}
            onTileEvent={handleTileEvent}
          />
        </div>
      </div>
    </div>
  );
};
