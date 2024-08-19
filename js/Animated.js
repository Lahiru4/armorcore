let canvas = document.getElementById("canvas1");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 88) * (canvas.width / 88)
};

window.addEventListener("mousemove", function (evt) {
    mouse.x = evt.x;
    mouse.y = evt.y;
});

// Resize the canvas as the window resizes
window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = (canvas.height / 88) * (canvas.width / 88);
    init(); // Reinitialize particles on resize
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Reverse direction when hitting canvas borders
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Check collision detection - mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10;
            }
        }

        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;

        // Draw particle
        this.draw();
    }
}

// Create particle array
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * (innerWidth - size * 2)) + size;
        let y = (Math.random() * (innerHeight - size * 2)) + size;
        let directionX = (Math.random() * 2) - 1;
        let directionY = (Math.random() * 2) - 1;
        let color = "#8c5523";

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = 0; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x-particlesArray[b].x))*(particlesArray[a].x - particlesArray[b].x)+((particlesArray[a].y - particlesArray[b].y))*(particlesArray[a].y - particlesArray[b].y);
            if (distance < (canvas.width/7)*(canvas.height/7)){
                ctx.strokeStyle='rgba(140,85,31,1)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x,particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x,particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}
window.addEventListener('resize',
    function () {
        canvas.width=innerWidth;
        canvas.height=innerHeight;
        mouse.radius = ((canvas.height/80)*(canvas.height/80));
    })


init();
animate();
