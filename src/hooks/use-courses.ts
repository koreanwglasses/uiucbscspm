import { useEffect, useState } from "react";
import { Course } from "../model/course";

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>();
  useEffect(() => {
    (async () => {
      const response = await fetch("/static/courses.json");
      setCourses(await response.json());
    })();
  }, []);
  return courses;
};
