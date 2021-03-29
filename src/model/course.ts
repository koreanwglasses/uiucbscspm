export type Course = {
  /**
   * Unique identifier
   * e.g. CS467_3
   */
  id: string;
  /**
   * The formal name of the course - the full title
   * e.g. CS467 - Social Visualization
   */
  name: string;
  description?: string;
  creditHours: number;
  semestersOffered: ("spring" | "fall")[];
  concentrations?: string[];
  /**
   * An array of requirement “tags” used to determine if a set
   * of courses meets certain requirements
   */
  requirementsSatisfied: string[];
  /**
   * An array of ids of prerequisite courses to take this course
   */
  prereqs: string[];
  /**
   * A list of courses of which this class is a prerequisite
   */
  followupCourses: string[];
};

export type CourseSelection = {
  course: Course;
  semester: string;
  year: number;
  position?: number;
};
