const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Определяем координаты вершин треугольной призмы
const vertices = [
    { x: -50, y: -50, z: -50 },
    { x: 50, y: -50, z: -50 },
    { x: 0, y: 50, z: -50 },
    { x: -50, y: -50, z: 50 },
    { x: 50, y: -50, z: 50 },
    { x: 0, y: 50, z: 50 },
];

const rotationAxis = { x: 1, y: 1, z: 0 }; // Ось вращения
let angle = 0;

function project(vertex) {
    // Проекция на 2D плоскость
    const scale = 200 / (200 + vertex.z);
    const x = vertex.x * scale + canvas.width / 2;
    const y = -vertex.y * scale + canvas.height / 2;
    return { x, y };
}

function rotate(vertex, angle) {
    // Вращение вокруг произвольной оси
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const { x, y, z } = vertex;

    // Применяем матрицы вращения
    const newX =
        (cos + (1 - cos) * rotationAxis.x * rotationAxis.x) * x +
        ((1 - cos) * rotationAxis.x * rotationAxis.y - rotationAxis.z * sin) *
            y +
        ((1 - cos) * rotationAxis.x * rotationAxis.z + rotationAxis.y * sin) *
            z;

    const newY =
        ((1 - cos) * rotationAxis.y * rotationAxis.x + rotationAxis.z * sin) *
            x +
        (cos + (1 - cos) * rotationAxis.y * rotationAxis.y) * y +
        ((1 - cos) * rotationAxis.y * rotationAxis.z - rotationAxis.x * sin) *
            z;

    const newZ =
        ((1 - cos) * rotationAxis.z * rotationAxis.x - rotationAxis.y * sin) *
            x +
        ((1 - cos) * rotationAxis.z * rotationAxis.y + rotationAxis.x * sin) *
            y +
        (cos + (1 - cos) * rotationAxis.z * rotationAxis.z) * z;

    return { x: newX, y: newY, z: newZ };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Применяем вращение и проекцию к каждой вершине
    const projectedVertices = vertices.map(vertex => {
        const rotated = rotate(vertex, angle);
        return project(rotated);
    });

    // Рисуем контуры призмы
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
        ctx.moveTo(projectedVertices[i].x, projectedVertices[i].y);
        ctx.lineTo(
            projectedVertices[(i + 1) % 3].x,
            projectedVertices[(i + 1) % 3].y
        );
        ctx.moveTo(projectedVertices[i + 3].x, projectedVertices[i + 3].y);
        ctx.lineTo(
            projectedVertices[((i + 1) % 3) + 3].x,
            projectedVertices[((i + 1) % 3) + 3].y
        );
    }
    for (let i = 0; i < 3; i++) {
        ctx.moveTo(projectedVertices[i].x, projectedVertices[i].y);
        ctx.lineTo(projectedVertices[i + 3].x, projectedVertices[i + 3].y);
    }
    ctx.strokeStyle = "black";
    ctx.stroke();

    angle += 0.01; // Увеличиваем угол для анимации
    requestAnimationFrame(draw);
}

draw(); // Запуск анимации
