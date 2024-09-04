const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 512;

// Функция генерации случайного числа
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Функция генерации цвета
function getColor(cornerColors, iteration) {
  const r = getRandomNumber(-0.1 * iteration, 0.1 * iteration);
  const red =
    (cornerColors[0].r +
      cornerColors[1].r +
      cornerColors[2].r +
      cornerColors[3].r +
      r) /
    4;
  const green =
    (cornerColors[0].g +
      cornerColors[1].g +
      cornerColors[2].g +
      cornerColors[3].g +
      r) /
    4;
  const blue =
    (cornerColors[0].b +
      cornerColors[1].b +
      cornerColors[2].b +
      cornerColors[3].b +
      r) /
    4;
  return `rgb(${red}, ${green}, ${blue})`;
}

// Функция рисования фрактала
function getEdgeColor(cornerColor1, cornerColor2, iteration) {
  const r = getRandomNumber(-0.1 * iteration, 0.1 * iteration);
  const red = (cornerColor1.r + cornerColor2.r + r) / 2;
  const green = (cornerColor1.g + cornerColor2.g + r) / 2;
  const blue = (cornerColor1.b + cornerColor2.b + r) / 2;
  return `rgb(${red}, ${green}, ${blue})`;
}

// Функция рисования фрактала
function drawFractal(x, y, size, iteration, cornerColors) {
  if (size < 2) return;

  // Рисование центрального пиксел
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const midCornerColors = [
    {
      r: (cornerColors[0].r + cornerColors[1].r) / 2,
      g: (cornerColors[0].g + cornerColors[1].g) / 2,
      b: (cornerColors[0].b + cornerColors[1].b) / 2,
    },
    {
      r: (cornerColors[1].r + cornerColors[2].r) / 2,
      g: (cornerColors[1].g + cornerColors[2].g) / 2,
      b: (cornerColors[1].b + cornerColors[2].b) / 2,
    },
    {
      r: (cornerColors[2].r + cornerColors[3].r) / 2,
      g: (cornerColors[2].g + cornerColors[3].g) / 2,
      b: (cornerColors[2].b + cornerColors[3].b) / 2,
    },
    {
      r: (cornerColors[3].r + cornerColors[0].r) / 2,
      g: (cornerColors[3].g + cornerColors[0].g) / 2,
      b: (cornerColors[3].b + cornerColors[0].b) / 2,
    },
  ];

  const color = getColor(midCornerColors, iteration);
  ctx.fillStyle = color;
  ctx.fillRect(centerX, centerY, 1, 1);

  // Рисование средних пикселей ребер
  const edgeColors = [
    getEdgeColor(cornerColors[0], cornerColors[1], iteration),
    getEdgeColor(cornerColors[1], cornerColors[2], iteration),
    getEdgeColor(cornerColors[2], cornerColors[3], iteration),
    getEdgeColor(cornerColors[3], cornerColors[0], iteration),
  ];

  ctx.fillStyle = edgeColors[0];
  ctx.fillRect(x + size / 4, y, 1, size);
  ctx.fillStyle = edgeColors[1];
  ctx.fillRect(x + size - 1, y + size / 4, 1, size);
  ctx.fillStyle = edgeColors[2];
  ctx.fillRect(x + size / 4, y + size - 1, 1, size);
  ctx.fillStyle = edgeColors[3];
  ctx.fillRect(x, y + size / 4, 1, size);

  // Рекурсивно вызываем функцию для каждого из четырех квадратов
  const newSize = size / 2;
  drawFractal(x, y, newSize, iteration + 1, [
    cornerColors[0],
    midCornerColors[0],
    midCornerColors[3],
    cornerColors[3],
  ]);
  drawFractal(x + newSize, y, newSize, iteration + 1, [
    midCornerColors[0],
    cornerColors[1],
    midCornerColors[1],
    midCornerColors[3],
  ]);
  drawFractal(x + newSize, y + newSize, newSize, iteration + 1, [
    midCornerColors[3],
    midCornerColors[1],
    cornerColors[2],
    midCornerColors[2],
  ]);
  drawFractal(x, y + newSize, newSize, iteration + 1, [
    cornerColors[3],
    midCornerColors[3],
    midCornerColors[2],
    cornerColors[0],
  ]);
}

// Начало рисования фрактала
const initialCornerColors = [
  { r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 },
  { r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 },
  { r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 },
  { r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 },
];

// const initialCornerColors = [
//   { r: 0, g: 0, b: 255 },
//   { r: 0, g: 255, b: 0 },
//   { r: 255, g: 0, b: 0 },
//   { r: 0, g: 255, b: 255 },
// ];

drawFractal(0, 0, canvas.width, 0, initialCornerColors);

// class PlasmaGenerator {
//   constructor(canvasId) {
//     this.canvas = document.getElementById(canvasId);
//     this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
//     this.noise = 0.00025;
//     this.timeout = 0;

//     window.addEventListener("resize", () => this.handleSizeChange());

//     this.initState();
//     this.resize();
//     this.drawPlasma();
//   }

//   initState() {
//     this.c0 = Math.random();
//     this.c1 = Math.random();
//     this.c2 = Math.random();
//     this.c3 = Math.random();
//   }

//   resize() {
//     const x = window.innerWidth;
//     const y = window.innerHeight;
//     this.canvas.width = x;
//     this.canvas.height = y;
//   }

//   handleSizeChange() {
//     this.resize();
//     if (this.timeout) clearTimeout(this.timeout);
//     this.timeout = setTimeout(() => this.drawPlasma(), 250);
//   }

//   drawPlasma() {
//     this.timeout = 0;
//     const x = this.canvas.width;
//     const y = this.canvas.height;

//     this.imageData = this.ctx.getImageData(0, 0, x, y);
//     this.calcPlasma(0, 0, y - 1, x - 1, this.c0, this.c1, this.c2, this.c3);
//     this.ctx.putImageData(this.imageData, 0, 0);
//   }

//   calcPlasma(t, l, b, r, c0, c1, c2, c3) {
//     if (l > r || t > b) return;

//     if (l == r && t == b) {
//       const idx = (t * this.canvas.width + l) * 4;
//       const [r, g, b] = this.hslToRgb(Math.floor(c0 * 360), 100, 50);
//       this.imageData.data[idx] = r;
//       this.imageData.data[idx + 1] = g;
//       this.imageData.data[idx + 2] = b;
//       this.imageData.data[idx + 3] = 255;
//       return;
//     }
//     const mx = this.midI(l, r);
//     const my = this.midI(t, b);
//     const tc = this.mid(c0, c1);
//     const lc = this.mid(c0, c2);
//     const bc = this.mid(c2, c3);
//     const rc = this.mid(c1, c3);
//     const cc = this.centerClr(
//       c0,
//       c1,
//       c2,
//       c3,
//       Math.sqrt((r - l) ** 2 + (b - t) ** 2)
//     );

//     this.calcPlasma(t, l, my, mx, c0, tc, lc, cc);
//     this.calcPlasma(t, mx + 1, my, r, tc, c1, cc, rc);
//     this.calcPlasma(my + 1, l, b, mx, lc, cc, c2, bc);
//     this.calcPlasma(my + 1, mx + 1, b, r, cc, rc, bc, c3);
//   }

//   mid(a, b) {
//     return a + (b - a) / 2;
//   }

//   midI(a, b) {
//     return Math.floor(a + (b - a) / 2);
//   }

//   centerClr(c0, c1, c2, c3, dist) {
//     return (c0 + c1 + c2 + c3) / 4 + dist * this.noise;
//   }

//   bound(f) {
//     return Math.round(Math.min(255, Math.max(0, f)));
//   }

//   hslToRgb(h, s, l) {
//     l /= 100;
//     const a = (s * Math.min(l, 1 - l)) / 100;
//     const f = (n) => {
//       const k = (n + h / 30) % 12;
//       const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
//       return this.bound(255 * color);
//     };
//     return [f(0), f(8), f(4)];
//   }
// }

// document.addEventListener("DOMContentLoaded", () => {
//   const p = new PlasmaGenerator("canvas");
// });
