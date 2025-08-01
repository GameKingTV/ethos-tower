'use client';
import { useEffect, useRef, useState } from 'react';

interface GameProps {
  twitterID: string;
}

const Game = ({ twitterID }: GameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScores, setHighScores] = useState<{ name: string; score: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.85;

    const playerImg = new Image();
    const platformImg = new Image();
    playerImg.src = '/player.png';
    platformImg.src = '/platform.png';

    let loadedCount = 0;
    const onAssetLoad = () => {
      loadedCount++;
      if (loadedCount === 2) startGame();
    };

    playerImg.onload = onAssetLoad;
    platformImg.onload = onAssetLoad;

    const startGame = () => {
      let player = {
  x: platforms[0].x + platforms[0].width / 2 - (canvas.width * 0.06) / 2,
  y: platforms[0].y - (canvas.width * 0.06),
  vy: 0,
  width: canvas.width * 0.06,
  height: canvas.width * 0.06,
};

      let gravity = 0.26;
      let keys: { [key: string]: boolean } = {};
      let platforms = Array.from({ length: 10 }, (_, i) => ({
  x: Math.random() * (canvas.width - canvas.width * 0.30),
  y: canvas.height - i * 100,
  width: canvas.width * 0.30,
  height: canvas.height * 0.05,
}));

      let currentScore = 0;

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
          currentScore += Math.floor(dy);
          setScore(currentScore);
        }

        if (player.y > canvas.height) {
          handleGameOver(currentScore);
          return;
        }

        const topY = Math.min(...platforms.map(p => p.y));
        if (topY > 0) {
          platforms.push({
            x: Math.random() * (canvas.width - 200),
            y: topY - 100,
            width: 200,
            height: 40,
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
        ctx.fillText(`Score: ${currentScore}`, 20, 30);
      };

      const loop = () => {
        if (!isGameOver) {
          update();
          draw();
          requestAnimationFrame(loop);
        }
      };

      loop();

      window.addEventListener('keydown', e => (keys[e.key] = true));
      window.addEventListener('keyup', e => (keys[e.key] = false));
    };
  }, []);

  const handleGameOver = (finalScore: number) => {
    setIsGameOver(true);
    const newScore = { name: twitterID, score: finalScore };
    const storedScores = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    const updatedScores = [...storedScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    localStorage.setItem('leaderboard', JSON.stringify(updatedScores));
    setHighScores(updatedScores);
  };

  const handleRestart = () => {
    setScore(0);
    setIsGameOver(false);
    window.location.reload(); // oyunu basitçe yeniden başlat
  };

  return (
    <div className="relative w-full h-screen bg-blue-100">
      <canvas
        ref={canvasRef}
        style={{
          background: '#eee',
          border: '1px solid black',
          display: 'block',
          margin: '20px auto',
        }}
      />

      <div className="absolute top-4 left-4 text-xl font-bold">Score: {score}</div>

      {isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white">
          <h2 className="text-4xl font-bold mb-4">Game Over</h2>
          <p className="mb-4">Your Score: {score}</p>

          <h3 className="text-2xl mb-2">🏆 Leaderboard</h3>
          <ul className="mb-4">
            {highScores.map((entry, idx) => (
              <li key={idx}>
                {idx + 1}. {entry.name} - {entry.score}
              </li>
            ))}
          </ul>

          <button
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
            onClick={handleRestart}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
