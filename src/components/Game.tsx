'use client';
import { useEffect, useRef } from 'react';

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    canvas.width = 1200;
    canvas.height = 800;

    let player = { x: 600, y: 500, vy: 0, width: 50, height: 50 };
    let gravity = 0.2;
    let keys: { [key: string]: boolean } = {};
    let score = 0;

    let platforms = Array.from({ length: 10 }, (_, i) => ({
      x: Math.random() * (canvas.width - 120),
      y: 800 - i * 80,
      width: 120,
      height: 20,
    }));

    const playerImg = new Image();
    playerImg.src = '/player.png';

    const platformImg = new Image();
    platformImg.src = '/platform.png';

    const update = () => {
      player.vy += gravity;
      player.y += player.vy;

      if (keys['ArrowLeft']) player.x -= 5;
      if (keys['ArrowRight']) player.x += 5;

      // Yeni platform üret
      const topY = Math.min(...platforms.map(p => p.y));
      if (topY > 0) {
        platforms.push({
          x: Math.random() * (canvas.width - 120),
          y: topY - 80,
          width: 120,
          height: 20,
        });
      }

      // Zıplama kontrolü
      for (let plat of platforms) {
        if (
          player.y + player.height < plat.y + player.vy &&
          player.y + player.height + player.vy >= plat.y &&
          player.x + player.width > plat.x &&
          player.x < plat.x + plat.width
        ) {
          player.vy = -9;
        }
      }

      // Ekranı yukarı kaydır
      if (player.y < 300) {
        const dy = 300 - player.y;
        player.y = 300;
        platforms.forEach(p => (p.y += dy));
        score += Math.floor(dy);
      }

      // Düşerse resetle
      if (player.y > canvas.height) {
        player = { x: 600, y: 500, vy: 0, width: 50, height: 50 };
        score = 0;
        platforms = Array.from({ length: 10 }, (_, i) => ({
          x: Math.random() * (canvas.width - 120),
          y: 800 - i * 80,
          width: 120,
          height: 20,
        }));
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Platformlar
      platforms.forEach(p => {
        if (platformImg.complete) {
          ctx.drawImage(platformImg, p.x, p.y, p.width, p.height);
        } else {
          ctx.fillStyle = 'green';
          ctx.fillRect(p.x, p.y, p.width, p.height);
        }
      });

      // Karakter
      if (playerImg.complete) {
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
      } else {
        ctx.fillStyle = 'black';
        ctx.fillRect(player.x, player.y, player.width, player.height);
      }

      // Skor
      ctx.fillStyle = 'blue';
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${score}`, 10, 30);
    };

    const loop = () => {
      update();
      draw();
      requestAnimationFrame(loop);
    };

    loop();

    const down = (e: KeyboardEvent) => (keys[e.key] = true);
    const up = (e: KeyboardEvent) => (keys[e.key] = false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        border: '2px solid #444',
        display: 'block',
        margin: '20px auto',
        background: '#f0f0f0',
      }}
    />
  );
};

export default Game;
