import { newElement } from "./element";

export type Maybe<T> = T | null;
export type MidasElement = ReturnType<typeof newElement>;
export type MidasTextElement = MidasElement & {
  type: "text";
  font: string;
  text: string;
  actualBoundingBoxAscent: number;
};

export type SceneState = {
  scrollX: number;
  scrollY: number;
  // null indicates transparent bg
  viewBackgroundColor: string | null;
};