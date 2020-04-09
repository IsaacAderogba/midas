import rough from "roughjs/bin/wrappers/rough";
import { MidasElement } from "./types";
import { ICanvasState } from "../../views/canvas/Canvas";
import {
  getElementAbsoluteX1,
  getElementAbsoluteX2,
  getElementAbsoluteY1,
  getElementAbsoluteY2,
} from "./coords";
import {
  LOCAL_STORAGE_MIDAS_KEY,
  LOCAL_STORAGE_MIDAS_STATE_KEY,
} from "../constants/constants";
import { generateDraw } from "./element";
import { renderScene } from "./canvas";

export function saveAsJSON(elements: MidasElement[]) {
  const serialized = JSON.stringify({
    version: 1,
    source: window.location.origin,
    elements,
  });

  saveFile(
    "excalidraw.json",
    "data:text/plain;charset=utf-8," + encodeURIComponent(serialized)
  );
}

export function loadFromJSON(elements: MidasElement[]) {
  const input = document.createElement("input");
  const reader = new FileReader();
  input.type = "file";
  input.accept = ".json";

  input.onchange = () => {
    if (!input.files!.length) {
      alert("A file was not selected.");
      return;
    }

    reader.readAsText(input.files![0], "utf8");
  };

  input.click();

  return new Promise((resolve) => {
    reader.onloadend = () => {
      if (reader.readyState === FileReader.DONE) {
        const data = JSON.parse(reader.result as string);
        restore(data.elements, null, elements);
        resolve();
      }
    };
  });
}

interface IExportPNG {
  exportBackground: boolean;
  exportPadding?: number;
  viewBackgroundColor: string;
  scrollX: number;
  scrollY: number;
}

export function exportAsPNG(
  { exportBackground, exportPadding = 10, viewBackgroundColor }: IExportPNG,
  canvas: HTMLCanvasElement,
  elements: MidasElement[]
) {
  if (!elements.length) return window.alert("Cannot export empty canvas.");

  // calculate smallest area to fit the contents in

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

  function distance(x: number, y: number) {
    return Math.abs(x > y ? x - y : y - x);
  }

  const tempCanvas = document.createElement("canvas");
  tempCanvas.style.display = "none";
  document.body.appendChild(tempCanvas);
  tempCanvas.width = distance(subCanvasX1, subCanvasX2) + exportPadding * 2;
  tempCanvas.height = distance(subCanvasY1, subCanvasY2) + exportPadding * 2;

  renderScene(
    rough.canvas(tempCanvas),
    tempCanvas,
    {
      viewBackgroundColor: exportBackground ? viewBackgroundColor : null,
      scrollX: 0,
      scrollY: 0,
    },
    elements,
    {
      offsetX: -subCanvasX1 + exportPadding,
      offsetY: -subCanvasY1 + exportPadding,
      renderScrollbars: false,
      renderSelection: false,
    }
  );

  saveFile("excalidraw.png", tempCanvas.toDataURL("image/png"));

  // clean up the DOM
  if (tempCanvas !== canvas) tempCanvas.remove();
}

export function saveFile(name: string, data: string) {
  // create a temporary <a> elem which we'll use to download the image
  const link = document.createElement("a");
  link.setAttribute("download", name);
  link.setAttribute("href", data);
  link.click();

  // clean up
  link.remove();
}

export function save(state: ICanvasState, elements: MidasElement[]) {
  localStorage.setItem(LOCAL_STORAGE_MIDAS_KEY, JSON.stringify(elements));
  localStorage.setItem(LOCAL_STORAGE_MIDAS_STATE_KEY, JSON.stringify(state));
}

export function restoreFromLocalStorage(elements: MidasElement[]) {
  const savedElements = localStorage.getItem(LOCAL_STORAGE_MIDAS_KEY);
  const savedState = localStorage.getItem(LOCAL_STORAGE_MIDAS_STATE_KEY);

  return restore(savedElements, savedState, elements);
}

export function restore(
  savedElements: string | MidasElement[] | null,
  savedState: string | null,
  elements: MidasElement[]
) {
  try {
    if (savedElements) {
      elements.splice(
        0,
        elements.length,
        ...(typeof savedElements === "string"
          ? JSON.parse(savedElements)
          : savedElements)
      );
      elements.forEach((element: MidasElement) => generateDraw(element));
    }

    return savedState ? JSON.parse(savedState) : null;
  } catch (e) {
    elements.splice(0, elements.length);
    return null;
  }
}
