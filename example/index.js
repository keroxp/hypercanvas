import { Shape } from "../src/display";
import { app, h } from "../src/h";
const canvas = document.getElementById("canvas");
const view = (state, actions) => {
    const draw = (self1, ctx) => {
        ctx.fillStyle = "#f00";
        ctx.rect(-50, -50, 100, 100);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#0f0";
        ctx.strokeRect(-40, -40, 80, 80);
        ctx.stroke();
    };
    return h(Shape, { x: 100, y: 100, draw: draw }, []);
};
app(null, null, view, canvas);
