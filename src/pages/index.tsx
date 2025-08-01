'use client';
import Game from '@/components/Game';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', fontFamily: "'Comic Neue', cursive" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
        <h1 style={{ marginRight: '10px', fontSize: '36px' }}>Ethos Tower</h1>
        <img src="/ethos-logo.png" alt="Logo" style={{ height: '40px' }} />
      </div>
      <Game />
    </div>
  );
}
