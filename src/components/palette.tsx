import * as React from "react";
import { Course, CourseSelection } from "../model/course";
import { CourseTile, TileEventHandler } from "./course-tile";
import styles from "./palette.module.css";

export const isPalette = (element: HTMLElement) =>
  element.classList.contains(styles.palette);

export const Palette: React.FC<{
  courses: Course[];
  selectedCourses: CourseSelection[];
  onTileEvent: TileEventHandler;
}> = ({ courses, selectedCourses, onTileEvent }) => {
  // We only want to show the courses that have not yet been selected, so
  // we filter them out here
  //
  // This is slow O(n^2), that its okay for now
  const unselectedCourses = courses?.filter(
    (course) =>
      !selectedCourses.find(
        (selectedCourse) => course.id === selectedCourse.course.id
      )
  );

  const coreCourses = unselectedCourses?.filter((course) =>
    course.concentrations?.includes("core")
  );

  const softwareCourses = unselectedCourses?.filter((course) =>
    course.concentrations?.includes("Software Foundations")
  );

  const algoCourses = unselectedCourses?.filter((course) =>
    course.concentrations?.includes("Algorithms and Models of Computation")
  );

  const dataCourses = unselectedCourses?.filter((course) =>
    course.concentrations?.includes("Intelligence and Big Data")
  );

  const humanCourses = unselectedCourses?.filter((course) =>
    course.concentrations?.includes("Human and Social Impact")
  );

  const mediaCourses = unselectedCourses?.filter((course) =>
    course.concentrations?.includes("Media")
  );

  const scientificCourses = unselectedCourses?.filter((course) =>
    course.concentrations?.includes("Scientific, Parallel, and High Performance Computing")
  );

  const distributedCourses = unselectedCourses?.filter((course) =>
    course.concentrations?.includes("Distributed Systems, Networking, and Security")
  );

  const machineCourses = unselectedCourses?.filter((course) =>
    course.concentrations?.includes("Machines")
  );

  const teamCourses = unselectedCourses?.filter((course) =>
    course.concentrations?.includes("Team Project")
  );

  const otherCourses = unselectedCourses?.filter((course) =>
    course.concentrations?.length === 0
  );

  return (
    <div className={styles.palette}>
      <h2>Palette</h2>
      {/* We can use .map here to create a CourseTile component for each unselected course */}
      {/* {unselectedCourses?.map((course) => (
        // Be sure to pass in onTileEvent and key the way it is here when you
        // make CourseTiles
        <CourseTile course={course} onTileEvent={onTileEvent} key={course.id}/>
      ))} */}
      <div className={styles.scrollContainer} >

      <div className={styles.row}>
        <h3>CS Core Classes</h3>
        {coreCourses?.map((course) => (
          <CourseTile course={course} onTileEvent={onTileEvent} key={course.id} />
        ))}
      </div>
          
      <div className={styles.row}>
        <h3>Software Foundations</h3>
        {softwareCourses?.map((course) => (
          <CourseTile course={course} onTileEvent={onTileEvent} key={course.id} />
        ))}
      </div>
        
      <div className={styles.row}>
        <h3>Algorithms and Models of Computation</h3>
        {algoCourses?.map((course) => (
          <CourseTile course={course} onTileEvent={onTileEvent} key={course.id} />
        ))}
      </div>

      <div className={styles.row}>
        <h3>Intelligence and Big Data</h3>
        {dataCourses?.map((course) => (
          <CourseTile course={course} onTileEvent={onTileEvent} key={course.id} />
        ))}
      </div>

      <div className={styles.row}>
        <h3>Human and Social Impact</h3>
        {humanCourses?.map((course) => (
          <CourseTile course={course} onTileEvent={onTileEvent} key={course.id} />
        ))}
      </div>

      <div className={styles.row}>
        <h3>Media</h3>
        {mediaCourses?.map((course) => (
          <CourseTile course={course} onTileEvent={onTileEvent} key={course.id} />
        ))}
      </div>
    
        <div className={styles.row}>
          <h3>Scientific, Parallel, and High Performance Computing</h3>
          {scientificCourses?.map((course) => (
            <CourseTile course={course} onTileEvent={onTileEvent} key={course.id} />
          ))}
        </div>
        
      <div className={styles.row}>
        <h3>Distributed Systems, Networking, and Security</h3>
        {distributedCourses?.map((course) => (
          <CourseTile course={course} onTileEvent={onTileEvent} key={course.id} />
        ))}
      </div>

      <div className={styles.row}>
        <h3>Machines</h3>
        {machineCourses?.map((course) => (
          <CourseTile course={course} onTileEvent={onTileEvent} key={course.id} />
        ))}
      </div>

      <div className={styles.row}>
        <h3>Team Project</h3>
        {teamCourses?.map((course) => (
          <CourseTile course={course} onTileEvent={onTileEvent} key={course.id} />
        ))}
      </div>

      <div className={styles.row}>
        <h3>Other</h3>
        {otherCourses?.map((course) => (
          <CourseTile course={course} onTileEvent={onTileEvent} key={course.id} />
        ))}
      </div>

      </div>
    </div>
  );
};