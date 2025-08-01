'use client';

import { useState } from 'react';
import Game from '@/components/Game';

export default function Home() {
  const [twitterID, setTwitterID] = useState('');
  const [startGame, setStartGame] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-sky-200">
      {!startGame ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Enter your Twitter ID</h1>
          <input
            type="text"
            placeholder="@yourhandle"
            className="border p-2 rounded mb-4 w-64"
            value={twitterID}
            onChange={(e) => setTwitterID(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setStartGame(true)}
            disabled={!twitterID.trim()}
          >
            Start Game
          </button>
        </div>
      ) : (
        <Game twitterID={twitterID} />
      )}
    </div>
  );
}
