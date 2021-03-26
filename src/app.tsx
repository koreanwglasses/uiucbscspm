import * as React from "react";
import styles from "./app.module.css";
import { TileEventHandler } from "./components/course-tile";
import { Palette } from "./components/palette";
import { Schedule } from "./components/schedule";
import { useCourses } from "./hooks/use-courses";

export const App: React.FC = () => {
  const courses = useCourses();

  const handleTileEvent: TileEventHandler = (course, event) => {
    if (event.type === "drop") {
      console.log(`Dropped ${course.id} onto ${event.target}`);
    }
    return false;
  };

  return (
    <div className={styles.container}>
      <Schedule selectedCourses={[]} onTileEvent={handleTileEvent} />
      <Palette
        courses={courses}
        selectedCourses={[]}
        onTileEvent={handleTileEvent}
      />
    </div>
  );
};
