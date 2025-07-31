import { useEffect, useRef, useState } from 'react';

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player, setPlayer] = useState({ x: 100, y: 300, vy: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    let animationId: number;
    let gravity = 0.5;
    let keys: any = {};

    const loop = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gravity
      let newY = player.y + player.vy;
      let newVy = player.vy + gravity;

      // Simple control
      if (keys["ArrowLeft"]) player.x -= 5;
      if (keys["ArrowRight"]) player.x += 5;

      // Draw player
      ctx.fillStyle = 'black';
      ctx.fillRect(player.x, newY, 20, 20);

      setPlayer({ x: player.x, y: newY, vy: newVy });

      animationId = requestAnimationFrame(loop);
    };

    window.addEventListener('keydown', e => keys[e.key] = true);
    window.addEventListener('keyup', e => keys[e.key] = false);

    loop();

    return () => cancelAnimationFrame(animationId);
  }, [player]);

  return <canvas ref={canvasRef} width={400} height={600} />;
};

export default Game;
