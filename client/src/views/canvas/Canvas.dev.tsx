// modules
import React, { useEffect, useRef, useState, useReducer } from "react";
import ReactDOM from "react-dom";

/**
 * Imports for creating a canvas with a sketched feel to it
 */
import rough from "roughjs/bin/wrappers/rough";
import { RoughCanvas } from "roughjs/bin/canvas";

// components
import { CanvasTopbar } from "./CanvasTopbar";
import { AssetsSidebar } from "./AssetsSidebar";
import { CustomizeSidebar } from "./CustomizeSidebar";
import { Maybe } from "../../~reusables/utils/types";
import { useTheme } from "../../~reusables/contexts/ThemeProvider";
import { useAppStore } from "../../~reusables/contexts/AppProvider";
import { useAuthStore } from "../../~reusables/contexts/AuthProvider";

let canvas: HTMLCanvasElement;
let rc: RoughCanvas;
let context: CanvasRenderingContext2D;

export const CanvasWrapper: React.FC = () => {
  return (
    <section>
      {/* <CanvasTopbar />
      <AssetsSidebar /> */}
      <Canvas />
      {/* <CustomizeSidebar /> */}
    </section>
  );
};

type MidasElement = ReturnType<typeof newElement>;
type MidasTextElement = MidasElement & {
  type: "text";
  font: string;
  text: string;
  measure: TextMetrics;
};

/**
 *ly selected Elements
 */
let elements: MidasElement[] = [];

/**
 * Way of checking if an element is inside another element?
 */
function isInsideAnElement(x: number, y: number) {
  return (element: MidasElement) => {
    const x1 = getElementAbsoluteX1(element);
    const x2 = getElementAbsoluteX2(element);
    const y1 = getElementAbsoluteY1(element);
    const y2 = getElementAbsoluteY2(element);

    // returns a boolean which helps us decide
    return x >= x1 && x <= x2 && y >= y1 && y <= y2;
  };
}

/**
 * Function that creates a new element
 */
function newElement(type: string, x: number, y: number, width = 0, height = 0) {
  const element = {
    type,
    x,
    y,
    width,
    height,
    isSelected: false,
    draw(rc: RoughCanvas, context: CanvasRenderingContext2D) {},
  };
  return element;
}

/**
 * Just sum maths
 */
function rotate(x1: number, y1: number, x2: number, y2: number, angle: number) {
  // 𝑎′𝑥=(𝑎𝑥−𝑐𝑥)cos𝜃−(𝑎𝑦−𝑐𝑦)sin𝜃+𝑐𝑥
  // 𝑎′𝑦=(𝑎𝑥−𝑐𝑥)sin𝜃+(𝑎𝑦−𝑐𝑦)cos𝜃+𝑐𝑦.
  // https://math.stackexchange.com/questions/2204520/how-do-i-rotate-a-line-segment-in-a-specific-point-on-the-line
  return [
    (x1 - x2) * Math.cos(angle) - (y1 - y2) * Math.sin(angle) + x2,
    (x1 - x2) * Math.sin(angle) + (y1 - y2) * Math.cos(angle) + y2,
  ];
}

function isTextElement(element: MidasElement): element is MidasTextElement {
  return element.type === "text";
}

// Casting second argument (DrawingSurface) to any,
// because it is requred by TS definitions and not required at runtime
const generator = rough.generator(null, null as any);

/**
 * Drawing of the basic shapes
 */
function generateDraw(element: MidasElement) {
  if (element.type === "selection") {
    element.draw = (rc, context) => {
      const fillStyle = context.fillStyle;
      context.fillStyle = "rgba(0, 0, 255, 0.10)";
      context.fillRect(element.x, element.y, element.width, element.height);
      context.fillStyle = fillStyle;
    };
  } else if (element.type === "rectangle") {
    const shape = generator.rectangle(0, 0, element.width, element.height);
    element.draw = (rc, context) => {
      context.translate(element.x, element.y);
      rc.draw(shape);
      context.translate(-element.x, -element.y);
      console.log("draw");
    };
  } else if (element.type === "ellipse") {
    const shape = generator.ellipse(
      element.width / 2,
      element.height / 2,
      element.width,
      element.height
    );
    element.draw = (rc, context) => {
      context.translate(element.x, element.y);
      rc.draw(shape);
      context.translate(-element.x, -element.y);
    };
  } else if (element.type === "arrow") {
    const x1 = 0;
    const y1 = 0;
    const x2 = element.width;
    const y2 = element.height;

    const size = 30; // pixels
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    // Scale down the arrow until we hit a certain size so that it doesn't look weird
    const minSize = Math.min(size, distance / 2);
    const xs = x2 - ((x2 - x1) / distance) * minSize;
    const ys = y2 - ((y2 - y1) / distance) * minSize;

    const angle = 20; // degrees
    const [x3, y3] = rotate(xs, ys, x2, y2, (-angle * Math.PI) / 180);
    const [x4, y4] = rotate(xs, ys, x2, y2, (angle * Math.PI) / 180);

    const shapes = [
      //    \
      generator.line(x3, y3, x2, y2),
      // -----
      generator.line(x1, y1, x2, y2),
      //    /
      generator.line(x4, y4, x2, y2),
    ];

    element.draw = (rc, context) => {
      context.translate(element.x, element.y);
      shapes.forEach((shape) => rc.draw(shape));
      context.translate(-element.x, -element.y);
    };
    return;
  } else if (isTextElement(element)) {
    element.draw = (rc, context) => {
      const font = context.font;
      context.font = element.font;
      context.fillText(
        element.text,
        element.x,
        element.y + element.measure.actualBoundingBoxAscent
      );
      context.font = font;
    };
  } else {
    throw new Error("Unimplemented type " + element.type);
  }
}

// If the element is created from right to left, the width is going to be negative
// This set of functions retrieves the absolute position of the 4 points.
// We can't just always normalize it since we need to remember the fact that an arrow
// is pointing left or right.
function getElementAbsoluteX1(element: MidasElement) {
  return element.width >= 0 ? element.x : element.x + element.width;
}
function getElementAbsoluteX2(element: MidasElement) {
  return element.width >= 0 ? element.x + element.width : element.x;
}
function getElementAbsoluteY1(element: MidasElement) {
  return element.height >= 0 ? element.y : element.y + element.height;
}
function getElementAbsoluteY2(element: MidasElement) {
  return element.height >= 0 ? element.y + element.height : element.y;
}

function setSelection(selection: MidasElement) {
  const selectionX1 = getElementAbsoluteX1(selection);
  const selectionX2 = getElementAbsoluteX2(selection);
  const selectionY1 = getElementAbsoluteY1(selection);
  const selectionY2 = getElementAbsoluteY2(selection);
  elements.forEach((element) => {
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

function clearSelection() {
  elements.forEach((element) => {
    element.isSelected = false;
  });
}

type AppState = {
  draggingElement: MidasElement | null;
  elementType: string;
  exportBackground: boolean;
  exportVisibleOnly: boolean;
  exportPadding: number;
};

const Canvas: React.FC = () => {
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [state, setState] = useState<AppState>({
    draggingElement: null,
    elementType: "selection",
    exportBackground: false,
    exportVisibleOnly: true,
    exportPadding: 10,
  });

  const user = useAuthStore((state) => state.user);
  const canvasRef = useRef<Maybe<HTMLCanvasElement>>(null);

  useEffect(() => {
    return () => {
      document.removeEventListener("keydown", onKeyDown, false);
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      canvas = canvasRef.current;
      rc = rough.canvas(canvas);
      context = canvas.getContext("2d")!;
      context.translate(0.5, 0.5);
      drawScene();
    }
  }, [canvasRef]);

  /**
   * PNG export helper
   */
  function exportAsPNG({
    exportBackground,
    exportVisibleOnly,
    exportPadding = 10,
  }: {
    exportBackground: boolean;
    exportVisibleOnly: boolean;
    exportPadding?: number;
  }) {
    if (!elements.length) return window.alert("Cannot export empty canvas.");

    // deselect & rerender
    clearSelection();
    drawScene();

    // calculate visible-area coords
    let subCanvasX1 = Infinity;
    let subCanvasX2 = 0;
    let subCanvasY1 = Infinity;
    let subCanvasY2 = 0;

    elements.forEach((element) => {
      subCanvasX1 = Math.min(subCanvasX1, getElementAbsoluteX1(element));
      subCanvasX2 = Math.max(subCanvasX2, getElementAbsoluteX2(element));
      subCanvasY1 = Math.min(subCanvasY1, getElementAbsoluteY1(element));
      subCanvasY2 = Math.max(subCanvasY2, getElementAbsoluteY2(element));
    });

    // create a temporary canvas from which we'll export
    const tempCanvas = document.createElement("canvas");
    const tempCanvasCtx = tempCanvas.getContext("2d");
    tempCanvas.style.display = "none";
    document.body.appendChild(tempCanvas);

    if (canvas) {
      tempCanvas.width = exportVisibleOnly
        ? subCanvasX2 - subCanvasX1 + exportPadding * 2
        : canvas.width;
      tempCanvas.height = exportVisibleOnly
        ? subCanvasY2 - subCanvasY1 + exportPadding * 2
        : canvas.height;

      if (exportBackground && tempCanvasCtx) {
        tempCanvasCtx.fillStyle = "#FFF";
        tempCanvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // copy our original canvas onto the temp canvas
      tempCanvasCtx &&
        tempCanvasCtx.drawImage(
          canvas, // source
          exportVisibleOnly // sx
            ? subCanvasX1 - exportPadding
            : 0,
          exportVisibleOnly // sy
            ? subCanvasY1 - exportPadding
            : 0,
          exportVisibleOnly // sWidth
            ? subCanvasX2 - subCanvasX1 + exportPadding * 2
            : canvas.width,
          exportVisibleOnly // sHeight
            ? subCanvasY2 - subCanvasY1 + exportPadding * 2
            : canvas.height,
          0, // dx
          0, // dy
          exportVisibleOnly ? tempCanvas.width : canvas.width, // dWidth
          exportVisibleOnly ? tempCanvas.height : canvas.height // dHeight
        );

      // create a temporary <a> elem which we'll use to download the image
      const link = document.createElement("a");
      link.setAttribute("download", "midas.png");
      link.setAttribute("href", tempCanvas.toDataURL("image/png"));
      link.click();

      // clean up the DOM
      link.remove();
      if (tempCanvas !== canvas) tempCanvas.remove();
    }
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (
      event.key === "Backspace" &&
      (event.target as HTMLElement)?.nodeName !== "INPUT"
    ) {
      for (var i = elements.length - 1; i >= 0; --i) {
        if (elements[i].isSelected) {
          elements.splice(i, 1);
        }
      }
      drawScene();
      event.preventDefault();
    } else if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowDown"
    ) {
      const step = event.shiftKey ? 5 : 1;
      elements.forEach((element) => {
        if (element.isSelected) {
          if (event.key === "ArrowLeft") element.x -= step;
          else if (event.key === "ArrowRight") element.x += step;
          else if (event.key === "ArrowUp") element.y -= step;
          else if (event.key === "ArrowDown") element.y += step;
        }
      });
      drawScene();
      event.preventDefault();
    }
  };

  function drawScene() {
    forceUpdate();

    if (context && canvas) {
      context.clearRect(-0.5, -0.5, canvas.width, canvas.height);

      elements.forEach((element) => {
        if (context && rc) {
          element.draw(rc, context);
          if (element.isSelected) {
            const margin = 4;

            const elementX1 = getElementAbsoluteX1(element);
            const elementX2 = getElementAbsoluteX2(element);
            const elementY1 = getElementAbsoluteY1(element);
            const elementY2 = getElementAbsoluteY2(element);
            const lineDash = context.getLineDash();
            context.setLineDash([8, 4]);
            context.strokeRect(
              elementX1 - margin,
              elementY1 - margin,
              elementX2 - elementX1 + margin * 2,
              elementY2 - elementY1 + margin * 2
            );
            context.setLineDash(lineDash);
          }
        }
      });
    }
  }

  function renderOption({
    type,
    children,
  }: {
    type: string;
    children: React.ReactNode;
  }) {
    return (
      <label>
        <input
          type="radio"
          checked={state.elementType === type}
          onChange={() => {
            setState({ ...state, elementType: type });
            clearSelection();
            drawScene();
          }}
        />
        {children}
      </label>
    );
  }

  return (
    <>
      <div className="exportWrapper">
        <button
          onClick={() => {
            exportAsPNG({
              exportBackground: state.exportBackground,
              exportVisibleOnly: state.exportVisibleOnly,
              exportPadding: state.exportPadding,
            });
          }}
        >
          Export to png
        </button>
        <label>
          <input
            type="checkbox"
            checked={state.exportBackground}
            onChange={(e) => {
              setState({ ...state, exportBackground: e.target.checked });
            }}
          />{" "}
          background
        </label>
        <label>
          <input
            type="checkbox"
            checked={state.exportVisibleOnly}
            onChange={(e) => {
              setState({ ...state, exportVisibleOnly: e.target.checked });
            }}
          />
          visible area only
        </label>
        (padding:
        <input
          type="number"
          value={state.exportPadding}
          onChange={(e) => {
            setState({ ...state, exportPadding: Number(e.target.value) });
          }}
          disabled={!state.exportVisibleOnly}
        />
        px)
      </div>
      <div>
        {renderOption({ type: "rectangle", children: "Rectangle" })}
        {renderOption({ type: "ellipse", children: "Ellipse" })}
        {renderOption({ type: "arrow", children: "Arrow" })}
        {renderOption({ type: "text", children: "Text" })}
        {renderOption({ type: "selection", children: "Selection" })}
        {user?.firstName}
        <canvas
          ref={canvasRef}
          id="canvas"
          style={{ border: "1px solid red" }}
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={(e) => {
            const x = e.clientX - (e.target as HTMLElement).offsetLeft;
            const y = e.clientY - (e.target as HTMLElement).offsetTop;
            const element = newElement(state.elementType, x, y);
            let isDraggingElements = false;
            const cursorStyle = document.documentElement.style.cursor;
            if (state.elementType === "selection") {
              const selectedElement = elements.find((element) => {
                const isSelected = isInsideAnElement(x, y)(element);
                if (isSelected) {
                  element.isSelected = true;
                }
                return isSelected;
              });

              if (selectedElement) {
                setState({ ...state, draggingElement: selectedElement });
              } else {
                clearSelection();
              }

              isDraggingElements = elements.some(
                (element) => element.isSelected
              );

              if (isDraggingElements) {
                document.documentElement.style.cursor = "move";
              }
            }

            if (isTextElement(element) && context) {
              const text = prompt("What text do you want?");
              if (text === null) {
                return;
              }
              element.text = text;
              element.font = "20px Virgil";
              const font = context.font;
              context.font = element.font;
              element.measure = context.measureText(element.text);
              context.font = font;
              const height =
                element.measure.actualBoundingBoxAscent +
                element.measure.actualBoundingBoxDescent;
              // Center the text
              element.x -= element.measure.width / 2;
              element.y -= element.measure.actualBoundingBoxAscent;
              element.width = element.measure.width;
              element.height = height;
            }

            generateDraw(element);
            elements.push(element);
            if (state.elementType === "text") {
              setState({
                ...state,
                draggingElement: null,
                elementType: "selection",
              });
              element.isSelected = true;
            } else {
              setState({ ...state, draggingElement: element });
            }

            let lastX = x;
            let lastY = y;

            const onMouseMove = (e: MouseEvent) => {
              const target = e.target;
              if (!(target instanceof HTMLElement)) {
                return;
              }

              if (isDraggingElements) {
                const selectedElements = elements.filter((el) => el.isSelected);
                if (selectedElements.length) {
                  const x = e.clientX - target.offsetLeft;
                  const y = e.clientY - target.offsetTop;
                  selectedElements.forEach((element) => {
                    element.x += x - lastX;
                    element.y += y - lastY;
                  });
                  lastX = x;
                  lastY = y;
                  drawScene();
                  return;
                }
              }

              // It is very important to read state within each move event,
              // otherwise we would read a stale one!
              const draggingElement = state.draggingElement;
              if (!draggingElement) return;
              let width = e.clientX - target.offsetLeft - draggingElement.x;
              let height = e.clientY - target.offsetTop - draggingElement.y;
              draggingElement.width = width;
              // Make a perfect square or circle when shift is enabled
              draggingElement.height = e.shiftKey ? width : height;

              generateDraw(draggingElement);

              if (state.elementType === "selection") {
                setSelection(draggingElement);
              }
              drawScene();
            };

            const onMouseUp = (e: MouseEvent) => {
              const { draggingElement, elementType } = state;

              window.removeEventListener("mousemove", onMouseMove);
              window.removeEventListener("mouseup", onMouseUp);

              document.documentElement.style.cursor = cursorStyle;

              // if no element is clicked, clear the selection and redraw
              if (draggingElement === null) {
                clearSelection();
                drawScene();
                return;
              }

              if (elementType === "selection") {
                if (isDraggingElements) {
                  isDraggingElements = false;
                }
                elements.pop();
              } else {
                draggingElement.isSelected = true;
              }

              setState({
                ...state,
                draggingElement: null,
                elementType: "selection",
              });
              drawScene();
            };

            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);

            drawScene();
          }}
        />
      </div>
    </>
  );
};
