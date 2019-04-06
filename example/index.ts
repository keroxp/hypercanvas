import {DrawFunction} from "../src/display";
import {app, h} from "../src/h";
import {Bitmap, Shape} from "../src/components";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
let frame = 0;
const view = (state, actions) => {
  const draw: DrawFunction = (self1, ctx) => {
    ctx.beginPath();
    ctx.fillStyle = "#f00";
    ctx.rect(-50, -50, 100, 100);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0f0";
    ctx.strokeRect(-40, -40, 80, 80);
    ctx.closePath();
    ctx.stroke()
  };
  const drawTriangle: DrawFunction = (self1, ctx) => {
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 2]);
    ctx.rect(-25, -25, 50, 50);
    ctx.closePath();
    ctx.stroke();
  };
  const drawGradientArc: DrawFunction = (self1, ctx) => {
    ctx.beginPath();
    const c = frame.toString(16);
    ctx.clearRect(-50, -50, 100, 100);
    ctx.fillStyle = `#${c}${c}${c}`;
    ctx.arc(0, 0, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    frame++;
    if (frame > 255) {
      frame = 0;
    }
  };
  return (
    h(Shape, {}, [
        h(Shape, {
          x: 250, y: 250, draw: draw
        }, [
          h(Shape, {
            rotation: Math.PI / 4,
            draw: drawTriangle
          }),
          h(Shape, {
            x: 100,
            y: 100,
          }, [
            h(Shape, {
              draw: drawGradientArc
            })
          ]),
        ])
      ,
      h(Bitmap, {
        image: "/keroxp.png",
        width: 100,
        height:100,
      })]
    )
  )
};

const stage = app(null, null, view, canvas);
setInterval(() => {
  const ctx = canvas.getContext("2d");
  stage.render(ctx)
}, 16);