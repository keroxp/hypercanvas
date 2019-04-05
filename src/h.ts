import {CanvasNode, DrawFunction, Shape} from "./display";

export type CanvasView<S = {}, A = {}> = (state: S, actions: A) => CanvasNode
export type CanvasComponent<Attributes = {}, State = {}, Actions = {}> = (
  attributes: Attributes, children: (CanvasNode|CanvasView)[]) => CanvasNode<Attributes> | CanvasView<State, Actions>

export function app<S = {}, A = {}>(
  state: S,
  acitons: A,
  view: CanvasView<S, A>,
  canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  const root = view(state, acitons);
  root.render(ctx);
}

export function h<T>(
  component: CanvasComponent<T>,
  attributes: T,
  children: (CanvasNode|CanvasView)[] = []
): CanvasNode<T> | CanvasView {
  return component(attributes, children)
}