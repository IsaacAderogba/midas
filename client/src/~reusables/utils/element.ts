import rough from "roughjs/bin/wrappers/rough";
import { MidasElement, MidasTextElement, SceneState } from "./types";
import {
  getElementAbsoluteX1,
  getElementAbsoluteX2,
  getElementAbsoluteY1,
  getElementAbsoluteY2,
  getArrowPoints
} from "./coords";
import { withCustomMathRandom, randomSeed } from "./seed";
import { RoughCanvas } from "roughjs/bin/canvas";
import { KEYS } from "../constants/constants";
import { SHAPES } from "../../views/canvas/CanvasTopbar";

// Casting second argument (DrawingSurface) to any,
// because it is requred by TS definitions and not required at runtime
var generator = rough.generator(null, null as any);

export function setSelection(
  selection: MidasElement,
  elements: MidasElement[]
) {
  const selectionX1 = getElementAbsoluteX1(selection);
  const selectionX2 = getElementAbsoluteX2(selection);
  const selectionY1 = getElementAbsoluteY1(selection);
  const selectionY2 = getElementAbsoluteY2(selection);
  elements.forEach(element => {
    const elementX1 = getElementAbsoluteX1(element);
    const elementX2 = getElementAbsoluteX2(element);
    const elementY1 = getElementAbsoluteY1(element);
    const elementY2 = getElementAbsoluteY2(element);
    element.isSelected =
      element.type !== "selection" &&
      selectionX1 <= elementX1 &&
      selectionY1 <= elementY1 &&
      selectionX2 >= elementX2 &&
      selectionY2 >= elementY2;
  });
}

export function clearSelection(elements: MidasElement[]) {
  elements.forEach(element => {
    element.isSelected = false;
  });
}

export const someElementIsSelected = (elements: MidasElement[]) =>
  elements.some(element => element.isSelected);

export function getSelectedIndices(elements: MidasElement[]) {
  const selectedIndices: number[] = [];
  elements.forEach((element, index) => {
    if (element.isSelected) {
      selectedIndices.push(index);
    }
  });
  return selectedIndices;
}

export function findElementByKey(key: string) {
  const defaultElement = "selection";
  return SHAPES.reduce((element, shape) => {
    if (shape.value[0] !== key) return element;

    return shape.value;
  }, defaultElement);
}

export function deleteSelectedElements(
  elements: MidasElement[],
  forceCanvasUpdate: React.DispatchWithoutAction
) {
  for (let i = elements.length - 1; i >= 0; --i) {
    if (elements[i].isSelected) {
      elements.splice(i, 1);
    }
  }
  forceCanvasUpdate();
}

export function isTextElement(
  element: MidasElement
): element is MidasTextElement {
  return element.type === "text";
}

export function isInputLike(
  target: Element | EventTarget | null
): target is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

export function generateDraw(element: MidasElement) {
  if (element.type === "selection") {
    element.draw = (rc, context, { scrollX, scrollY }) => {
      const fillStyle = context.fillStyle;
      context.fillStyle = "rgba(0, 0, 255, 0.10)";
      context.fillRect(
        element.x + scrollX,
        element.y + scrollY,
        element.width,
        element.height
      );
      context.fillStyle = fillStyle;
    };
  } else if (element.type === "rectangle") {
    const shape = withCustomMathRandom(element.seed, () => {
      return generator.rectangle(0, 0, element.width, element.height, {
        stroke: element.strokeColor,
        fill: element.backgroundColor
      });
    });
    element.draw = (rc, context, { scrollX, scrollY }) => {
      context.translate(element.x + scrollX, element.y + scrollY);
      rc.draw(shape);
      context.translate(-element.x - scrollX, -element.y - scrollY);
    };
  } else if (element.type === "ellipse") {
    const shape = withCustomMathRandom(element.seed, () =>
      generator.ellipse(
        element.width / 2,
        element.height / 2,
        element.width,
        element.height,
        { stroke: element.strokeColor, fill: element.backgroundColor }
      )
    );
    element.draw = (rc, context, { scrollX, scrollY }) => {
      context.translate(element.x + scrollX, element.y + scrollY);
      rc.draw(shape);
      context.translate(-element.x - scrollX, -element.y - scrollY);
    };
  } else if (element.type === "arrow") {
    const [x1, y1, x2, y2, x3, y3, x4, y4] = getArrowPoints(element);
    const shapes = withCustomMathRandom(element.seed, () => [
      //    \
      generator.line(x3, y3, x2, y2, { stroke: element.strokeColor }),
      // -----
      generator.line(x1, y1, x2, y2, { stroke: element.strokeColor }),
      //    /
      generator.line(x4, y4, x2, y2, { stroke: element.strokeColor })
    ]);

    element.draw = (rc, context, { scrollX, scrollY }) => {
      context.translate(element.x + scrollX, element.y + scrollY);
      shapes.forEach(shape => rc.draw(shape));
      context.translate(-element.x - scrollX, -element.y - scrollY);
    };
    return;
  } else if (isTextElement(element)) {
    element.draw = (rc, context, { scrollX, scrollY }) => {
      const font = context.font;
      context.font = element.font;
      const fillStyle = context.fillStyle;
      context.fillStyle = element.strokeColor;
      context.fillText(
        element.text,
        element.x + scrollX,
        element.y + element.actualBoundingBoxAscent + scrollY
      );
      context.fillStyle = fillStyle;
      context.font = font;
    };
  } else {
    throw new Error("Unimplemented type " + element.type);
  }
}

export function newElement(
  type: string,
  x: number,
  y: number,
  strokeColor: string,
  backgroundColor: string,
  width = 0,
  height = 0
) {
  const element = {
    type: type,
    x: x,
    y: y,
    width: width,
    height: height,
    isSelected: false,
    strokeColor: strokeColor,
    backgroundColor: backgroundColor,
    seed: randomSeed(),
    draw(
      rc: RoughCanvas,
      context: CanvasRenderingContext2D,
      sceneState: SceneState
    ) {}
  };
  return element;
}

export function isArrowKey(keyCode: string) {
  return (
    keyCode === KEYS.ARROW_LEFT ||
    keyCode === KEYS.ARROW_RIGHT ||
    keyCode === KEYS.ARROW_DOWN ||
    keyCode === KEYS.ARROW_UP
  );
}
