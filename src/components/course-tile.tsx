import * as React from "react";
import { DraggableCore, DraggableEventHandler } from "react-draggable";
import { Course } from "../model/course";
import styles from "./course-tile.module.css";

export const CourseTile: React.FC<{
  course: Course;
}> = ({ course }) => {
  const containerRef = React.useRef<HTMLDivElement>();
  const startPosition = [0, 0] as [number, number];
  const [position, setPosition] = React.useState<[number, number]>(
    startPosition
  );

  const reset = () => {
    setPosition(startPosition);
  };

  const onDrag: DraggableEventHandler = (e, { deltaX, deltaY }) => {
    setPosition([position[0] + deltaX, position[1] + deltaY]);
  };

  const dragStop: DraggableEventHandler = (e) => {
    reset();
  };

  return (
    <DraggableCore onDrag={onDrag} onStop={dragStop}>
      <div
        className={styles.tile}
        ref={containerRef}
        style={{ transform: `translate(${position[0]}px, ${position[1]}px)` }}
      >
        {course.name}
      </div>
    </DraggableCore>
  );
};
