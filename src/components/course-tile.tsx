import * as React from "react";
import {
  DraggableCore,
  DraggableData,
  DraggableEventHandler,
} from "react-draggable";
import { Course } from "../model/course";
import styles from "./course-tile.module.css";
import paletteStyles from "./palette.module.css";
import scheduleStyles from "./schedule.module.css";

export type TileEventHandler = (course: Course, event: DropEvent) => boolean;

export type DropEvent = {
  type: "drop";
  target: "palette" | "schedule";
  event: MouseEvent;
  data: DraggableData;
};

export const CourseTile: React.FC<{
  course: Course;
  onTileEvent: TileEventHandler;
}> = ({ course, onTileEvent = () => false }) => {
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

  const handleStop: DraggableEventHandler = (event: MouseEvent, data) => {
    const elements = document.elementsFromPoint(event.clientX, event.clientY);

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

    if (!onTileEvent(course, { type: "drop", target, event, data })) {
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
