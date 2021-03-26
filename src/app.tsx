import * as React from "react";
import styles from "./app.module.css";
import { Palette } from "./components/palette";
import { useCourses } from "./hooks/use-courses";

export const App: React.FC = () => {
  const courses = useCourses();

  return (
    <div className={styles.container}>
      {courses && <Palette courses={courses} selectedCourses={[]} />}
    </div>
  );
};
