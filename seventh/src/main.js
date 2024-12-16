import "./style.css";

const app = document.querySelector("#app");

app.classList.add("container");

const IMG_WIDTH = 200;
const IMG_HEIGHT = 292;

const TASK_VARIANT = 10;

const variantRatio = new String(TASK_VARIANT)
  .split("")
  .reduce((a, b) => Number(a) + Number(b));

const variantArray = [
  variantRatio * 0,
  variantRatio * 1,
  variantRatio * 3,
  variantRatio * 5,
];

const createCanvas = () => {
  const canvas = document.createElement("canvas");
  canvas.width = IMG_HEIGHT * 1.25;
  canvas.height = IMG_HEIGHT * 1.25;
  canvas.classList.add("canvas");

  return canvas;
};

const image = document.createElement("img");
image.src = "image.bmp";
image.width = IMG_WIDTH;
image.height = IMG_HEIGHT;

image.onload = function () {
  variantArray.forEach((ratio) => {
    const canvas = createCanvas();
    const ctx = canvas.getContext("2d");

    app.insertAdjacentElement("beforeend", canvas);

    const angle = (ratio * Math.PI) / 180;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();

    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      ratio ? `Поворот: ${ratio} градусов` : "Оригинал",
      canvas.width / 2,
      canvas.height - 20
    );

    ctx.fillText("Кастомный поворот", canvas.width / 2, 20);
  });

  variantArray.forEach((ratio) => {
    const canvas = createCanvas();
    const ctx = canvas.getContext("2d");

    app.insertAdjacentElement("beforeend", canvas);

    const angle = (ratio * Math.PI) / 180;
    const width = image.width;
    const height = image.height;

    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const newWidth = Math.round(
      Math.abs(width * Math.cos(angle)) + Math.abs(height * Math.sin(angle))
    );
    const newHeight = Math.round(
      Math.abs(width * Math.sin(angle)) + Math.abs(height * Math.cos(angle))
    );
    const newImageData = ctx.createImageData(newWidth, newHeight);
    const newData = newImageData.data;

    const centerX = width / 2;
    const centerY = height / 2;

    const newCenterX = newWidth / 2;
    const newCenterY = newHeight / 2;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;
        const r = data[pixelIndex];
        const g = data[pixelIndex + 1];
        const b = data[pixelIndex + 2];
        const a = data[pixelIndex + 3];

        const newX = Math.round(
          (x - centerX) * Math.cos(angle) -
            (y - centerY) * Math.sin(angle) +
            newCenterX
        );
        const newY = Math.round(
          (x - centerX) * Math.sin(angle) +
            (y - centerY) * Math.cos(angle) +
            newCenterY
        );

        if (newX >= 0 && newX < newWidth && newY >= 0 && newY < newHeight) {
          const newPixelIndex = (newY * newWidth + newX) * 4;
          newData[newPixelIndex] = r;
          newData[newPixelIndex + 1] = g;
          newData[newPixelIndex + 1] = b;
          newData[newPixelIndex + 3] = a;
        }
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.putImageData(
      newImageData,
      (canvas.width - newWidth) / 2,
      (canvas.height - newHeight) / 2
    );

    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      ratio ? `Поворот: ${ratio} градусов` : "Оригинал",
      canvas.width / 2,
      canvas.height - 20
    );

    ctx.fillText("Аффинное преобразование (поворот)", canvas.width / 2, 20);
  });
};
