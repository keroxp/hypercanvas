import {DrawFunction, Shape} from "../src/display";
import {app, h} from "../src/h";
import {Matrix2D} from "../src/geometry";

const canvas = document.getElementById("canvas");


const view = (state, actions) => {
  const draw: DrawFunction = (self1, ctx) => {
    ctx.fillStyle = "#f00";
    ctx.rect(-50, -50, 100, 100);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0f0";
    ctx.strokeRect(-40, -40, 80, 80);
    ctx.stroke()
  };
  const drawTriangle: DrawFunction = (self1, ctx) => {
    console.log("tri")
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 2]);
    ctx.rect(-25, -25, 50, 50);
    ctx.stroke();
  };
  return (
    h(Shape, {
      x: 250, y: 250, draw: draw
    }, [
      h(Shape, {
        pivotY: -100,
        rotation: Math.PI *2,
        draw: drawTriangle
      })
    ])
  )
};

app(null, null, view, canvas);