import {CanvasComponent} from "./h";
import {DisplayObjectImpl, DisplayProps, DrawFunction} from "./display";

export const Shape: CanvasComponent<Partial<DisplayProps> & {
  draw?: DrawFunction
}> = (attributes, children) =>  {
  const d = new DisplayObjectImpl(attributes, children);
  d.applyDisplayProps(attributes);
  d.draw = attributes.draw;
  return d;
};

export const Bitmap: CanvasComponent<Partial<DisplayProps> & {
  image: string | CanvasImageSource
  width?: number,
  height?: number
}> = (attributes) => {
  const d = new DisplayObjectImpl(attributes);
  d.applyDisplayProps(attributes);
  let img: CanvasImageSource;
  d.draw = (self1, ctx) => {
    if (img) {
      const {width, height} = attributes;
      ctx.drawImage(img, 0, 0, width, height);
    }
  };
  if (typeof attributes.image === "string") {
    const i = new Image();
    i.onload = () => {
      img = i;
    };
    if (attributes.width) {
      i.width = attributes.width
    }
    if (attributes.height) {
      i.height = attributes.height;
    }
    i.onerror = console.error;
    i.src = attributes.image
  } else {
    img = attributes.image;
  }
  return d;
};