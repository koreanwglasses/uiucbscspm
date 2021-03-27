import * as React from "react";
import "./layout.css";
import styles from "./app.module.css";
import { DropEvent, TileEventHandler } from "./components/course-tile";
import { Palette } from "./components/palette";
import { getCellAt, Schedule } from "./components/schedule";
import { useCourses } from "./hooks/use-courses";
import { Course, CourseSelection } from "./model/course";

export const App: React.FC = () => {
  const courses = useCourses();
  const [selectedCourses, setSelectedCourses] = React.useState<
    CourseSelection[]
  >([]);

  const handleDropOnSchedule = (event: DropEvent) => {
    const newCourseSelection: CourseSelection = {
      ...getCellAt(event.parentEvent.clientX, event.parentEvent.clientY),
      course: event.course,
    };

    setSelectedCourses([
      ...selectedCourses.filter(
        (selectedCourse) => selectedCourse.course.id !== event.course.id
      ),
      newCourseSelection,
    ]);
  };

  const handleTileEvent: TileEventHandler = (event) => {
    if (event.type === "drop") {
      console.log(`Dropped ${event.course.id} onto ${event.target}`);
      if (event.target === "schedule") {
        handleDropOnSchedule(event);
      }
    }
    return false;
  };

  return (
    <div className={styles.container}>
      <div className={styles.panelsContainer}>
        <div className={styles.scheduleContainer}>
          <Schedule
            selectedCourses={selectedCourses}
            onTileEvent={handleTileEvent}
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
