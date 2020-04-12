import { MidasElement } from "./types";
import { generateDraw } from "./element";

export function generateHistoryCurrentEntry(elements: MidasElement[]) {
  return JSON.stringify(
    elements.map((element) => ({ ...element, isSelected: false }))
  );
}

export function pushHistoryEntry(stateHistory: string[], newEntry: string) {
  if (
    stateHistory.length > 0 &&
    stateHistory[stateHistory.length - 1] === newEntry
  ) {
    // If the last entry is the same as this one, ignore it
    return;
  }
  stateHistory.push(newEntry);
}

export function restoreHistoryEntry(
  elements: MidasElement[],
  entry: string,
  skipHistory: boolean,
  forceCanvasUpdate: React.DispatchWithoutAction
) {
  const newElements = JSON.parse(entry);
  elements.splice(0, elements.length);
  newElements.forEach((newElement: MidasElement) => {
    generateDraw(newElement);
    elements.push(newElement);
  });
  // When restoring, we shouldn't add an history entry otherwise we'll be stuck with it and can't go back
  skipHistory = true;
  forceCanvasUpdate();
}
