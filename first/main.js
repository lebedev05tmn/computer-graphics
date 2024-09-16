const [color_0, color_1, color_2, color_3] = [
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = screen.width;
canvas.height = screen.height;

function createPlasmaGenerator() {
    const noise = 0.00025;

    function hslToRgb(hue, saturation, lightness) {
        lightness /= 100;
        const a = (saturation * Math.min(lightness, 1 - lightness)) / 100;
        const f = n => {
            const k = (n + hue / 30) % 12;
            const color =
                lightness - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(Math.min(255, Math.max(0, 255 * color)));
        };
        return [f(0), f(8), f(4)];
    }

    function calcPlasma(
        imageData,
        top,
        left,
        bottom,
        right,
        color_0,
        color_1,
        color_2,
        color_3
    ) {
        const width = canvas.width;

        if (left > right || top > bottom) return;

        if (left === right && top === bottom) {
            const idx = (top * width + left) * 4;
            const [right, g, bottom] = hslToRgb(
                Math.floor(color_0 * 360),
                100,
                50
            );
            imageData.data[idx] = right;
            imageData.data[idx + 1] = g;
            imageData.data[idx + 2] = bottom;
            imageData.data[idx + 3] = 255;
            return;
        }

        const midX = Math.floor(left + (right - left) / 2);
        const midY = Math.floor(top + (bottom - top) / 2);
        const topColor = (color_0 + color_1) / 2;
        const leftColor = (color_0 + color_2) / 2;
        const bottomColor = (color_2 + color_3) / 2;
        const rightColor = (color_1 + color_3) / 2;
        const centerColor =
            (color_0 + color_1 + color_2 + color_3) / 4 +
            Math.sqrt((right - left) ** 2 + (bottom - top) ** 2) * noise;

        calcPlasma(
            imageData,
            top,
            left,
            midY,
            midX,
            color_0,
            topColor,
            leftColor,
            centerColor
        );
        calcPlasma(
            imageData,
            top,
            midX + 1,
            midY,
            right,
            topColor,
            color_1,
            centerColor,
            rightColor
        );
        calcPlasma(
            imageData,
            midY + 1,
            left,
            bottom,
            midX,
            leftColor,
            centerColor,
            color_2,
            bottomColor
        );
        calcPlasma(
            imageData,
            midY + 1,
            midX + 1,
            bottom,
            right,
            centerColor,
            rightColor,
            bottomColor,
            color_3
        );
    }

    function drawPlasma() {
        const width = canvas.width;
        const height = canvas.height;

        const imageData = ctx.getImageData(0, 0, width, height);

        calcPlasma(
            imageData,
            0,
            0,
            height - 1,
            width - 1,
            color_0,
            color_1,
            color_2,
            color_3
        );
        ctx.putImageData(imageData, 0, 0);
    }

    drawPlasma();
}

document.addEventListener("DOMContentLoaded", () => {
    createPlasmaGenerator();
});

document.addEventListener("click", () => {
    canvas.width = canvas.width * 1.2;
    canvas.height = canvas.height * 1.2;

    createPlasmaGenerator();
});
