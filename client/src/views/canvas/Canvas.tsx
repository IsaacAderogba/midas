// modules
import React from "react";
import rough from "roughjs/bin/wrappers/rough";
import { RoughCanvas } from "roughjs/bin/canvas";

// components
import { CanvasTopbar, SHAPES } from "./CanvasTopbar";
import { AssetsSidebar } from "./AssetsSidebar";
import { CustomizeSidebar } from "./CustomizeSidebar";

// helpers
import { MidasElement } from "../../~reusables/utils/types";
import {
  moveOneLeft,
  moveAllLeft,
  moveOneRight,
  moveAllRight
} from "../../~reusables/utils/zindex";
import "./styles.scss";
import {
  generateHistoryCurrentEntry,
  restoreHistoryEntry,
  pushHistoryEntry
} from "../../~reusables/utils/history";
import { randomSeed } from "../../~reusables/utils/seed";
import {
  saveAsJSON,
  loadFromJSON,
  exportAsPNG,
  restoreFromLocalStorage,
  save
} from "../../~reusables/utils/saveAndRetrieval";
import {
  hitTest,
  resizeTest,
  resetCursor,
  renderScene
} from "../../~reusables/utils/canvas";
import {
  KEYS,
  ELEMENT_SHIFT_TRANSLATE_AMOUNT,
  ELEMENT_TRANSLATE_AMOUNT,
  CANVAS_WINDOW_OFFSET_LEFT,
  CANVAS_WINDOW_OFFSET_TOP
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
  isArrowKey
} from "../../~reusables/utils/element";
import { useCanvasStore } from "../../~reusables/contexts/CanvasProvider";

let canvas: HTMLCanvasElement;
let rc: RoughCanvas;
let context: CanvasRenderingContext2D;

export const CanvasWrapper: React.FC = () => {
  const elements = useCanvasStore(state => state.elements);
  return (
    <section>
      {/* <CanvasTopbar />
      <AssetsSidebar /> */}
      <Canvas elements={elements} />
      {/* <CustomizeSidebar /> */}
    </section>
  );
};

let skipHistory = false;
const stateHistory: string[] = [];

const shapesShortcutKeys = SHAPES.map(shape => shape.value[0]);

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

let lastCanvasWidth = -1;
let lastCanvasHeight = -1;
let lastMouseUp: ((e: any) => void) | null = null;

class Canvas extends React.Component<{elements: MidasElement[]}, ICanvasState> {
  public componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown, false);
    window.addEventListener("resize", this.onResize, false);

    canvas = document.getElementById("canvas") as HTMLCanvasElement;
    rc = rough.canvas(canvas);
    context = canvas.getContext("2d")!;
    context.translate(0.5, 0.5);
    this.forceUpdate();
    // TODO - at front or behind
    const savedState = restoreFromLocalStorage(this.props.elements);
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
    scrollY: 0
  };

  private onResize = () => {
    this.forceUpdate();
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if (isInputLike(event.target)) return;

    if (event.key === KEYS.ESCAPE) {
      clearSelection(this.props.elements);
      this.forceUpdate();
      event.preventDefault();
    } else if (event.key === KEYS.BACKSPACE || event.key === KEYS.DELETE) {
      deleteSelectedElements(this.props.elements);
      this.forceUpdate();
      event.preventDefault();
    } else if (isArrowKey(event.key)) {
      const step = event.shiftKey
        ? ELEMENT_SHIFT_TRANSLATE_AMOUNT
        : ELEMENT_TRANSLATE_AMOUNT;
        this.props.elements.forEach(element => {
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
      this.props.elements.forEach(element => {
        element.isSelected = true;
      });
      this.forceUpdate();
      event.preventDefault();
    } else if (shapesShortcutKeys.includes(event.key.toLowerCase())) {
      this.setState({ elementType: findElementByKey(event.key) });
    } else if (event.metaKey && event.code === "KeyZ") {
      let lastEntry = stateHistory.pop();
      // If nothing was changed since last, take the previous one
      if (generateHistoryCurrentEntry(this.props.elements) === lastEntry) {
        lastEntry = stateHistory.pop();
      }
      if (lastEntry !== undefined) {
        restoreHistoryEntry(this.props.elements, lastEntry, skipHistory);
      }
      this.forceUpdate();
      event.preventDefault();
    }
  };

  private renderOption({
    type,
    children
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
            clearSelection(this.props.elements);
            this.forceUpdate();
          }}
        />
        {children}
      </label>
    );
  }

  private deleteSelectedElements = () => {
    deleteSelectedElements(this.props.elements);
    this.forceUpdate();
  };

  private clearCanvas = () => {
    if (window.confirm("This will clear the whole canvas. Are you sure?")) {
      this.props.elements.splice(0, this.props.elements.length);
      this.setState({
        viewBackgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0
      });
      this.forceUpdate();
    }
  };

  private moveAllLeft = () => {
    moveAllLeft(this.props.elements, getSelectedIndices(this.props.elements));
    this.forceUpdate();
  };

  private moveOneLeft = () => {
    moveOneLeft(this.props.elements, getSelectedIndices(this.props.elements));
    this.forceUpdate();
  };

  private moveAllRight = () => {
    moveAllRight(this.props.elements, getSelectedIndices(this.props.elements));
    this.forceUpdate();
  };

  private moveOneRight = () => {
    moveOneRight(this.props.elements, getSelectedIndices(this.props.elements));
    this.forceUpdate();
  };

  private removeWheelEventListener: (() => void) | undefined;

  public render() {
    const canvasWidth = window.innerWidth - CANVAS_WINDOW_OFFSET_LEFT;
    const canvasHeight = window.innerHeight - CANVAS_WINDOW_OFFSET_TOP;
    const { elements } = this.props;

    return (
      <div
        className="container"
        onCut={e => {
          e.clipboardData.setData(
            "text/plain",
            JSON.stringify(elements.filter(element => element.isSelected))
          );
          deleteSelectedElements(elements);
          this.forceUpdate();
          e.preventDefault();
        }}
        onCopy={e => {
          e.clipboardData.setData(
            "text/plain",
            JSON.stringify(elements.filter(element => element.isSelected))
          );
          e.preventDefault();
        }}
        onPaste={e => {
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
            parsedElements.forEach(parsedElement => {
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
                onChange={e => {
                  this.setState({ viewBackgroundColor: e.target.value });
                }}
              />
              Background
            </label>
            <label>
              <input
                type="color"
                value={this.state.currentItemStrokeColor}
                onChange={e => {
                  this.setState({ currentItemStrokeColor: e.target.value });
                }}
              />
              Shape Stroke
            </label>
            <label>
              <input
                type="color"
                value={this.state.currentItemBackgroundColor}
                onChange={e => {
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
                onChange={e => {
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
            height: canvasHeight
          }}
          width={canvasWidth * window.devicePixelRatio}
          height={canvasHeight * window.devicePixelRatio}
          ref={canvas => {
            if (this.removeWheelEventListener) {
              this.removeWheelEventListener();
              this.removeWheelEventListener = undefined;
            }
            if (canvas) {
              canvas.addEventListener("wheel", this.handleWheel, {
                passive: false
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
          onMouseDown={e => {
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
              const resizeElement = elements.find(element => {
                return resizeTest(element, x, y, {
                  scrollX: this.state.scrollX,
                  scrollY: this.state.scrollY,
                  viewBackgroundColor: this.state.viewBackgroundColor
                });
              });

              this.setState({
                resizingElement: resizeElement ? resizeElement : null
              });

              if (resizeElement) {
                resizeHandle = resizeTest(resizeElement, x, y, {
                  scrollX: this.state.scrollX,
                  scrollY: this.state.scrollY,
                  viewBackgroundColor: this.state.viewBackgroundColor
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
                width
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
                elementType: "selection"
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
                const selectedElements = elements.filter(el => el.isSelected);
                if (selectedElements.length === 1) {
                  const x =
                    e.clientX - CANVAS_WINDOW_OFFSET_LEFT - this.state.scrollX;
                  const y =
                    e.clientY - CANVAS_WINDOW_OFFSET_TOP - this.state.scrollY;
                  selectedElements.forEach(element => {
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
                const selectedElements = elements.filter(el => el.isSelected);
                if (selectedElements.length) {
                  const x =
                    e.clientX - CANVAS_WINDOW_OFFSET_LEFT - this.state.scrollX;
                  const y =
                    e.clientY - CANVAS_WINDOW_OFFSET_TOP - this.state.scrollY;
                  selectedElements.forEach(element => {
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
                elementType: "selection"
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
    this.setState(state => ({
      scrollX: state.scrollX - deltaX,
      scrollY: state.scrollY - deltaY
    }));
  };

  componentDidUpdate() {
    renderScene(
      rc,
      canvas,
      {
        scrollX: this.state.scrollX,
        scrollY: this.state.scrollY,
        viewBackgroundColor: this.state.viewBackgroundColor
      },
      this.props.elements
    );
    save(this.state, this.props.elements);
    if (!skipHistory) {
      pushHistoryEntry(stateHistory, generateHistoryCurrentEntry(this.props.elements));
    }
    skipHistory = false;
  }
}
