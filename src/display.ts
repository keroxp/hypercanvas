import {Matrix2D, Rect} from "./geometry";
import {CanvasComponent} from "./h";

export type GeometricProps = {
  x: number,
  y: number,
  scaleX: number,
  scaleY: number,
  skewX: number,
  skewY: number,
}

export type DisplayProps = GeometricProps & {
  rotation: number
  pivotX: number;
  pivotY: number;
  bounds: Rect;
  mtx: Matrix2D;
}

export const Shape: CanvasComponent<DisplayProps & {
  draw: DrawFunction
}> = (attributes, children) =>  {
  const d = new DisplayObjectImpl(attributes, children);
  d.draw = attributes.draw;
  return d;
};

export interface CanvasNode<Attributes = {}> extends DisplayProps {
  parent?: CanvasNode
  attributes: Attributes;
  children: CanvasNode[]

  appendChild(child: CanvasNode, idx?: number)

  setChildIndex(child: CanvasNode, idx: number)

  removeChild(child: CanvasNode)

  removeFromParent()

  render(ctx: CanvasRenderingContext2D);
}

export type DrawFunction<T = DisplayProps> = (self: CanvasNode<T>, ctx: CanvasRenderingContext2D) => void;

class DisplayObjectImpl<T> implements CanvasNode<T> {
  constructor(
    public attributes: T,
    public children: CanvasNode[] = []
  ) {
    for (const key in attributes) {
      this[key] = attributes[key];
    }
  }

  bounds: Rect;

  private _mtx: Matrix2D = new Matrix2D();
  get mtx(): Matrix2D {
    return this.applyTransform();
  }

  parent: CanvasNode;
  scaleX: number = 1;
  scaleY: number = 1;
  skewX: number = 0;
  skewY: number = 0;
  rotation: number = 0;
  pivotX: number = 0;
  pivotY: number = 0;
  x: number = 0;
  y: number = 0;
  draw: DrawFunction<T>;

  concatenatedMatrix() {
    let n: CanvasNode = this;
    let m = this.mtx;
    while ((n = n.parent)) {
      m.prependMatrix(n.mtx)
    }
    return m;
  }

  applyTransform() {
    const dx = this.pivotX - this.x;
    const dy = this.pivotY - this.y;
    return this._mtx
      .set(this.scaleX, this.skewY, this.skewX, this.scaleY, this.x, this.y)
      .translate(dx, dy)
      .rotate(this.rotation)
      .translate(-dx, -dy)
  }

  appendChild(child: CanvasNode, idx = this.children.length) {
    child.removeFromParent();
    this.children.splice(idx, 0, child)
  }

  removeChild(child: CanvasNode) {
    const i = this.children.indexOf(child);
    if (i > -1) {
      this.children.splice(i, 1)
    }
  }

  setChildIndex(child: CanvasNode, idx: number) {
    const i = this.children.indexOf(child);
    if (i > -1) {
      this.children.splice(i, 1);
      this.children.splice(idx, 0, child);
    }
  }

  removeFromParent() {
    if (this.parent) {
      this.parent.removeChild(this)
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    console.log("render");
    ctx.save();
    ctx.transform(this.mtx.a, this.mtx.b, this.mtx.c, this.mtx.d, this.mtx.e, this.mtx.f);
    this.draw(this, ctx);
    for (const child of this.children) {
      child.render(ctx)
    }
    ctx.restore();
  };
}
