const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
let animationId;
let targetA, targetB, n;
let currentA, currentB;
let speed;

function drawJulia(a, b, n) {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let zx = (x - width / 2) / (width / 4);
            let zy = (y - height / 2) / (height / 4);

            let i = 0;
            const max_iterations = 100;

            while (zx * zx + zy * zy < 4 && i < max_iterations) {
                const r = Math.sqrt(zx * zx + zy * zy);
                const theta = Math.atan2(zy, zx);
                zx = Math.pow(r, n) * Math.cos(n * theta) + a;
                zy = Math.pow(r, n) * Math.sin(n * theta) + b;
                i++;
            }

            const index = (x + y * width) * 4;
            const t = i / max_iterations;
            
            imageData.data[index] = Math.floor(9 * (1 - t) * t * t * t * 255);
            imageData.data[index + 1] = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255);
            imageData.data[index + 2] = Math.floor(8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255);
            imageData.data[index + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function startAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    targetA = parseFloat(document.getElementById('param1').value);
    targetB = parseFloat(document.getElementById('param2').value);
    n = parseFloat(document.getElementById('param3').value);
    speed = parseFloat(document.getElementById('speed').value);

    currentA = targetA;
    currentB = targetB;

    function animate() {
        // 実部と虚部を0に向かって変化させる
        currentA += (0 - currentA) * speed;
        currentB += (0 - currentB) * speed;

        drawJulia(currentA, currentB, n);
        animationId = requestAnimationFrame(animate);

        // パラメータが十分0に近づいたら、新しい初期値を設定
        if (Math.abs(currentA) < 0.01 && Math.abs(currentB) < 0.01) {
            currentA = targetA = -2 + Math.random() * 4;
            currentB = targetB = -2 + Math.random() * 4;
        }
    }

    animate();
}

function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}