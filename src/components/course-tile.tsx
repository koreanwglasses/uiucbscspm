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
  tentative?: boolean;
}> = ({
  course,
  onTileEvent = () => false,
  disabled = false,
  tentative = false,
}) => {
  const containerRef = React.useRef<HTMLDivElement>();
  const startPosition = [0, 0] as [number, number];
  const [position, setPosition] = React.useState<[number, number]>(
    startPosition
  );
  const [isDragging, setIsDragging] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);

  const [originalLeft, setOriginalLeft] = React.useState(0);
  const [originalTop, setOriginalTop] = React.useState(0);

  const reset = () => {
    setPosition(startPosition);
  };

  const handleStart: DraggableEventHandler = (e) => {
    if (disabled) return;
    e.preventDefault();
    setShowTooltip(false);
    setIsDragging(true);

    const rect = containerRef.current.getBoundingClientRect();
    setOriginalLeft(rect.left);
    setOriginalTop(rect.top);
  };

  const handleDrag: DraggableEventHandler = (e, { deltaX, deltaY }) => {
    if (disabled) return;
    e.preventDefault();
    setShowTooltip(false);
    setPosition([position[0] + deltaX, position[1] + deltaY]);
  };

  const handleStop: DraggableEventHandler = (event: MouseEvent, data) => {
    if (disabled) return;
    event.preventDefault();
    setIsDragging(false);

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

  const handleMouseEnter: React.MouseEventHandler = (event) => {
    if (!event.buttons) setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
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
          position: isDragging ? "fixed" : "relative",
          left: isDragging ? originalLeft : 0,
          top: isDragging ? originalTop : 0,
          transform: `translate(${position[0]}px, ${position[1]}px)`,
          opacity: disabled || tentative ? 0.25 : 1,
          cursor: disabled ? "default" : "pointer",
          zIndex: isDragging || showTooltip ? 1 : 0,
          // color:
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <p className={styles.creditHours}>{course.creditHours}</p>
        {course.name}
        {showTooltip && <Tooltip course={course} />}
      </div>
    </DraggableCore>
  );
};

const Tooltip: React.FC<{ course: Course }> = ({ course }) => (
  <div className={styles.tooltip}>
    <h3>{course.name}</h3>
    <p>{course.description}</p>
  </div>
);
