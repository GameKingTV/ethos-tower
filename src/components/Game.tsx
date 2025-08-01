'use client';
import { useEffect, useRef } from 'react';

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const backgroundImg = new Image();
backgroundImg.src = '/background.png';

    if (!canvas || !ctx) return;

    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.85;


    const playerImg = new Image();
    const platformImg = new Image();
    playerImg.src = '/player.png';
    platformImg.src = '/platform.png';

    // Oyunu sadece görseller yüklendiğinde başlat
    let loadedCount = 0;
const onAssetLoad = () => {
  loadedCount++;
  if (loadedCount === 3) startGame(); // arka plan dahil
};

playerImg.onload = onAssetLoad;
platformImg.onload = onAssetLoad;
backgroundImg.onload = onAssetLoad;


    const startGame = () => {
      let player = {
      x: 100,
      y: 400,
      vy: 0,
      width: canvas.width * 0.06,
      height: canvas.width * 0.06

};

      let gravity = 0.26;
      let keys: { [key: string]: boolean } = {};
      let platforms = Array.from({ length: 10 }, (_, i) => ({
  x: Math.random() * (canvas.width - 200), // genişliğe göre ayarla
  y: canvas.height - i * 100,
  width: canvas.width * 0.30,
height: canvas.height * 0.05

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
            player.vy = -13;
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
  x: Math.random() * (canvas.width - 200),
  y: topY - 100,
  width: 200,
  height: 40
});

        }
      };

      const draw = () => {
  // Önce arka planı çiz
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  // Oyuncuyu ve platformları çiz
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  platforms.forEach(p => {
    ctx.drawImage(platformImg, p.x, p.y, p.width, p.height);
  });

  // Skoru yaz
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

 return <canvas ref={canvasRef} style={{ display: 'block', margin: '20px auto' }} />;

};

export default Game;
