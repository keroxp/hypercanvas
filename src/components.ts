import {CanvasComponent} from "./h";
import {DisplayObjectImpl, DisplayProps, DrawFunction} from "./display";

export const Shape: CanvasComponent<Partial<DisplayProps> & {
  draw?: DrawFunction
}> = (attributes, children) =>  {
  const d = new DisplayObjectImpl(attributes, children);
  d.draw = attributes.draw;
  return d;
};

export const Bitmap: CanvasComponent<Partial<DisplayProps> & {
  image: string | CanvasImageSource
}> = (attributes, children) => {
  const d = new DisplayObjectImpl(attributes);
  let img: CanvasImageSource;
  d.draw = (self1, ctx) => {
    if (img) {
      ctx.drawImage(img, 0, 0)
    }
  };
  if (typeof attributes.image === "string") {
    const i = new Image();
    i.onload = () => {
      img = i;
    };
    i.onerror = console.error;
    i.src = attributes.image
  } else {
    img = attributes.image;
  }
  return d;
};