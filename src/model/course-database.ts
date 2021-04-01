import { Course } from "./course";

export class CourseDatabase {
  private courses: Course[];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  async load() {
    const response = await fetch("./static/courses.json");
    this.courses = await response.json();
  }

  getAllCourses() {
    return this.courses;
  }

  getCourseById(id: string) {
    return this.courses.find((course) => course.id.slice(0, 5) === id);
  }

  getCourseByName(name: string) {
    return this.courses.find((course) => course.name === name);
  }

  private static instance_: CourseDatabase;
  static getInstance() {
    if (!this.instance_) this.instance_ = new CourseDatabase();
    return this.instance_;
  }
}
