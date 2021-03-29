import * as React from "react";
import {
  DraggableCore,
  DraggableData,
  DraggableEventHandler,
} from "react-draggable";
import { Course } from "../model/course";
import styles from "./course-tile.module.css";
import { isPalette } from "./palette";
import { isSchedule } from "./schedule";

export type TileEventHandler = (event: DropEvent) => boolean;

export type DropEvent = {
  course: Course;
  type: "drop";
  target: "palette" | "schedule";
  parentEvent: MouseEvent;
  data: DraggableData;
};

export const CourseTile: React.FC<{
  course: Course;
  onTileEvent: TileEventHandler;
  disabled?: boolean;
}> = ({ course, onTileEvent = () => false, disabled = false }) => {
  const containerRef = React.useRef<HTMLDivElement>();
  const startPosition = [0, 0] as [number, number];
  const [position, setPosition] = React.useState<[number, number]>(
    startPosition
  );

  const reset = () => {
    setPosition(startPosition);
  };

  const handleStart: DraggableEventHandler = (e) => {
    if (disabled) return;
    e.preventDefault();
  };

  const handleDrag: DraggableEventHandler = (e, { deltaX, deltaY }) => {
    if (disabled) return;
    e.preventDefault();
    setPosition([position[0] + deltaX, position[1] + deltaY]);
  };

  const handleStop: DraggableEventHandler = (event: MouseEvent, data) => {
    if (disabled) return;
    event.preventDefault();
    const elements = document.elementsFromPoint(event.clientX, event.clientY);

    let target: "palette" | "schedule";
    if (elements.find(isPalette)) {
      target = "palette";
    } else if (elements.find(isSchedule)) {
      target = "schedule";
    } else {
      reset();
      return;
    }

    if (
      !onTileEvent({ type: "drop", course, target, parentEvent: event, data })
    ) {
      reset();
    }
  };

  return (
    <DraggableCore
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <div
        className={styles.tile}
        ref={containerRef}
        style={{
          transform: `translate(${position[0]}px, ${position[1]}px)`,
          opacity: disabled ? 0.25 : 1,
          cursor: disabled ? "default" : "pointer",
        }}
      >
        {course.name}
      </div>
    </DraggableCore>
  );
};
