const canvas1 = document.getElementById("canvas1");
const canvas2 = document.getElementById("canvas2");
const canvas3 = document.getElementById("canvas3");
const canvas4 = document.getElementById("canvas4");

const canvases = [canvas1, canvas2, canvas3, canvas4];
const contexts = canvases.map(canvas => canvas.getContext("2d"));

const baseN = 14; 
const period = 2 * Math.PI; // Период гармонического колебания
const amplitude = 1; // Амплитуда колебания
const steps = 100; // Точность для отрисовки кривой

// Функция гармонического колебания
function harmonicFunction(t) {
    return Math.sin(t);
}

// Генерация точек
function generatePoints(N) {
    const points = [];
    const step = period / N;
    for (let i = 0; i <= N; i++) {
        const t = i * step;
        const x = (t / period) * canvas1.width;
        const y =
            canvas1.height / 2 -
            harmonicFunction(t) * (canvas1.height / 2 - 20);
        points.push({ x, y });
    }
    return points;
}

// Алгоритм Де Кастельжо для кривой Безье
function calculateBezier(points, t) {
    let tempPoints = [...points];
    while (tempPoints.length > 1) {
        const nextPoints = [];
        for (let i = 0; i < tempPoints.length - 1; i++) {
            const x = (1 - t) * tempPoints[i].x + t * tempPoints[i + 1].x;
            const y = (1 - t) * tempPoints[i].y + t * tempPoints[i + 1].y;
            nextPoints.push({ x, y });
        }
        tempPoints = nextPoints;
    }
    return tempPoints[0];
}

// Генерация кривой Безье
function bezierCurve(points, steps = 100) {
    const curve = [];
    for (let t = 0; t <= 1; t += 1 / steps) {
        curve.push(calculateBezier(points, t));
    }
    return curve;
}

// Расчет ошибки
function calculateError(original, bezier) {
    let error = 0;
    original.forEach((point, index) => {
        const closest = bezier.reduce((min, cur) =>
            Math.abs(cur.x - point.x) < Math.abs(min.x - point.x) ? cur : min
        );
        error += Math.abs(point.y - closest.y);
    });
    return error / original.length;
}

// Отрисовка гармонической функции
function drawHarmonic(ctx, color = "blue") {
    ctx.beginPath();
    for (let t = 0; t <= period; t += period / steps) {
        const x = (t / period) * canvas1.width;
        const y =
            canvas1.height / 2 -
            harmonicFunction(t) * (canvas1.height / 2 - 20);
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Отрисовка кривой Безье
function drawBezier(ctx, curve, color = "red") {
    ctx.beginPath();
    ctx.moveTo(curve[0].x, curve[0].y);
    curve.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Отрисовка точек
function drawPoints(ctx, points, color = "black") {
    points.forEach(({ x, y }) => {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    });
}

// Основная функция
function main() {
    const scenarios = [
        { N: baseN, canvas: canvas1, label: `N = ${baseN}` },
        {
            N: Math.floor(baseN / 2),
            canvas: canvas2,
            label: `N = ${Math.floor(baseN / 2)}`,
        },
        { N: baseN * 2, canvas: canvas3, label: `N = ${baseN * 2}` },
        {
            N: baseN,
            canvas: canvas4,
            label: `Ошибка восстановления (N = ${baseN})`,
        },
    ];

    scenarios.forEach(({ N, canvas, label }, i) => {
        const ctx = contexts[i];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "16px Arial";
        ctx.fillText(label, 10, 20);

        // Гармоническое колебание
        drawHarmonic(ctx);

        // Опорные точки
        const points = generatePoints(N);
        drawPoints(ctx, points);

        // Кривая Безье
        const bezier = bezierCurve(points);
        drawBezier(ctx, bezier, "red");

        // Ошибка
        if (i === scenarios.length - 1) {
            const error = calculateError(points, bezier);
            ctx.fillText(`Ошибка: ${error.toFixed(5)}`, 10, 40);
        }
    });
}

main();
