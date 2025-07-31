import { useEffect, useRef } from 'react';

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 400;
    canvas.height = 600;

    let y = 550;
    let vy = 0;
    let gravity = 0.5;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      vy += gravity;
      y += vy;

      if (y > canvas.height - 50) {
        y = canvas.height - 50;
        vy = -10;
      }

      ctx.fillStyle = "blue";
      ctx.fillRect(180, y, 40, 40);

      requestAnimationFrame(draw);
    }

    draw();
  }, []);

  return <canvas ref={canvasRef} className="border mx-auto block mt-10" />;
};

export default Game;
