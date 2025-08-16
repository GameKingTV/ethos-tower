'use client';
import { useState } from 'react';
import Game from './Game';

export default function Menu() {
  const [screen, setScreen] = useState<'menu' | 'play' | 'scoreboard' | 'settings'>('menu');

  if (screen === 'play') return <Game />;
  if (screen === 'scoreboard') return <div className="text-white text-center mt-10">Scoreboard Coming Soon</div>;
  if (screen === 'settings') return <div className="text-white text-center mt-10">Settings Coming Soon</div>;

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-sky-300 to-blue-500">
      <h1 className="text-5xl font-bold text-white mb-10 drop-shadow-lg">Ethos Tower</h1>
      <div className="space-y-4">
        <button
          onClick={() => setScreen('play')}
          className="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition"
        >
          Play
        </button>
        <button
          onClick={() => setScreen('scoreboard')}
          className="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition"
        >
          Scoreboard
        </button>
        <button
          onClick={() => setScreen('settings')}
          className="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition"
        >
          Settings
        </button>
      </div>
    </div>
  );
}
