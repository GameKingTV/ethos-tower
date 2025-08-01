'use client';
import { useEffect, useRef } from 'react';

interface Props {
  twitterID: string;
}

const Game: React.FC<Props> = ({ twitterID }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gravity = 0.4;
    const jumpPower = -10;

    const playerImg = new Image();
    playerImg.src = '/player.png';

    const platformImg = new Image();
    platformImg.src = '/platform.png';

    const player = {
      x: canvas.width / 2 - 25,
      y: canvas.height - 150,
      width: 50,
      height: 50,
      vy: 0,
    };

    const platformCount = 10;
    const platforms = Array.from({ length: platformCount }).map((_, i) => ({
      x: Math.random() * (canvas.width - 100),
      y: canvas.height - i * 80,
      width: 100,
      height: 20,
    }));

    player.x = platforms[0].x + platforms[0].width / 2 - player.width / 2;
    player.y = platforms[0].y - player.height;

    let keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => (keys[e.key] = true);
    const handleKeyUp = (e: KeyboardEvent) => (keys[e.key] = false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move left/right
      if (keys['ArrowLeft']) player.x -= 5;
      if (keys['ArrowRight']) player.x += 5;

      // Gravity
      player.vy += gravity;
      player.y += player.vy;

      // Platform collision
      for (let platform of platforms) {
        if (
          player.y + player.height <= platform.y + player.vy &&
          player.y + player.height >= platform.y &&
          player.x + player.width >= platform.x &&
          player.x <= platform.x + platform.width &&
          player.vy > 0
        ) {
          player.vy = jumpPower;
        }
      }

      // Scroll platforms
      if (player.y < canvas.height / 2) {
        const diff = canvas.height / 2 - player.y;
        player.y = canvas.height / 2;
        platforms.forEach(p => (p.y += diff));
      }

      // Draw platforms
      for (let p of platforms) {
        ctx.drawImage(platformImg, p.x, p.y, p.width, p.height);
      }

      // Draw player
      ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

      // Twitter handle
      ctx.font = '16px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(`@${twitterID}`, 10, 20);

      requestAnimationFrame(loop);
    };

    platformImg.onload = () => {
      playerImg.onload = loop;
    };

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [twitterID]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default Game;
