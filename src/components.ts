import {CanvasComponent} from "./h";
import {DisplayObjectImpl, DisplayProps, DrawFunction} from "./display";

export const Stage: CanvasComponent<DisplayProps> = (attributes, children) => {
  const d = new DisplayObjectImpl(attributes, children);
  d.draw = (self, ctx) => {
    const canvas = ctx.canvas;
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill()
  };
  return d;
};

export const Text: CanvasComponent<DisplayProps & {
  text: string,
  color?: string
  textAlign?: CanvasTextAlign,
  textBaseline?: CanvasTextBaseline,
  fontFamily?: string,
  fontSize?: string,
  fontStyle?: string
  maxWidth?: number
}> = (attributes, children) => {
  const d = new DisplayObjectImpl(attributes, children);
  d.setDisplayProps(attributes);
  const {text, fontFamily, color, fontSize, fontStyle, maxWidth} = attributes;
  d.draw = (self1, ctx) => {
    ctx.textAlign = attributes.textAlign || "left";
    ctx.textBaseline = attributes.textBaseline;
    ctx.font = `${fontSize || "10px"} ${fontFamily || "sans-serif"}`;
    ctx.fillStyle = color || "#000";
    ctx.fillText(text, 0, 0, maxWidth);
  };
  return d;
};

export const Shape: CanvasComponent<DisplayProps & {
  draw?: DrawFunction
}> = (attributes, children = []) => {
  const d = new DisplayObjectImpl(attributes, children);
  if (attributes) {
    d.setDisplayProps(attributes);
    d.draw = attributes.draw;
  }
  return d;
};

export const Bitmap: CanvasComponent<DisplayProps & {
  image: string | CanvasImageSource
  width?: number,
  height?: number
}> = (attributes) => {
  const d = new DisplayObjectImpl(attributes);
  d.setDisplayProps(attributes);
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