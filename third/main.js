const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Определяем координаты вершин октаэдра
const vertices = [
    { x: 0, y: 0, z: 100 }, // Верхняя вершина
    { x: 100, y: 0, z: 0 }, // Передняя вершина
    { x: 0, y: 100, z: 0 }, // Правая вершина
    { x: -100, y: 0, z: 0 }, // Задняя вершина
    { x: 0, y: -100, z: 0 }, // Левая вершина
    { x: 0, y: 0, z: -100 }, // Нижняя вершина
];

const rotationAxis = { x: 1, y: 0, z: 0 }; // Ось вращения (OX)
let angle = 0;
const scaleFactor = 1; // Коэффициент масштабирования

// Функция проекции 3D-точки на 2D плоскость
function project(vertex) {
    const scale = 300 / (300 + vertex.z);
    const x = vertex.x * scale + canvas.width / 2;
    const y = -vertex.y * scale + canvas.height / 2;
    return { x, y };
}

// Функция вращения точки вокруг оси OX
function rotate(vertex, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const { x, y, z } = vertex;

    const newY = cos * y - sin * z;
    const newZ = sin * y + cos * z;

    return { x, y: newY, z: newZ };
}

// Функция масштабирования вершины
function scale(vertex, scaleFactor) {
    return {
        x: vertex.x * scaleFactor,
        y: vertex.y * scaleFactor,
        z: vertex.z * scaleFactor,
    };
}

// Функция отрисовки октаэдра
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Применяем вращение, масштабирование и проекцию к каждой вершине
    const transformedVertices = vertices.map(vertex => {
        const scaled = scale(vertex, scaleFactor);
        const rotated = rotate(scaled, angle);
        return project(rotated);
    });

    // Рисуем грани октаэдра
    ctx.strokeStyle = "black";

    // Верхняя грань
    ctx.beginPath();
    ctx.moveTo(transformedVertices[0].x, transformedVertices[0].y);
    ctx.lineTo(transformedVertices[1].x, transformedVertices[1].y);
    ctx.lineTo(transformedVertices[2].x, transformedVertices[2].y);
    ctx.closePath();
    ctx.stroke();

    // Боковые грани
    const sides = [
        [0, 1, 3],
        [0, 3, 4],
        [0, 4, 2],
        [0, 2, 1],
        [5, 1, 2],
        [5, 2, 3],
        [5, 3, 4],
        [5, 4, 1],
    ];

    sides.forEach(side => {
        ctx.beginPath();
        ctx.moveTo(
            transformedVertices[side[0]].x,
            transformedVertices[side[0]].y
        );
        ctx.lineTo(
            transformedVertices[side[1]].x,
            transformedVertices[side[1]].y
        );
        ctx.lineTo(
            transformedVertices[side[2]].x,
            transformedVertices[side[2]].y
        );
        ctx.closePath();
        ctx.stroke();
    });

    // Увеличиваем угол для анимации
    angle += 0.01;
    requestAnimationFrame(draw);
}

draw(); // Запуск анимации
