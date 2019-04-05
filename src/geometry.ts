import {GeometricProps} from "./display";

export type Point = {
  x: number,
  y: number
}
export type Size = {
  width: number,
  height: number
}
export type Rect = Point & Size;

export class Matrix2D {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;

  constructor(
    a: number = 1,
    b: number = 0,
    c: number = 0,
    d: number = 1,
    e: number = 0,
    f: number = 0) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
  }

  identiy() {
    this.a = this.d = 1;
    this.b = this.d = 0;
    this.e = this.f = 0;
    return this;
  };

  set(a: number, b: number, c: number, d: number, e: number, f: number): Matrix2D {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
    return this;
  }

  append(a: number, b: number, c: number, d: number, e: number, f: number): Matrix2D {
    const _a = this.a * a + this.c * b;
    const _c = this.a * c + this.c * d;
    const _e = this.a * e + this.c * f + this.e;
    const _b = this.b * a + this.d * b;
    const _d = this.b * c + this.d * d;
    const _f = this.b * e + this.d * f + this.f;
    return this.set(_a, _b, _c, _d, _e, _f);
  };

  prepend(a: number, b: number, c: number, d: number, e: number, f: number): Matrix2D {
    const _a = a * this.a + c * this.b;
    const _c = a * this.c + c * this.d;
    const _e = a * this.e + c * this.f + e;
    const _b = b * this.a + d * this.b;
    const _d = b * this.c + d * this.d;
    const _f = b * this.e + d * this.f + f;
    return this.set(_a, _b, _c, _d, _e, _f);
  }

  appendMatrix(mtx: DOMMatrix2DInit): Matrix2D {
    return this.append(
      mtx.a, mtx.b, mtx.c, mtx.d, mtx.e, mtx.f
    )
  }

  prependMatrix(mtx: DOMMatrix2DInit): Matrix2D {
    return this.prepend(
      mtx.a, mtx.b, mtx.c, mtx.d, mtx.e, mtx.f
    )
  }

  scale(sx: number, sy: number): Matrix2D {
    return this.append(
      sx, 0, 0, sy, 0, 0
    )
  }

  rotate(theta: number): Matrix2D {
    const cost = Math.cos(theta);
    const sint = Math.sin(theta);
    const a = cost;
    const c = -sint;
    const b = sint;
    const d = cost;
    return this.append(a, b, c, d, 0, 0)
  }

  translate(tx: number, ty: number) {
    return this.append(
      1, 0, 0, 1, tx, ty
    )
  }

  skew(sx: number, sy: number) {
    return this.append(
      1, sy, sx, 1, 0, 0
    )
  }

  cross(x: number, y: number): [number, number] {
    return [
      this.a * x + this.c * y + this.e,
      this.b * x + this.d * y + this.f
    ]
  }

  decompose(tgt?: Partial<GeometricProps>): GeometricProps {
    tgt = tgt || {x: 0, y: 0, skewX: 0, skewY: 0, scaleX: 0, scaleY: 0};
    [tgt.x, tgt.y] = this.cross(tgt.x, tgt.y);
    tgt.scaleX = this.a;
    tgt.scaleY = this.d;
    tgt.skewX = this.c;
    tgt.skewY = this.b;
    return tgt;
  }
}