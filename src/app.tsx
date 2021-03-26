import * as React from "react";
import styles from "./app.module.css";
import { Course } from "./model/course";

export function App() {
  const coursesRef = React.useRef<Course[]>();
  React.useEffect(() => {
    (async () => {
      const response = await fetch("/static/courses.json");
      coursesRef.current = await response.json();
    })();
  }, []);

  return <div className={styles.container}>Hello World!</div>;
}
