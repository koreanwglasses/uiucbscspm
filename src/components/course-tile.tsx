import * as React from "react";
import {
  DraggableCore,
  DraggableData,
  DraggableEvent,
  DraggableEventHandler,
} from "react-draggable";
import { Course } from "../model/course";
import styles from "./course-tile.module.css";
import paletteStyles from "./palette.module.css";
import scheduleStyles from "./schedule.module.css";

export type DropTileEventHandler = (
  course: Course,
  target: "palette" | "schedule",
  event: DraggableEvent,
  data: DraggableData
) => boolean;

export const CourseTile: React.FC<{
  course: Course;
  onDropTile: DropTileEventHandler;
}> = ({ course, onDropTile = () => false }) => {
  const containerRef = React.useRef<HTMLDivElement>();
  const startPosition = [0, 0] as [number, number];
  const [position, setPosition] = React.useState<[number, number]>(
    startPosition
  );

  const reset = () => {
    setPosition(startPosition);
  };

  const handleDrag: DraggableEventHandler = (e, { deltaX, deltaY }) => {
    setPosition([position[0] + deltaX, position[1] + deltaY]);
  };

  const handleStop: DraggableEventHandler = (e: MouseEvent, data) => {
    const elements = document.elementsFromPoint(e.clientX, e.clientY);

    let target: "palette" | "schedule";
    if (
      elements.find((elem) => elem.classList.contains(paletteStyles.palette))
    ) {
      target = "palette";
    } else if (
      elements.find((elem) => elem.classList.contains(scheduleStyles.schedule))
    ) {
      target = "schedule";
    } else {
      reset();
      return;
    }

    if (!onDropTile(course, target, e, data)) {
      reset();
    }
  };

  return (
    <DraggableCore onDrag={handleDrag} onStop={handleStop}>
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
