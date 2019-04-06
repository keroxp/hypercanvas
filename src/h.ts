import {CanvasNode, DisplayProps} from "./display";

export type CanvasChild = CanvasNode | CanvasView;
export type CanvasView<S = {}, A = {}> = (state: S, actions: A) => CanvasNode
export type CanvasComponent<Attributes = {}, State = {}, Actions = {}> = (
  attributes: Attributes, children: CanvasChild[]
) => CanvasNode<Attributes>

export function app<S = {}, A = {}>(
  state: S,
  acitons: A,
  view: CanvasView<S, A>,
  canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  const root = view(state, acitons);
  root.render(ctx);
  return root;
}

export function h<T>(
  component: CanvasComponent<T>,
  attributes: T,
  children: CanvasChild[] = []
): CanvasNode<T> {
  return component(attributes, children)
}