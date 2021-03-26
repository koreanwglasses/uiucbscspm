import * as React from "react";
import { Course } from "../model/course";
import styles from "./course-tile.module.css";

export const CourseTile: React.FC<{
  course: Course;
}> = ({ course }) => {
  return <div className={styles.tile}>{course.name}</div>;
};
