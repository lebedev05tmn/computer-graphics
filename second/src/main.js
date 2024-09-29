const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Исходные координаты треугольника
const triangle = [
    [-50, 0],
    [0, 50],
    [50, 0],
];

// Функция для умножения матрицы 3x3 на вектор 3x1
function multiplyMatrixAndVector(matrix, vector) {
    const [x, y] = vector;
    return [
        matrix[0][0] * x + matrix[0][1] * y + matrix[0][2],
        matrix[1][0] * x + matrix[1][1] * y + matrix[1][2],
        1,
    ];
}

// Функция для создания матрицы масштабирования
function scaleMatrix(sx, sy) {
    return [
        [sx, 0, 0],
        [0, sy, 0],
        [0, 0, 1],
    ];
}

// Функция для создания матрицы поворота
function rotationMatrix(theta) {
    return [
        [Math.cos(theta), -Math.sin(theta), 0],
        [Math.sin(theta), Math.cos(theta), 0],
        [0, 0, 1],
    ];
}

// Функция для комбинирования двух матриц
function multiplyMatrices(a, b) {
    const result = [];
    for (let i = 0; i < 3; i++) {
        result[i] = [];
        for (let j = 0; j < 3; j++) {
            result[i][j] =
                a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j];
        }
    }
    return result;
}

// Функция для рисования треугольника с применением матрицы преобразования
function drawTriangle(matrix) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Перемещение в центр канваса
    ctx.translate(canvas.width / 2, canvas.height / 2);

    ctx.beginPath();
    triangle.forEach(vertex => {
        const transformed = multiplyMatrixAndVector(matrix, [
            vertex[0],
            vertex[1],
            1,
        ]);
        if (vertex === triangle[0]) {
            ctx.moveTo(transformed[0], transformed[1]);
        } else {
            ctx.lineTo(transformed[0], transformed[1]);
        }
    });
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.restore();
}

let scaleX = 1;
let scaleY = 1;
let phase = 0;

function animate() {
    phase += 0.02;

    // Поворот на 45 градусов для обеспечения несоответствия осям
    const rotationAngle = Math.PI / 4;

    // Создание матрицы преобразования
    let transformationMatrix = rotationMatrix(rotationAngle);

    // Масштабирование
    if (phase < Math.PI / 2) {
        scaleX = 1 + Math.sin(phase) * 0.5; // Масштабируем вдоль одного катета
        scaleY = 1;
    } else if (phase < Math.PI) {
        scaleY = 1 + Math.sin(phase - Math.PI / 2) * 0.5; // Масштабируем вдоль гипотенузы
        scaleX = 1;
    } else {
        phase = 0; // Сброс фазы
    }

    // Применяем масштабирование
    const scaleMatrixX = scaleMatrix(scaleX, scaleY);
    transformationMatrix = multiplyMatrices(scaleMatrixX, transformationMatrix);

    // Рисуем треугольник с применением преобразований
    drawTriangle(transformationMatrix);
    requestAnimationFrame(animate);
}

animate();
