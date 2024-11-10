const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");
const pointsTable = document.getElementById("pointsTable");
let points = [];
let N = 4 + 10;

// Функция для генерации гармонических колебаний
function generateHarmonicOscillations(numPoints) {
    points = [];

    // Случайная амплитуда и частота для обновления колебаний
    const amplitude = 80 + Math.random() * 40; // От 80 до 120
    const frequency = 0.05 + Math.random() * 0.1; // От 0.05 до 0.15

    console.log("Amplitude:", amplitude, "Frequency:", frequency); // Проверка значений

    for (let i = 0; i < numPoints; i++) {
        const x = (canvas.width / numPoints) * i;
        const y = canvas.height / 2 + amplitude * Math.sin(frequency * x);
        points.push({ x, y });
    }
    updatePointsTable();
}

// Обновление таблицы с координатами точек
function updatePointsTable() {
    pointsTable.innerHTML = "<tr><th>X</th><th>Y</th></tr>";
    points.forEach(point => {
        const row = pointsTable.insertRow();
        const cellX = row.insertCell(0);
        const cellY = row.insertCell(1);
        cellX.textContent = point.x.toFixed(2);
        cellY.textContent = point.y.toFixed(2);
    });
}

// Отрисовка точек
function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищение холста
    ctx.beginPath();
    points.forEach(point => {
        ctx.lineTo(point.x, point.y);
    });
    ctx.strokeStyle = "blue";
    ctx.stroke();
}

// Построение кривой Catmull-Rom
function drawCatmullRomCurve(points) {
    ctx.beginPath();
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i === 0 ? i : i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
        for (let t = 0; t < 1; t += 0.02) {
            const x =
                0.5 *
                (2 * p1.x +
                    (-p0.x + p2.x) * t +
                    (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t * t +
                    (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t * t * t);
            const y =
                0.5 *
                (2 * p1.y +
                    (-p0.y + p2.y) * t +
                    (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t * t +
                    (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t * t * t);
            ctx.lineTo(x, y);
        }
    }
    ctx.strokeStyle = "red";
    ctx.stroke();
}

// Функция для отрисовки гармонических колебаний и точек
function drawHarmonicOscillations() {
    generateHarmonicOscillations(N);
    drawPoints();
}

// Отрисовка кривой Catmull-Rom
function drawCatmullRom() {
    generateHarmonicOscillations(N); // Генерация новых точек перед построением кривой
    drawPoints();
    drawCatmullRomCurve(points);
}

// Функция для отрисовки кривой Catmull-Rom на основе полинома

function lagrangeInterpolate(x, points) {
    let y = 0;
    for (let i = 0; i < points.length; i++) {
        let term = points[i].y;
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                term *= (x - points[j].x) / (points[i].x - points[j].x);
            }
        }
        y += term;
    }
    return y;
}

// Функция для отрисовки кривой на основе полинома Лагранжа
function drawPolynomialLagrangeCurve(points) {
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 1) {
        const y = lagrangeInterpolate(x, points);
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.strokeStyle = "green"; // Цвет, чтобы отличить от кривой Catmull-Rom
    ctx.stroke();
}

// Функция для отрисовки кривой Catmull-Rom на основе полинома Лагранжа
function drawPolynomialCatmullRom() {
    generateHarmonicOscillations(N); // Генерация новых точек перед построением полинома
    drawPoints();
    drawPolynomialLagrangeCurve(points);
    console.log("Построение Catmull-Rom на основе полинома Лагранжа");
}

// Запуск начального отрисовки
drawHarmonicOscillations();
