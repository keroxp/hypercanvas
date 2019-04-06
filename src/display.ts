import {Matrix2D, Rect} from "./geometry";
import {CanvasChild, CanvasComponent, CanvasView} from "./h";

export type DisplayProps = {
  x: number,
  y: number,
  scaleX: number,
  scaleY: number,
  skewX: number,
  skewY: number,
  rotation: number
  pivotX: number;
  pivotY: number;
  bounds: Rect;
  mtx: Matrix2D;
}

export interface CanvasNode<Attributes = {}> extends DisplayProps {
  parent?: CanvasNode
  attributes: Attributes;
  children: CanvasChild[]

  bounds: Rect

  setBounds(rect: Rect)

  setBounds(x: number, y: number, width: number, height: number)

  appendChild(child: CanvasNode, idx?: number)

  setChildIndex(child: CanvasNode, idx: number)

  removeChild(child: CanvasNode)

  removeFromParent()

  render(ctx: CanvasRenderingContext2D);
}

export type DrawFunction<T = DisplayProps> = (self: CanvasNode<T>, ctx: CanvasRenderingContext2D) => void;

export class DisplayObjectImpl<T> implements CanvasNode<T> {
  constructor(
    public attributes: T,
    public children: (CanvasView | CanvasNode)[] = []
  ) {
  }

  bounds: Rect = {
    x: 0, y: 0, width: 0, height: 0
  };

  setBounds(xOrRect: number | Rect, y: number = 0, width: number = 0, height: number = 0) {
    if (typeof xOrRect === "number") {
      this.bounds = {
        x: xOrRect, y, width, height
      }
    } else {
      const {x,y,width,height} = xOrRect;
      this.bounds ={x,y,width,height}
    }
  }

  private _mtx: Matrix2D = new Matrix2D();
  get mtx(): Matrix2D {
    return this.applyTransform();
  }

  set mtx(val: Matrix2D) {
    this._mtx = val;
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

  applyDisplayProps(p: Partial<DisplayProps>) {
    const nump = [
      "x", "y", "scaleX", "scaleY", "skewX", "skewY", "rotation", "pivotX", "pivotY"
    ];
    for (const key of nump) {
      if (typeof p[key] === "number") {
        this[key] = p[key]
      }
    }
    if (p.bounds) {
      this.setBounds(p.bounds)
    }
    if (p.mtx) {
      this.mtx.setMatrix(p.mtx)
    }
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
    ctx.save();
    this.applyTransform();
    ctx.transform(this._mtx.a, this._mtx.b, this._mtx.c, this._mtx.d, this._mtx.e, this._mtx.f);
    if (this.draw) {
      this.draw(this, ctx);
    }
    for (const child of this.children) {
      if (typeof child === "function") {
        child(0, 0).render(ctx);
      } else {
        child.render(ctx)
      }
    }
    ctx.restore();
  };
}
