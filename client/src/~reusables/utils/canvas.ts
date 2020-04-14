import { MidasElement, SceneState } from "./types";
import {
  getElementAbsoluteX1,
  getElementAbsoluteX2,
  getElementAbsoluteY1,
  getElementAbsoluteY2,
  distanceBetweenPointAndSegment,
  getArrowPoints
} from "./coords";
import {
  SCROLLBAR_MARGIN,
  SCROLLBAR_WIDTH,
  SCROLLBAR_COLOR
} from "../constants/dimensions";
import { RoughCanvas } from "roughjs/bin/canvas";
import { getSelectedIndices } from "./element";
import { ICollaborator } from "../contexts/ProjectProvider";

export function hitTest(element: MidasElement, x: number, y: number): boolean {
  // For shapes that are composed of lines, we only enable point-selection when the distance
  // of the click is less than x pixels of any of the lines that the shape is composed of
  const lineThreshold = 10;

  if (element.type === "ellipse") {
    // https://stackoverflow.com/a/46007540/232122
    const px = Math.abs(x - element.x - element.width / 2);
    const py = Math.abs(y - element.y - element.height / 2);

    let tx = 0.707;
    let ty = 0.707;

    const a = element.width / 2;
    const b = element.height / 2;

    [0, 1, 2, 3].forEach(x => {
      const xx = a * tx;
      const yy = b * ty;

      const ex = ((a * a - b * b) * tx ** 3) / a;
      const ey = ((b * b - a * a) * ty ** 3) / b;

      const rx = xx - ex;
      const ry = yy - ey;

      const qx = px - ex;
      const qy = py - ey;

      const r = Math.hypot(ry, rx);
      const q = Math.hypot(qy, qx);

      tx = Math.min(1, Math.max(0, ((qx * r) / q + ex) / a));
      ty = Math.min(1, Math.max(0, ((qy * r) / q + ey) / b));
      const t = Math.hypot(ty, tx);
      tx /= t;
      ty /= t;
    });

    return Math.hypot(a * tx - px, b * ty - py) < lineThreshold;
  } else if (element.type === "rectangle") {
    const x1 = getElementAbsoluteX1(element);
    const x2 = getElementAbsoluteX2(element);
    const y1 = getElementAbsoluteY1(element);
    const y2 = getElementAbsoluteY2(element);

    // (x1, y1) --A-- (x2, y1)
    //    |D             |B
    // (x1, y2) --C-- (x2, y2)
    return (
      distanceBetweenPointAndSegment(x, y, x1, y1, x2, y1) < lineThreshold || // A
      distanceBetweenPointAndSegment(x, y, x2, y1, x2, y2) < lineThreshold || // B
      distanceBetweenPointAndSegment(x, y, x2, y2, x1, y2) < lineThreshold || // C
      distanceBetweenPointAndSegment(x, y, x1, y2, x1, y1) < lineThreshold // D
    );
  } else if (element.type === "arrow") {
    let [x1, y1, x2, y2, x3, y3, x4, y4] = getArrowPoints(element);
    // The computation is done at the origin, we need to add a translation
    x -= element.x;
    y -= element.y;

    return (
      //    \
      distanceBetweenPointAndSegment(x, y, x3, y3, x2, y2) < lineThreshold ||
      // -----
      distanceBetweenPointAndSegment(x, y, x1, y1, x2, y2) < lineThreshold ||
      //    /
      distanceBetweenPointAndSegment(x, y, x4, y4, x2, y2) < lineThreshold
    );
  } else if (element.type === "text") {
    const x1 = getElementAbsoluteX1(element);
    const x2 = getElementAbsoluteX2(element);
    const y1 = getElementAbsoluteY1(element);
    const y2 = getElementAbsoluteY2(element);

    return x >= x1 && x <= x2 && y >= y1 && y <= y2;
  } else if (element.type === "selection") {
    console.warn("This should not happen, we need to investigate why it does.");
    return false;
  } else {
    throw new Error("Unimplemented type " + element.type);
  }
}

export function resizeTest(
  element: MidasElement,
  x: number,
  y: number,
  sceneState: SceneState
): string | false {
  if (element.type === "text" || element.type === "arrow") return false;

  const handlers = handlerRectangles(element, sceneState);

  const filter = Object.keys(handlers).filter(key => {
    const handler = handlers[key];

    return (
      x + sceneState.scrollX >= handler[0] &&
      x + sceneState.scrollX <= handler[0] + handler[2] &&
      y + sceneState.scrollY >= handler[1] &&
      y + sceneState.scrollY <= handler[1] + handler[3]
    );
  });

  if (filter.length > 0) {
    return filter[0];
  }

  return false;
}

export function getScrollbars(
  canvasWidth: number,
  canvasHeight: number,
  scrollX: number,
  scrollY: number
) {
  // horizontal scrollbar
  const sceneWidth = canvasWidth + Math.abs(scrollX);
  const scrollBarWidth = (canvasWidth * canvasWidth) / sceneWidth;
  const scrollBarX = scrollX > 0 ? 0 : canvasWidth - scrollBarWidth;
  const horizontalScrollBar = {
    x: scrollBarX + SCROLLBAR_MARGIN,
    y: canvasHeight - SCROLLBAR_WIDTH - SCROLLBAR_MARGIN,
    width: scrollBarWidth - SCROLLBAR_MARGIN * 2,
    height: SCROLLBAR_WIDTH
  };

  // vertical scrollbar
  const sceneHeight = canvasHeight + Math.abs(scrollY);
  const scrollBarHeight = (canvasHeight * canvasHeight) / sceneHeight;
  const scrollBarY = scrollY > 0 ? 0 : canvasHeight - scrollBarHeight;
  const verticalScrollBar = {
    x: canvasWidth - SCROLLBAR_WIDTH - SCROLLBAR_MARGIN,
    y: scrollBarY + SCROLLBAR_MARGIN,
    width: SCROLLBAR_WIDTH,
    height: scrollBarHeight - SCROLLBAR_WIDTH * 2
  };

  return {
    horizontal: horizontalScrollBar,
    vertical: verticalScrollBar
  };
}

export function handlerRectangles(
  element: MidasElement,
  sceneState: SceneState
) {
  const elementX1 = element.x;
  const elementX2 = element.x + element.width;
  const elementY1 = element.y;
  const elementY2 = element.y + element.height;

  const margin = 4;
  const minimumSize = 40;
  const handlers: { [handler: string]: number[] } = {};

  const marginX = element.width < 0 ? 8 : -8;
  const marginY = element.height < 0 ? 8 : -8;

  if (Math.abs(elementX2 - elementX1) > minimumSize) {
    handlers["n"] = [
      elementX1 + (elementX2 - elementX1) / 2 + sceneState.scrollX - 4,
      elementY1 - margin + sceneState.scrollY + marginY,
      8,
      8
    ];

    handlers["s"] = [
      elementX1 + (elementX2 - elementX1) / 2 + sceneState.scrollX - 4,
      elementY2 - margin + sceneState.scrollY - marginY,
      8,
      8
    ];
  }

  if (Math.abs(elementY2 - elementY1) > minimumSize) {
    handlers["w"] = [
      elementX1 - margin + sceneState.scrollX + marginX,
      elementY1 + (elementY2 - elementY1) / 2 + sceneState.scrollY - 4,
      8,
      8
    ];

    handlers["e"] = [
      elementX2 - margin + sceneState.scrollX - marginX,
      elementY1 + (elementY2 - elementY1) / 2 + sceneState.scrollY - 4,
      8,
      8
    ];
  }

  handlers["nw"] = [
    elementX1 - margin + sceneState.scrollX + marginX,
    elementY1 - margin + sceneState.scrollY + marginY,
    8,
    8
  ]; // nw
  handlers["ne"] = [
    elementX2 - margin + sceneState.scrollX - marginX,
    elementY1 - margin + sceneState.scrollY + marginY,
    8,
    8
  ]; // ne
  handlers["sw"] = [
    elementX1 - margin + sceneState.scrollX + marginX,
    elementY2 - margin + sceneState.scrollY - marginY,
    8,
    8
  ]; // sw
  handlers["se"] = [
    elementX2 - margin + sceneState.scrollX - marginX,
    elementY2 - margin + sceneState.scrollY - marginY,
    8,
    8
  ]; // se

  return handlers;
}

export function renderScene(
  rc: RoughCanvas,
  canvas: HTMLCanvasElement,
  sceneState: SceneState,
  elements: MidasElement[],
  collaborators: ICollaborator[],
  // extra options, currently passed by export helper
  {
    offsetX,
    offsetY,
    renderScrollbars = true,
    renderSelection = true
  }: {
    offsetX?: number;
    offsetY?: number;
    renderScrollbars?: boolean;
    renderSelection?: boolean;
  } = {}
) {
  if (!canvas) return;
  const context = canvas.getContext("2d")!;

  const fillStyle = context.fillStyle;
  if (typeof sceneState.viewBackgroundColor === "string") {
    context.fillStyle = sceneState.viewBackgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  context.fillStyle = fillStyle;

  const selectedIndices = getSelectedIndices(elements);

  sceneState = {
    ...sceneState,
    scrollX: typeof offsetX === "number" ? offsetX : sceneState.scrollX,
    scrollY: typeof offsetY === "number" ? offsetY : sceneState.scrollY
  };

  collaborators.forEach(({ pointerCoordX, pointerCoordY, color }) => {
    if (pointerCoordX === null || pointerCoordY === null) {
      // sometimes the pointer goes off screen
    } else {
      const x = pointerCoordX as number;
      const y = pointerCoordY as number;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + 1, y + 14);
      context.lineTo(x + 4, y + 9);
      context.lineTo(x + 9, y + 10);
      context.lineTo(x, y);
      context.fillStyle = color!;
      context.fill();
      context.stroke();
    }
  });

  elements.forEach(element => {
    element.draw(rc, context, sceneState);
    if (renderSelection && element.isSelected) {
      const margin = 4;

      const elementX1 = getElementAbsoluteX1(element);
      const elementX2 = getElementAbsoluteX2(element);
      const elementY1 = getElementAbsoluteY1(element);
      const elementY2 = getElementAbsoluteY2(element);
      const lineDash = context.getLineDash();
      context.setLineDash([8, 4]);
      context.strokeRect(
        elementX1 - margin + sceneState.scrollX,
        elementY1 - margin + sceneState.scrollY,
        elementX2 - elementX1 + margin * 2,
        elementY2 - elementY1 + margin * 2
      );
      context.setLineDash(lineDash);

      if (
        element.type !== "text" &&
        element.type !== "arrow" &&
        selectedIndices.length === 1
      ) {
        const handlers = handlerRectangles(element, sceneState);
        Object.values(handlers).forEach(handler => {
          context.strokeRect(handler[0], handler[1], handler[2], handler[3]);
        });
      }
    }
  });

  if (renderScrollbars) {
    const scrollBars = getScrollbars(
      context.canvas.width / window.devicePixelRatio,
      context.canvas.height / window.devicePixelRatio,
      sceneState.scrollX,
      sceneState.scrollY
    );

    context.fillStyle = SCROLLBAR_COLOR;
    context.fillRect(
      scrollBars.horizontal.x,
      scrollBars.horizontal.y,
      scrollBars.horizontal.width,
      scrollBars.horizontal.height
    );
    context.fillRect(
      scrollBars.vertical.x,
      scrollBars.vertical.y,
      scrollBars.vertical.width,
      scrollBars.vertical.height
    );
    context.fillStyle = fillStyle;
  }
}

export function resetCursor() {
  document.documentElement.style.cursor = "";
}
