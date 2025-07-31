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

    const playerImg = new Image();
    const platformImg = new Image();
    playerImg.src = '/player.png';
    platformImg.src = '/platform.png';

    // Oyunu sadece görseller yüklendiğinde başlat
    let loadedCount = 0;
    const onAssetLoad = () => {
      loadedCount++;
      if (loadedCount === 2) startGame(); // her iki görsel yüklendiğinde başlat
    };

    playerImg.onload = onAssetLoad;
    platformImg.onload = onAssetLoad;

    const startGame = () => {
      let player = { x: 100, y: 400, vy: 0, width: 60, height: 60 };
      let gravity = 0.3;
      let keys: { [key: string]: boolean } = {};
      let platforms = Array.from({ length: 10 }, (_, i) => ({
        x: Math.random() * 1000,
        y: 800 - i * 80,
        width: 150,
        height: 30,
      }));
      let score = 0;

      const update = () => {
        player.vy += gravity;
        player.y += player.vy;

        if (keys['ArrowLeft']) player.x -= 5;
        if (keys['ArrowRight']) player.x += 5;

        for (let plat of platforms) {
          if (
            player.y + player.height < plat.y + player.vy &&
            player.y + player.height + player.vy >= plat.y &&
            player.x + player.width > plat.x &&
            player.x < plat.x + plat.width
          ) {
            player.vy = -10;
          }
        }

        if (player.y < 300) {
          const dy = 300 - player.y;
          player.y = 300;
          platforms.forEach(p => (p.y += dy));
          score += Math.floor(dy);
        }

        if (player.y > canvas.height) {
          player.y = 400;
          player.vy = 0;
          score = 0;
          platforms = Array.from({ length: 10 }, (_, i) => ({
            x: Math.random() * 1000,
            y: 800 - i * 80,
            width: 150,
            height: 30,
          }));
        }

        const topY = Math.min(...platforms.map(p => p.y));
        if (topY > 0) {
          platforms.push({
            x: Math.random() * 1000,
            y: topY - 80,
            width: 150,
            height: 30,
          });
        }
      };

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

        platforms.forEach(p => {
          ctx.drawImage(platformImg, p.x, p.y, p.width, p.height);
        });

        ctx.fillStyle = 'blue';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 20, 30);
      };

      const loop = () => {
        update();
        draw();
        requestAnimationFrame(loop);
      };

      loop();

      window.addEventListener('keydown', e => (keys[e.key] = true));
      window.addEventListener('keyup', e => (keys[e.key] = false));
    };
  }, []);

  return <canvas ref={canvasRef} style={{ background: '#eee', border: '1px solid black', display: 'block', margin: '20px auto' }} />;
};

export default Game;
