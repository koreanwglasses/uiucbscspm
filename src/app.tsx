import * as React from "react";
import styles from "./app.module.css";
import { Palette } from "./components/palette";
import { Course } from "./model/course";

export function App() {
  const coursesRef = React.useRef<Course[]>();
  React.useEffect(() => {
    (async () => {
      const response = await fetch("/static/courses.json");
      coursesRef.current = await response.json();
    })();
  }, []);

  return (
    <div className={styles.container}>
      <Palette
        courses={[{ id: "CS467", name: "CS467" } as Course]}
        selectedCourses={[]}
      />
    </div>
  );
}
