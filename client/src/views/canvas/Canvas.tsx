// modules
import React, { useEffect } from "react";
import { useContextSelector } from "use-context-selector";
import { css } from "styled-components/macro";

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
import { canvasStoreWhiteList } from "../../~reusables/utils/saveAndRetrieval";
import {
  hitTest,
  resizeTest,
  resetCursor,
  renderScene
} from "../../~reusables/utils/canvas";
import {
  KEYS,
  LOCAL_STORAGE_MIDAS_STATE_KEY
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
import {
  useCanvasElementsStore,
  CanvasContext,
  ICanvasState
} from "../../~reusables/contexts/CanvasProvider";
import {
  CANVAS_SIDEBAR_WIDTH,
  CANVAS_TOPBAR_HEIGHT,
  ELEMENT_SHIFT_TRANSLATE_AMOUNT,
  ELEMENT_TRANSLATE_AMOUNT
} from "../../~reusables/constants/dimensions";
import { useUpdateProjectMutation } from "../../generated/graphql";
import _ from "lodash";

export const Canvas: React.FC = () => {
  return (
    <section>
      <CanvasTopbar />
      <AssetsSidebar />
      <StatefulCanvas />
      <CustomizeSidebar />
    </section>
  );
};

export const StatefulCanvas: React.FC = () => {
  const elements = useCanvasElementsStore(state => state.elements);
  const canvasStore = useContextSelector(CanvasContext, state => state);

  const [updateProject] = useUpdateProjectMutation({ ignoreResults: true });
  const updateProjectDebounced = _.debounce(() => {
    localStorage.setItem(
      LOCAL_STORAGE_MIDAS_STATE_KEY,
      JSON.stringify(_.pick(canvasStore, canvasStoreWhiteList))
    );
    updateProject({
      variables: {
        projectInput: {
          elements: JSON.stringify(elements)
        },
        where: { uuid: canvasStore.project?.uuid }
      }
    });
  }, 2000);

  useEffect(() => {
    /**
     * Anytime canvasStore or elements changes, make a write to the
     * database after a debounced 2 second pause. Cancel and restart
     * the debounce if the dependency variables change
     */
    updateProjectDebounced();
    return () => {
      updateProjectDebounced.cancel();
    };
  }, [canvasStore, elements]);

  return <StatelessCanvas {...canvasStore} elements={elements} />;
};

let skipHistory = false;
const stateHistory: string[] = [];
const shapesShortcutKeys = SHAPES.map(shape => shape.value[0]);
let lastCanvasWidth = -1;
let lastCanvasHeight = -1;
let lastMouseUp: ((e: any) => void) | null = null;

interface IStatelessCanvas extends ICanvasState {
  elements: MidasElement[];
}
class StatelessCanvas extends React.Component<IStatelessCanvas> {
  public state = {
    scrollX: 0,
    scrollY: 0
  };

  public componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown, false);
    window.addEventListener("resize", this.onResize, false);
  }

  public componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown, false);
    window.removeEventListener("resize", this.onResize, false);
  }

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
      deleteSelectedElements(this.props.elements, this.props.forceCanvasUpdate);
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
      moveOneLeft(
        this.props.elements,
        getSelectedIndices(this.props.elements),
        this.props.forceCanvasUpdate
      );
      event.preventDefault();

      // Send to back: Cmd-Shift-B
    } else if (event.metaKey && event.shiftKey && event.code === "KeyB") {
      moveAllLeft(
        this.props.elements,
        getSelectedIndices(this.props.elements),
        this.props.forceCanvasUpdate
      );
      event.preventDefault();

      // Bring forward: Cmd-Shift-Alt-F
    } else if (
      event.metaKey &&
      event.shiftKey &&
      event.altKey &&
      event.code === "KeyF"
    ) {
      moveOneRight(
        this.props.elements,
        getSelectedIndices(this.props.elements),
        this.props.forceCanvasUpdate
      );
      event.preventDefault();

      // Bring to front: Cmd-Shift-F
    } else if (event.metaKey && event.shiftKey && event.code === "KeyF") {
      moveAllRight(
        this.props.elements,
        getSelectedIndices(this.props.elements),
        this.props.forceCanvasUpdate
      );
      event.preventDefault();

      // Select all: Cmd-A
    } else if (event.metaKey && event.code === "KeyA") {
      this.props.elements.forEach(element => {
        element.isSelected = true;
      });
      this.forceUpdate();
      event.preventDefault();
    } else if (shapesShortcutKeys.includes(event.key.toLowerCase())) {
      this.props.setCanvasState(prevState => ({
        ...prevState,
        elementType: findElementByKey(event.key)
      }));
    } else if (event.metaKey && event.code === "KeyZ") {
      let lastEntry = stateHistory.pop();
      // If nothing was changed since last, take the previous one
      if (generateHistoryCurrentEntry(this.props.elements) === lastEntry) {
        lastEntry = stateHistory.pop();
      }
      if (lastEntry !== undefined) {
        restoreHistoryEntry(
          this.props.elements,
          lastEntry,
          skipHistory,
          this.props.forceCanvasUpdate
        );
      }
      this.forceUpdate();
      event.preventDefault();
    }
  };

  private removeWheelEventListener: (() => void) | undefined;

  private handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const { deltaX, deltaY } = e;
    this.setState({
      scrollX: this.state.scrollX - deltaX,
      scrollY: this.state.scrollY - deltaY
    });
  };

  public render() {
    const canvasWidth = window.innerWidth - CANVAS_SIDEBAR_WIDTH * 2;
    const canvasHeight = window.innerHeight - CANVAS_TOPBAR_HEIGHT;
    const { elements } = this.props;

    return (
      <div
        css={css`
          position: absolute;
          top: ${CANVAS_TOPBAR_HEIGHT}px;
          bottom: 0;
          left: ${CANVAS_SIDEBAR_WIDTH}px;
          right: ${CANVAS_SIDEBAR_WIDTH}px;
        `}
        onCut={e => {
          e.clipboardData.setData(
            "text/plain",
            JSON.stringify(elements.filter(element => element.isSelected))
          );
          deleteSelectedElements(elements, this.props.forceCanvasUpdate);
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
        <canvas
          id="canvas"
          style={{
            width: canvasWidth,
            height: canvasHeight
          }}
          width={canvasWidth * window.devicePixelRatio}
          height={canvasHeight * window.devicePixelRatio}
          ref={canvas => {
            this.props.canvasRef.current = canvas;
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

            const x = e.clientX - CANVAS_SIDEBAR_WIDTH - this.state.scrollX;
            const y = e.clientY - CANVAS_TOPBAR_HEIGHT - this.state.scrollY;
            const element = newElement(
              this.props.elementType,
              x,
              y,
              this.props.currentItemStrokeColor,
              this.props.currentItemBackgroundColor
            );
            let resizeHandle: string | false = false;
            let isDraggingElements = false;
            let isResizingElements = false;
            if (this.props.elementType === "selection") {
              const resizeElement = elements.find(element => {
                return resizeTest(element, x, y, {
                  scrollX: this.state.scrollX,
                  scrollY: this.state.scrollY,
                  viewBackgroundColor: this.props.viewBackgroundColor
                });
              });

              this.props.setCanvasState(prevState => ({
                ...prevState,
                resizingElement: resizeElement ? resizeElement : null
              }));

              if (resizeElement) {
                resizeHandle = resizeTest(resizeElement, x, y, {
                  scrollX: this.state.scrollX,
                  scrollY: this.state.scrollY,
                  viewBackgroundColor: this.props.viewBackgroundColor
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

            if (isTextElement(element) && this.props.contextRef.current) {
              const context = this.props.contextRef.current;
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
            if (this.props.elementType === "text") {
              this.props.setCanvasState(prevState => ({
                ...prevState,
                draggingElement: null,
                elementType: "selection"
              }));
              element.isSelected = true;
            } else {
              this.props.setCanvasState(prevState => ({
                ...prevState,
                draggingElement: element
              }));
            }

            let lastX = x;
            let lastY = y;

            const onMouseMove = (e: MouseEvent) => {
              const target = e.target;
              if (!(target instanceof HTMLElement)) {
                return;
              }

              if (isResizingElements && this.props.resizingElement) {
                const el = this.props.resizingElement;
                const selectedElements = elements.filter(el => el.isSelected);
                if (selectedElements.length === 1) {
                  const x =
                    e.clientX - CANVAS_SIDEBAR_WIDTH - this.state.scrollX;
                  const y =
                    e.clientY - CANVAS_TOPBAR_HEIGHT - this.state.scrollY;
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
                    e.clientX - CANVAS_SIDEBAR_WIDTH - this.state.scrollX;
                  const y =
                    e.clientY - CANVAS_TOPBAR_HEIGHT - this.state.scrollY;
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
              const draggingElement = this.props.draggingElement;
              if (!draggingElement) return;
              let width =
                e.clientX -
                CANVAS_SIDEBAR_WIDTH -
                draggingElement.x -
                this.state.scrollX;
              let height =
                e.clientY -
                CANVAS_TOPBAR_HEIGHT -
                draggingElement.y -
                this.state.scrollY;
              draggingElement.width = width;
              // Make a perfect square or circle when shift is enabled
              draggingElement.height = e.shiftKey ? width : height;

              generateDraw(draggingElement);

              if (this.props.elementType === "selection") {
                setSelection(draggingElement, elements);
              }
              // We don't want to save history when moving an element
              skipHistory = true;
              this.forceUpdate();
            };

            const onMouseUp = (e: MouseEvent) => {
              const { draggingElement, elementType } = this.props;

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

              this.props.setCanvasState(prevState => ({
                ...prevState,
                draggingElement: null,
                elementType: "selection"
              }));
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

  componentDidUpdate() {
    if (this.props.rcRef.current && this.props.canvasRef.current) {
      renderScene(
        this.props.rcRef.current,
        this.props.canvasRef.current,
        {
          scrollX: this.state.scrollX,
          scrollY: this.state.scrollY,
          viewBackgroundColor: this.props.viewBackgroundColor
        },
        this.props.elements
      );
      if (!skipHistory) {
        pushHistoryEntry(
          stateHistory,
          generateHistoryCurrentEntry(this.props.elements)
        );
      }
      skipHistory = false;
    }
  }
}
