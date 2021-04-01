import * as React from "react";

export const Connector: React.FC<{
  start: HTMLElement;
  end: HTMLElement;
  opacity?: number;
}> = ({ start, end, opacity = 1 }) => {
  const startRect = start.getBoundingClientRect();
  const startPosition = {
    x: scrollX + startRect.left + startRect.width / 2,
    y: scrollY + startRect.bottom - 12,
  };

  const endRect = end.getBoundingClientRect();
  const endPosition = {
    x: scrollX + endRect.left + endRect.width / 2,
    y: scrollY + endRect.top + 7,
  };

  const bounds = {
    left: Math.min(startPosition.x, endPosition.x),
    top: Math.min(startPosition.y, endPosition.y),
    width: Math.abs(endPosition.x - startPosition.x),
    height: Math.abs(endPosition.y - startPosition.y),
  };

  const padding = 10;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        left: bounds.left - padding,
        top: bounds.top - padding,
        pointerEvents: "none",
      }}
      width={bounds.width + 2 * padding}
      height={bounds.height + 2 * padding}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>
      </defs>
      <line
        x1={padding + (startPosition.x < endPosition.x ? 0 : bounds.width)}
        y1={padding + (startPosition.y < endPosition.y ? 0 : bounds.height)}
        x2={padding + (startPosition.x < endPosition.x ? bounds.width : 0)}
        y2={padding + (startPosition.y < endPosition.y ? bounds.height : 0)}
        stroke={"#000"}
        opacity={opacity}
        strokeWidth="1"
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );
};
