document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ С ЗАДЕРЖКОЙ ---
    const animatedElements = document.querySelectorAll('.animate-fade, .animate-pop, .animate-scale, .animate-up');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${0.2 + index * 0.12}s`;
    });

    // --- 2. ЭФФЕКТ ПАРАЛЛАКСА ПРИ ДВИЖЕНИИ МЫШИ / НАКЛОНЕ ---
    const card = document.querySelector('.card-container');
    
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 35;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 35;
        card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    // Сброс положения карточки
    document.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });

    // --- 3. АНИМАЦИЯ ЗОЛОТЫХ ЧАСТИЦ (CANVAS) ---
    const canvas = document.getElementById('particlesCanvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height + height;
            this.size = Math.random() * 3 + 1;
            this.speedY = Math.random() * 0.8 + 0.3;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.opacity = Math.random() * 0.6 + 0.2;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            if (this.y < -10) {
                this.reset();
                this.y = height + 10;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(197, 155, 39, ${this.opacity})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(230, 202, 101, 0.8)';
            ctx.fill();
        }
    }

    const particles = Array.from({ length: 45 }, () => new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // --- 4. ИНТЕРАКТИВНОЕ КОНФЕТТИ И РЕАКЦИЯ НА КНОПКУ ---
    const btn = document.getElementById('confirmBtn');

    btn.addEventListener('click', () => {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = 'scale(1)', 150);

        // Запуск салюта из блёсток
        createConfettiBurst();

        btn.innerHTML = '<span>Rahmat! Sizni kutamiz! ✨</span>';
        btn.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
    });

    function createConfettiBurst() {
        const colors = ['#C59B27', '#E6CA65', '#5C3A21', '#FBF0D9'];
        for (let i = 0; i < 70; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = '50%';
            confetti.style.top = '60%';
            confetti.style.width = `${Math.random() * 8 + 4}px`;
            confetti.style.height = `${Math.random() * 8 + 4}px`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '999';

            document.body.appendChild(confetti);

            const destinationX = (Math.random() - 0.5) * window.innerWidth * 0.8;
            const destinationY = (Math.random() - 0.8) * window.innerHeight * 0.6;

            const animation = confetti.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${destinationX}px, ${destinationY}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1200 + Math.random() * 600,
                easing: 'cubic-bezier(0.1, 1, 0.1, 1)'
            });

            animation.onfinish = () => confetti.remove();
        }
    }
});