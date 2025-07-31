'use client';
import { useEffect, useRef } from 'react';

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    canvas.width = 400;
    canvas.height = 600;

    let player = { x: 180, y: 500, vy: 0, width: 20, height: 20 };
    let gravity = 0.22;
    let keys: { [key: string]: boolean } = {};
    let platforms = Array.from({ length: 10 }, (_, i) => ({
      x: Math.random() * 350,
      y: 600 - i * 60,
      width: 100,
      height: 10,
    }));
    let score = 0;

    const update = () => {
      player.vy += gravity;
      player.y += player.vy;

      if (keys['ArrowLeft']) player.x -= 5;
      if (keys['ArrowRight']) player.x += 5;
 // En üst platformun konumunu kontrol et
const topPlatformY = Math.min(...platforms.map(p => p.y));
if (topPlatformY > 0) {
  platforms.push({
    x: Math.random() * 300,
    y: topPlatformY - 60,
    width: 100,
    height: 10,
  });
}

      // Jump
      for (let plat of platforms) {
        if (
          player.y + player.height < plat.y + player.vy &&
          player.y + player.height + player.vy >= plat.y &&
          player.x + player.width > plat.x &&
          player.x < plat.x + plat.width
        ) {
          player.vy = -3;
        }
      }

      // Scroll platforms
      if (player.y < 300) {
        let dy = 300 - player.y;
        player.y = 300;
        platforms.forEach(p => (p.y += dy));
        score += Math.floor(dy);
      }

      // Respawn if fall
      if (player.y > canvas.height) {
        player.y = 500;
        player.vy = 0;
        score = 0;
        platforms = Array.from({ length: 10 }, (_, i) => ({
          x: Math.random() * 350,
          y: 600 - i * 60,
          width: 100,
          height: 10,
        }));
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'black';
      ctx.fillRect(player.x, player.y, player.width, player.height);

      ctx.fillStyle = 'green';
      platforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.width, p.height);
      });

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

  return <canvas ref={canvasRef} style={{ border: '1px solid black', display: 'block', margin: '20px auto' }} />;
};

export default Game;
