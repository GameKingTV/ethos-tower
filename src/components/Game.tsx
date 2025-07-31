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

    let gravity = 0.12;
    let keys: { [key: string]: boolean } = {};

    // Başlangıçta ortalanmış oyuncu
    let player = { x: canvas.width / 2 - 10, y: 500, vy: 0, width: 20, height: 20 };

    // Geniş alana yayılmış platform üretimi
    let platforms = Array.from({ length: 15 }, (_, i) => ({
      x: Math.random() * (canvas.width - 150),
      y: canvas.height - i * 80,
      width: 120,
      height: 10,
    }));

    let score = 0;

    const update = () => {
      player.vy += gravity;
      player.y += player.vy;

      if (keys['ArrowLeft']) player.x -= 5;
      if (keys['ArrowRight']) player.x += 5;

      // Sonsuz platform üretimi
      const topPlatformY = Math.min(...platforms.map(p => p.y));
      if (topPlatformY > 0) {
        platforms.push({
          x: Math.random() * (canvas.width - 150),
          y: topPlatformY - 80,
          width: 120,
          height: 10,
        });
      }

      // Platformla çarpışma (zıplama)
      for (let plat of platforms) {
        if (
          player.y + player.height < plat.y + player.vy &&
          player.y + player.height + player.vy >= plat.y &&
          player.x + player.width > plat.x &&
          player.x < plat.x + plat.width
        ) {
          player.vy = -8;
        }
      }

      // Yukarı çıktıysa platformları kaydır
      if (player.y < 300) {
        let dy = 300 - player.y;
        player.y = 300;
        platforms.forEach(p => (p.y += dy));
        score += Math.floor(dy);
      }

      // Aşağı düşerse sıfırla
      if (player.y > canvas.height) {
        player.x = canvas.width / 2 - 10;
        player.y = 500;
        player.vy = 0;
        score = 0;
        platforms = Array.from({ length: 15 }, (_, i) => ({
          x: Math.random() * (canvas.width - 150),
          y: canvas.height - i * 80,
          width: 120,
          height: 10,
        }));
      }

      // Alt platformları temizle
      platforms = platforms.filter(p => p.y < canvas.height + 50);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Oyuncu
      ctx.fillStyle = 'black';
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Platformlar
      ctx.fillStyle = 'green';
      platforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.width, p.height);
      });

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
        border: '1px solid black',
        display: 'block',
        margin: '20px auto',
        background: '#f0f0f0',
      }}
    />
  );
};

export default Game;
