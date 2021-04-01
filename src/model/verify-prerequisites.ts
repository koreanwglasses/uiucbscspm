import { CourseSelection } from "./course";

export const verifyPrerequisites = (
  selectedCourses: CourseSelection[],
  target: CourseSelection
) => {
  const previouslyTaken = selectedCourses.filter(
    (selection) =>
      selection.year < target.year ||
      (selection.year === target.year &&
        selection.semester === "fall" &&
        target.semester === "spring")
  );
  return target.course.prereqs
    .map(
      (prereq) =>
        !!previouslyTaken.find(
          (selection) => selection.course.id.slice(0, 5) === prereq
        )
    )
    .reduce((a, b) => a && b, true);
};
