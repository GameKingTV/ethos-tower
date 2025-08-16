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

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const playerImg = new Image();
    const platformImg = new Image();
    playerImg.src = '/player.png';
    platformImg.src = '/platform.png';

    let loadedCount = 0;
    const onAssetLoad = () => {
      loadedCount++;
      if (loadedCount === 3) startGame();
    };

    playerImg.onload = onAssetLoad;
    platformImg.onload = onAssetLoad;
    backgroundImg.onload = onAssetLoad;

   const startGame = () => {
  const platformWidth = canvas.width * 0.3;
  const platformHeight = 30;

  const groundHeight = 40;

  let player = {
    x: canvas.width / 2 - 30,
    y: canvas.height - groundHeight - 60,
    vy: 0,
    width: 60,
    height: 60,
    canJump: true
  };

  let gravity = 0.1;
  let jumpForce = -15;
  let keys: { [key: string]: boolean } = {};

  // Sabit geniş platform (zemin)
  let platforms = [
    {
      x: 0,
      y: canvas.height - groundHeight,
      width: canvas.width,
      height: groundHeight,
      isGround: true
    }
  ];

  // Diğer platformlar yukarıda
  for (let i = 1; i < 10; i++) {
    platforms.push({
      x: Math.random() * (canvas.width - platformWidth),
      y: canvas.height - groundHeight - i * 100,
      width: platformWidth,
      height: platformHeight,
      isGround: false
    });
  }

  let score = 0;

  const update = () => {
    // Sağ / sol
    if (keys['ArrowLeft']) player.x -= 5;
    if (keys['ArrowRight']) player.x += 5;

    // Zıplama
    if (keys['ArrowUp'] && player.canJump) {
      player.vy = jumpForce;
      player.canJump = false;
    }

    player.vy += gravity;
    player.y += player.vy;

    let isOnPlatform = false;

    for (let plat of platforms) {
      if (
        player.vy >= 0 &&
        player.y + player.height <= plat.y + player.vy &&
        player.y + player.height + player.vy >= plat.y &&
        player.x + player.width > plat.x &&
        player.x < plat.x + plat.width
      ) {
        // Platforma çarptı
        player.y = plat.y - player.height;
        player.vy = 0;
        player.canJump = true;
        isOnPlatform = true;
      }
    }

    // Platformdan ayrıldıysa
    if (!isOnPlatform && player.vy > 0) {
      player.canJump = false;
    }

    // Kamera yukarı kaydırma
    if (player.y < 300) {
      const dy = 300 - player.y;
      player.y = 300;
      platforms.forEach(p => (p.y += dy));
      score += Math.floor(dy);
    }

    // Düştü mü?
    if (player.y > canvas.height) {
      player.y = canvas.height - groundHeight - player.height;
      player.vy = 0;
      score = 0;

      platforms = [
        {
          x: 0,
          y: canvas.height - groundHeight,
          width: canvas.width,
          height: groundHeight,
          isGround: true
        }
      ];
      for (let i = 1; i < 10; i++) {
        platforms.push({
          x: Math.random() * (canvas.width - platformWidth),
          y: canvas.height - groundHeight - i * 100,
          width: platformWidth,
          height: platformHeight,
          isGround: false
        });
      }
    }

    // Yeni platform oluştur
    const topY = Math.min(...platforms.map(p => p.y));
    if (topY > 0) {
      platforms.push({
        x: Math.random() * (canvas.width - platformWidth),
        y: topY - 100,
        width: platformWidth,
        height: platformHeight,
        isGround: false
      });
    }
  };


      const draw = () => {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
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

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        width: '100vw',
        height: '100vh',
      }}
    />
  );
};

export default Game;
