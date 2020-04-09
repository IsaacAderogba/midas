// modules
import React from "react";
import rough from "roughjs/bin/wrappers/rough";
import { RoughCanvas } from "roughjs/bin/canvas";

// components
import { CanvasTopbar } from "./CanvasTopbar";
import { AssetsSidebar } from "./AssetsSidebar";
import { CustomizeSidebar } from "./CustomizeSidebar";

// helpers
import { MidasElement } from "../../~reusables/utils/types";
import {
  moveOneLeft,
  moveAllLeft,
  moveOneRight,
  moveAllRight,
} from "../../~reusables/utils/zindex";
import "./styles.scss";
import {
  generateHistoryCurrentEntry,
  restoreHistoryEntry,
  pushHistoryEntry,
} from "../../~reusables/utils/history";
import { randomSeed } from "../../~reusables/utils/seed";
import {
  saveAsJSON,
  loadFromJSON,
  exportAsPNG,
  restoreFromLocalStorage,
  save,
} from "../../~reusables/utils/saveAndRetrieval";
import {
  hitTest,
  resizeTest,
  resetCursor,
  renderScene,
} from "../../~reusables/utils/canvas";
import {
  KEYS,
  ELEMENT_SHIFT_TRANSLATE_AMOUNT,
  ELEMENT_TRANSLATE_AMOUNT,
  CANVAS_WINDOW_OFFSET_LEFT,
  CANVAS_WINDOW_OFFSET_TOP,
} from "../../~reusables/constants/constants";
import {
  getSelectedIndices,
  clearSelection,
  deleteSelectedElements,
  findElementByKey,
  someElementIsSelected,
  setSelection,
  isInputLike,
  generateDraw,
  isTextElement,
  newElement,
} from "../../~reusables/utils/element";

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

var elements = Array.of<MidasElement>();

let skipHistory = false;
const stateHistory: string[] = [];

// We inline font-awesome icons in order to save on js size rather than including the font awesome react library
export const SHAPES = [
  {
    icon: (
      // fa-mouse-pointer
      <svg viewBox="0 0 320 512">
        <path d="M302.189 329.126H196.105l55.831 135.993c3.889 9.428-.555 19.999-9.444 23.999l-49.165 21.427c-9.165 4-19.443-.571-23.332-9.714l-53.053-129.136-86.664 89.138C18.729 472.71 0 463.554 0 447.977V18.299C0 1.899 19.921-6.096 30.277 5.443l284.412 292.542c11.472 11.179 3.007 31.141-12.5 31.141z" />
      </svg>
    ),
    value: "selection",
  },
  {
    icon: (
      // fa-square
      <svg viewBox="0 0 448 512">
        <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z" />
      </svg>
    ),
    value: "rectangle",
  },
  {
    icon: (
      // fa-circle
      <svg viewBox="0 0 512 512">
        <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z" />
      </svg>
    ),
    value: "ellipse",
  },
  {
    icon: (
      // fa-long-arrow-alt-right
      <svg viewBox="0 0 448 512">
        <path d="M313.941 216H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h301.941v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.569 0-33.941l-86.059-86.059c-15.119-15.119-40.971-4.411-40.971 16.971V216z" />
      </svg>
    ),
    value: "arrow",
  },
  {
    icon: (
      // fa-font
      <svg viewBox="0 0 448 512">
        <path d="M432 416h-23.41L277.88 53.69A32 32 0 0 0 247.58 32h-47.16a32 32 0 0 0-30.3 21.69L39.41 416H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-19.58l23.3-64h152.56l23.3 64H304a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM176.85 272L224 142.51 271.15 272z" />
      </svg>
    ),
    value: "text",
  },
];

const shapesShortcutKeys = SHAPES.map((shape) => shape.value[0]);

export type ICanvasState = {
  draggingElement: MidasElement | null;
  resizingElement: MidasElement | null;
  elementType: string;
  exportBackground: boolean;
  currentItemStrokeColor: string;
  currentItemBackgroundColor: string;
  viewBackgroundColor: string;
  scrollX: number;
  scrollY: number;
};

function isArrowKey(keyCode: string) {
  return (
    keyCode === KEYS.ARROW_LEFT ||
    keyCode === KEYS.ARROW_RIGHT ||
    keyCode === KEYS.ARROW_DOWN ||
    keyCode === KEYS.ARROW_UP
  );
}

let lastCanvasWidth = -1;
let lastCanvasHeight = -1;
let lastMouseUp: ((e: any) => void) | null = null;

class Canvas extends React.Component<{}, ICanvasState> {
  public componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown, false);
    window.addEventListener("resize", this.onResize, false);

    canvas = document.getElementById("canvas") as HTMLCanvasElement;
    rc = rough.canvas(canvas);
    context = canvas.getContext("2d")!;
    context.translate(0.5, 0.5);
    this.forceUpdate();
    // TODO - at front or behind
    const savedState = restoreFromLocalStorage(elements);
    if (savedState) {
      this.setState(savedState);
    }
  }

  public componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown, false);
    window.removeEventListener("resize", this.onResize, false);
  }

  public state: ICanvasState = {
    draggingElement: null,
    resizingElement: null,
    elementType: "selection",
    exportBackground: true,
    currentItemStrokeColor: "#000000",
    currentItemBackgroundColor: "#ffffff",
    viewBackgroundColor: "#ffffff",
    scrollX: 0,
    scrollY: 0,
  };

  private onResize = () => {
    this.forceUpdate();
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if (isInputLike(event.target)) return;

    if (event.key === KEYS.ESCAPE) {
      clearSelection(elements);
      this.forceUpdate();
      event.preventDefault();
    } else if (event.key === KEYS.BACKSPACE || event.key === KEYS.DELETE) {
      deleteSelectedElements(elements);
      this.forceUpdate();
      event.preventDefault();
    } else if (isArrowKey(event.key)) {
      const step = event.shiftKey
        ? ELEMENT_SHIFT_TRANSLATE_AMOUNT
        : ELEMENT_TRANSLATE_AMOUNT;
      elements.forEach((element) => {
        if (element.isSelected) {
          if (event.key === KEYS.ARROW_LEFT) element.x -= step;
          else if (event.key === KEYS.ARROW_RIGHT) element.x += step;
          else if (event.key === KEYS.ARROW_UP) element.y -= step;
          else if (event.key === KEYS.ARROW_DOWN) element.y += step;
        }
      });
      this.forceUpdate();
      event.preventDefault();

      // Send backward: Cmd-Shift-Alt-B
    } else if (
      event.metaKey &&
      event.shiftKey &&
      event.altKey &&
      event.code === "KeyB"
    ) {
      this.moveOneLeft();
      event.preventDefault();

      // Send to back: Cmd-Shift-B
    } else if (event.metaKey && event.shiftKey && event.code === "KeyB") {
      this.moveAllLeft();
      event.preventDefault();

      // Bring forward: Cmd-Shift-Alt-F
    } else if (
      event.metaKey &&
      event.shiftKey &&
      event.altKey &&
      event.code === "KeyF"
    ) {
      this.moveOneRight();
      event.preventDefault();

      // Bring to front: Cmd-Shift-F
    } else if (event.metaKey && event.shiftKey && event.code === "KeyF") {
      this.moveAllRight();
      event.preventDefault();

      // Select all: Cmd-A
    } else if (event.metaKey && event.code === "KeyA") {
      elements.forEach((element) => {
        element.isSelected = true;
      });
      this.forceUpdate();
      event.preventDefault();
    } else if (shapesShortcutKeys.includes(event.key.toLowerCase())) {
      this.setState({ elementType: findElementByKey(event.key) });
    } else if (event.metaKey && event.code === "KeyZ") {
      let lastEntry = stateHistory.pop();
      // If nothing was changed since last, take the previous one
      if (generateHistoryCurrentEntry(elements) === lastEntry) {
        lastEntry = stateHistory.pop();
      }
      if (lastEntry !== undefined) {
        restoreHistoryEntry(elements, lastEntry, skipHistory);
      }
      this.forceUpdate();
      event.preventDefault();
    }
  };

  private renderOption({
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
          checked={this.state.elementType === type}
          onChange={() => {
            this.setState({ elementType: type });
            clearSelection(elements);
            this.forceUpdate();
          }}
        />
        {children}
      </label>
    );
  }

  private deleteSelectedElements = () => {
    deleteSelectedElements(elements);
    this.forceUpdate();
  };

  private clearCanvas = () => {
    if (window.confirm("This will clear the whole canvas. Are you sure?")) {
      elements.splice(0, elements.length);
      this.setState({
        viewBackgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
      });
      this.forceUpdate();
    }
  };

  private moveAllLeft = () => {
    moveAllLeft(elements, getSelectedIndices(elements));
    this.forceUpdate();
  };

  private moveOneLeft = () => {
    moveOneLeft(elements, getSelectedIndices(elements));
    this.forceUpdate();
  };

  private moveAllRight = () => {
    moveAllRight(elements, getSelectedIndices(elements));
    this.forceUpdate();
  };

  private moveOneRight = () => {
    moveOneRight(elements, getSelectedIndices(elements));
    this.forceUpdate();
  };

  private removeWheelEventListener: (() => void) | undefined;

  public render() {
    const canvasWidth = window.innerWidth - CANVAS_WINDOW_OFFSET_LEFT;
    const canvasHeight = window.innerHeight - CANVAS_WINDOW_OFFSET_TOP;

    return (
      <div
        className="container"
        onCut={(e) => {
          e.clipboardData.setData(
            "text/plain",
            JSON.stringify(elements.filter((element) => element.isSelected))
          );
          deleteSelectedElements(elements);
          this.forceUpdate();
          e.preventDefault();
        }}
        onCopy={(e) => {
          e.clipboardData.setData(
            "text/plain",
            JSON.stringify(elements.filter((element) => element.isSelected))
          );
          e.preventDefault();
        }}
        onPaste={(e) => {
          const paste = e.clipboardData.getData("text");
          let parsedElements;
          try {
            parsedElements = JSON.parse(paste);
          } catch (e) {}
          if (
            Array.isArray(parsedElements) &&
            parsedElements.length > 0 &&
            parsedElements[0].type // need to implement a better check here...
          ) {
            clearSelection(elements);
            parsedElements.forEach((parsedElement) => {
              parsedElement.x += 10;
              parsedElement.y += 10;
              parsedElement.seed = randomSeed();
              generateDraw(parsedElement);
              elements.push(parsedElement);
            });
            this.forceUpdate();
          }
          e.preventDefault();
        }}
      >
        <div className="sidePanel">
          <h4>Shapes</h4>
          <div className="panelTools">
            {SHAPES.map(({ value, icon }) => (
              <label key={value} className="tool">
                <input
                  type="radio"
                  checked={this.state.elementType === value}
                  onChange={() => {
                    this.setState({ elementType: value });
                    clearSelection(elements);
                    document.documentElement.style.cursor =
                      value === "text" ? "text" : "crosshair";
                    this.forceUpdate();
                  }}
                />
                <div className="toolIcon">{icon}</div>
              </label>
            ))}
          </div>
          <h4>Colors</h4>
          <div className="panelColumn">
            <label>
              <input
                type="color"
                value={this.state.viewBackgroundColor}
                onChange={(e) => {
                  this.setState({ viewBackgroundColor: e.target.value });
                }}
              />
              Background
            </label>
            <label>
              <input
                type="color"
                value={this.state.currentItemStrokeColor}
                onChange={(e) => {
                  this.setState({ currentItemStrokeColor: e.target.value });
                }}
              />
              Shape Stroke
            </label>
            <label>
              <input
                type="color"
                value={this.state.currentItemBackgroundColor}
                onChange={(e) => {
                  this.setState({ currentItemBackgroundColor: e.target.value });
                }}
              />
              Shape Background
            </label>
          </div>
          <h4>Canvas</h4>
          <div className="panelColumn">
            <button
              onClick={this.clearCanvas}
              title="Clear the canvas & reset background color"
            >
              Clear canvas
            </button>
          </div>
          <h4>Export</h4>
          <div className="panelColumn">
            <button
              onClick={() => {
                exportAsPNG(this.state, canvas, elements);
              }}
            >
              Export to png
            </button>
            <label>
              <input
                type="checkbox"
                checked={this.state.exportBackground}
                onChange={(e) => {
                  this.setState({ exportBackground: e.target.checked });
                }}
              />
              background
            </label>
          </div>
          <h4>Save/Load</h4>
          <div className="panelColumn">
            <button
              onClick={() => {
                saveAsJSON(elements);
              }}
            >
              Save as...
            </button>
            <button
              onClick={() => {
                loadFromJSON(elements).then(() => this.forceUpdate());
              }}
            >
              Load file...
            </button>
          </div>
          {someElementIsSelected(elements) && (
            <>
              <h4>Shape options</h4>
              <div className="panelColumn">
                <button onClick={this.deleteSelectedElements}>Delete</button>
                <button onClick={this.moveOneRight}>Bring forward</button>
                <button onClick={this.moveAllRight}>Bring to front</button>
                <button onClick={this.moveOneLeft}>Send backward</button>
                <button onClick={this.moveAllLeft}>Send to back</button>
              </div>
            </>
          )}
        </div>
        <canvas
          id="canvas"
          style={{
            width: canvasWidth,
            height: canvasHeight,
          }}
          width={canvasWidth * window.devicePixelRatio}
          height={canvasHeight * window.devicePixelRatio}
          ref={(canvas) => {
            if (this.removeWheelEventListener) {
              this.removeWheelEventListener();
              this.removeWheelEventListener = undefined;
            }
            if (canvas) {
              canvas.addEventListener("wheel", this.handleWheel, {
                passive: false,
              });
              this.removeWheelEventListener = () =>
                canvas.removeEventListener("wheel", this.handleWheel);

              // Whenever React sets the width/height of the canvas element,
              // the context loses the scale transform. We need to re-apply it
              if (
                canvasWidth !== lastCanvasWidth ||
                canvasHeight !== lastCanvasHeight
              ) {
                lastCanvasWidth = canvasWidth;
                lastCanvasHeight = canvasHeight;
                canvas
                  .getContext("2d")!
                  .scale(window.devicePixelRatio, window.devicePixelRatio);
              }
            }
          }}
          onMouseDown={(e) => {
            if (lastMouseUp !== null) {
              // Unfortunately, sometimes we don't get a mouseup after a mousedown,
              // this can happen when a contextual menu or alert is triggered. In order to avoid
              // being in a weird state, we clean up on the next mousedown
              lastMouseUp(e);
            }
            // only handle left mouse button
            if (e.button !== 0) return;
            // fixes mousemove causing selection of UI texts #32
            e.preventDefault();
            // Preventing the event above disables default behavior
            //  of defocusing potentially focused input, which is what we want
            //  when clicking inside the canvas.
            if (isInputLike(document.activeElement)) {
              document.activeElement.blur();
            }

            const x =
              e.clientX - CANVAS_WINDOW_OFFSET_LEFT - this.state.scrollX;
            const y = e.clientY - CANVAS_WINDOW_OFFSET_TOP - this.state.scrollY;
            const element = newElement(
              this.state.elementType,
              x,
              y,
              this.state.currentItemStrokeColor,
              this.state.currentItemBackgroundColor
            );
            let resizeHandle: string | false = false;
            let isDraggingElements = false;
            let isResizingElements = false;
            if (this.state.elementType === "selection") {
              const resizeElement = elements.find((element) => {
                return resizeTest(element, x, y, {
                  scrollX: this.state.scrollX,
                  scrollY: this.state.scrollY,
                  viewBackgroundColor: this.state.viewBackgroundColor,
                });
              });

              this.setState({
                resizingElement: resizeElement ? resizeElement : null,
              });

              if (resizeElement) {
                resizeHandle = resizeTest(resizeElement, x, y, {
                  scrollX: this.state.scrollX,
                  scrollY: this.state.scrollY,
                  viewBackgroundColor: this.state.viewBackgroundColor,
                });
                document.documentElement.style.cursor = `${resizeHandle}-resize`;
                isResizingElements = true;
              } else {
                let hitElement = null;
                // We need to to hit testing from front (end of the array) to back (beginning of the array)
                for (let i = elements.length - 1; i >= 0; --i) {
                  if (hitTest(elements[i], x, y)) {
                    hitElement = elements[i];
                    break;
                  }
                }

                // If we click on something
                if (hitElement) {
                  if (hitElement.isSelected) {
                    // If that element is not already selected, do nothing,
                    // we're likely going to drag it
                  } else {
                    // We unselect every other elements unless shift is pressed
                    if (!e.shiftKey) {
                      clearSelection(elements);
                    }
                    // No matter what, we select it
                    hitElement.isSelected = true;
                  }
                } else {
                  // If we don't click on anything, let's remove all the selected elements
                  clearSelection(elements);
                }

                isDraggingElements = someElementIsSelected(elements);

                if (isDraggingElements) {
                  document.documentElement.style.cursor = "move";
                }
              }
            }

            if (isTextElement(element)) {
              resetCursor();
              const text = prompt("What text do you want?");
              if (text === null) {
                return;
              }
              element.text = text;
              element.font = "20px Virgil";
              const font = context.font;
              context.font = element.font;
              const {
                actualBoundingBoxAscent,
                actualBoundingBoxDescent,
                width,
              } = context.measureText(element.text);
              element.actualBoundingBoxAscent = actualBoundingBoxAscent;
              context.font = font;
              const height = actualBoundingBoxAscent + actualBoundingBoxDescent;
              // Center the text
              element.x -= width / 2;
              element.y -= actualBoundingBoxAscent;
              element.width = width;
              element.height = height;
            }

            generateDraw(element);
            elements.push(element);
            if (this.state.elementType === "text") {
              this.setState({
                draggingElement: null,
                elementType: "selection",
              });
              element.isSelected = true;
            } else {
              this.setState({ draggingElement: element });
            }

            let lastX = x;
            let lastY = y;

            const onMouseMove = (e: MouseEvent) => {
              const target = e.target;
              if (!(target instanceof HTMLElement)) {
                return;
              }

              if (isResizingElements && this.state.resizingElement) {
                const el = this.state.resizingElement;
                const selectedElements = elements.filter((el) => el.isSelected);
                if (selectedElements.length === 1) {
                  const x =
                    e.clientX - CANVAS_WINDOW_OFFSET_LEFT - this.state.scrollX;
                  const y =
                    e.clientY - CANVAS_WINDOW_OFFSET_TOP - this.state.scrollY;
                  selectedElements.forEach((element) => {
                    switch (resizeHandle) {
                      case "nw":
                        element.width += element.x - lastX;
                        element.height += element.y - lastY;
                        element.x = lastX;
                        element.y = lastY;
                        break;
                      case "ne":
                        element.width = lastX - element.x;
                        element.height += element.y - lastY;
                        element.y = lastY;
                        break;
                      case "sw":
                        element.width += element.x - lastX;
                        element.x = lastX;
                        element.height = lastY - element.y;
                        break;
                      case "se":
                        element.width += x - lastX;
                        if (e.shiftKey) {
                          element.height = element.width;
                        } else {
                          element.height += y - lastY;
                        }
                        break;
                      case "n":
                        element.height += element.y - lastY;
                        element.y = lastY;
                        break;
                      case "w":
                        element.width += element.x - lastX;
                        element.x = lastX;
                        break;
                      case "s":
                        element.height = lastY - element.y;
                        break;
                      case "e":
                        element.width = lastX - element.x;
                        break;
                    }

                    el.x = element.x;
                    el.y = element.y;
                    generateDraw(el);
                  });
                  lastX = x;
                  lastY = y;
                  // We don't want to save history when resizing an element
                  skipHistory = true;
                  this.forceUpdate();
                  return;
                }
              }

              if (isDraggingElements) {
                const selectedElements = elements.filter((el) => el.isSelected);
                if (selectedElements.length) {
                  const x =
                    e.clientX - CANVAS_WINDOW_OFFSET_LEFT - this.state.scrollX;
                  const y =
                    e.clientY - CANVAS_WINDOW_OFFSET_TOP - this.state.scrollY;
                  selectedElements.forEach((element) => {
                    element.x += x - lastX;
                    element.y += y - lastY;
                  });
                  lastX = x;
                  lastY = y;
                  // We don't want to save history when dragging an element to initially size it
                  skipHistory = true;
                  this.forceUpdate();
                  return;
                }
              }

              // It is very important to read this.state within each move event,
              // otherwise we would read a stale one!
              const draggingElement = this.state.draggingElement;
              if (!draggingElement) return;
              let width =
                e.clientX -
                CANVAS_WINDOW_OFFSET_LEFT -
                draggingElement.x -
                this.state.scrollX;
              let height =
                e.clientY -
                CANVAS_WINDOW_OFFSET_TOP -
                draggingElement.y -
                this.state.scrollY;
              draggingElement.width = width;
              // Make a perfect square or circle when shift is enabled
              draggingElement.height = e.shiftKey ? width : height;

              generateDraw(draggingElement);

              if (this.state.elementType === "selection") {
                setSelection(draggingElement, elements);
              }
              // We don't want to save history when moving an element
              skipHistory = true;
              this.forceUpdate();
            };

            const onMouseUp = (e: MouseEvent) => {
              const { draggingElement, elementType } = this.state;

              lastMouseUp = null;
              window.removeEventListener("mousemove", onMouseMove);
              window.removeEventListener("mouseup", onMouseUp);

              resetCursor();

              // if no element is clicked, clear the selection and redraw
              if (draggingElement === null) {
                clearSelection(elements);
                this.forceUpdate();
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

              this.setState({
                draggingElement: null,
                elementType: "selection",
              });
              this.forceUpdate();
            };

            lastMouseUp = onMouseUp;

            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);

            // We don't want to save history on mouseDown, only on mouseUp when it's fully configured
            skipHistory = true;
            this.forceUpdate();
          }}
        />
      </div>
    );
  }

  private handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const { deltaX, deltaY } = e;
    this.setState((state) => ({
      scrollX: state.scrollX - deltaX,
      scrollY: state.scrollY - deltaY,
    }));
  };

  componentDidUpdate() {
    renderScene(
      rc,
      canvas,
      {
        scrollX: this.state.scrollX,
        scrollY: this.state.scrollY,
        viewBackgroundColor: this.state.viewBackgroundColor,
      },
      elements
    );
    save(this.state, elements);
    if (!skipHistory) {
      pushHistoryEntry(stateHistory, generateHistoryCurrentEntry(elements));
    }
    skipHistory = false;
  }
}
