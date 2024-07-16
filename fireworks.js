// fireworks.js
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];
const particles = [];

function Firework(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.distanceToTarget = Math.sqrt(Math.pow(targetX - x, 2) + Math.pow(targetY - y, 2));
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = 3;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(targetY - y, targetX - x);
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = Math.random() * 30 + 50;
    this.targetRadius = 1;
}

Firework.prototype.update = function (index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
    } else {
        this.targetRadius = 1;
    }

    this.speed *= this.acceleration;

    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;

    this.distanceTraveled = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));

    if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.targetX, this.targetY);
        fireworks.splice(index, 1);
    } else {
        this.x += vx;
        this.y += vy;
    }
};

Firework.prototype.draw = function () {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsl(' + Math.random() * 360 + ', 100%, ' + this.brightness + '%)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.targetX, this.targetY, this.targetRadius, 0, Math.PI * 2);
    ctx.stroke();
};

function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 10 + 1;
    this.friction = 0.95;
    this.gravity = 1;
    this.hue = Math.random() * 360;
    this.brightness = Math.random() * 60 + 40;
    this.alpha = 1;
    this.decay = Math.random() * 0.03 + 0.015;
}

Particle.prototype.update = function (index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;

    this.alpha -= this.decay;

    if (this.alpha <= this.decay) {
        particles.splice(index, 1);
    }
};

Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
    ctx.stroke();
};

function createParticles(x, y) {
    let particleCount = 30;
    while (particleCount--) {
        particles.push(new Particle(x, y));
    }
}

function loop() {
    requestAnimationFrame(loop);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    let i = fireworks.length;
    while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
    }

    let j = particles.length;
    while (j--) {
        particles[j].draw();
        particles[j].update(j);
    }
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

canvas.addEventListener('click', function (e) {
    fireworks.push(new Firework(canvas.width / 2, canvas.height, e.clientX, e.clientY));
});

loop();