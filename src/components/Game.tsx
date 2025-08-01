import { useEffect, useRef } from "react";

interface GameProps {
  twitterID: string;
}

const Game: React.FC<GameProps> = ({ twitterID }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gravity = 0.5;

    let platforms = Array.from({ length: 10 }, (_, i) => ({
      x: Math.random() * (canvas.width - canvas.width * 0.3),
      y: canvas.height - i * 100,
      width: canvas.width * 0.3,
      height: canvas.height * 0.05,
    }));

    let player = {
      x: platforms[0].x + platforms[0].width / 2 - (canvas.width * 0.06) / 2,
      y: platforms[0].y - canvas.width * 0.06,
      vy: 0,
      width: canvas.width * 0.06,
      height: canvas.width * 0.06,
    };

    const keys = {
      left: false,
      right: false,
      up: false,
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft") keys.left = true;
      if (e.code === "ArrowRight") keys.right = true;
      if (e.code === "Space" || e.code === "ArrowUp") keys.up = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft") keys.left = false;
      if (e.code === "ArrowRight") keys.right = false;
      if (e.code === "Space" || e.code === "ArrowUp") keys.up = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update
      if (keys.left) player.x -= 5;
      if (keys.right) player.x += 5;

      player.vy += gravity;
      player.y += player.vy;

      // Collision detection
      for (const platform of platforms) {
        if (
          player.y + player.height >= platform.y &&
          player.y + player.height <= platform.y + platform.height &&
          player.x + player.width > platform.x &&
          player.x < platform.x + platform.width &&
          player.vy > 0
        ) {
          player.vy = -12;
        }
      }

      // Draw platforms
      ctx.fillStyle = "green";
      for (const platform of platforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      }

      // Draw player
      ctx.fillStyle = "red";
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Draw Twitter ID
      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.fillText(`@${twitterID}`, 10, 30);

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [twitterID]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default Game;
