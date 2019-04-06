# hypercanvas

[![npm](https://img.shields.io/npm/v/hypercanvas.svg)](https://www.npmjs.org/package/hypercanvas)

A reactive framework to build declarative canvas application

**NOTE: STILL WIP**

## Motivations

- want to build canvas application by declarative way
- want to use JSX
- want to make it reactive
- love [easeljs](https://www.createjs.com/easeljs) and [hyperapp](https://github.com/jorgebucaran/hyperapp)

## TODO

- virtual dom patching
- state and actions
- tick system that coexists reactive state

## Example

```jsx
import {app, h, Stage, Bitmap, Text, Shape} from "hypercanvas";

const canvas = document.getElementById("canvas");
const view = (state, actions) => {
  const drawRect = (elem, ctx) => {
    ctx.beginPath();
    ctx.fillStyle = "#f00";
    ctx.rect(-50, -50, 100, 100);
    ctx.fill();
  };
  const drawCircle = (elem, ctx) => {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0f0";
    ctx.arc(0, 0, 50, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.stroke()
  }
  return (
    <Stage>
      <Shape x={250} y={250} draw={drawRect}>
        <Shape x={100} y={100}>
          <Shape draw={drawCircle}/>
        </Shape>
      </Shape>
      <Text text="Hello World!" fontSize="12pt" fontFamily="Arial" />
      <Bitmap image={"/keroxp.png"} width={100} height={100}/>
    </Stage>
  )
};

const stage = app(null, null, view, canvas);
setInterval(() => {
  const ctx = canvas.getContext("2d");
  stage.render(ctx)
}, 16);
```
## LICENSE

MIT

