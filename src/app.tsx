import * as React from "react";
import styles from "./app.module.css";
import { DropTileEventHandler } from "./components/course-tile";
import { Palette } from "./components/palette";
import { Schedule } from "./components/schedule";
import { useCourses } from "./hooks/use-courses";

export const App: React.FC = () => {
  const courses = useCourses();

  const handleDropTile: DropTileEventHandler = (
    course,
    target,
    event,
    data
  ) => {
    console.log(`Dropped ${course.id} onto ${target}`);
    return false;
  };

  return (
    <div className={styles.container}>
      <Schedule selectedCourses={[]} onDropTile={handleDropTile} />
      <Palette
        courses={courses}
        selectedCourses={[]}
        onDropTile={handleDropTile}
      />
    </div>
  );
};
