'use client';
import Game from '@/components/Game';

export default function Home() {
  return (
    <div
      style={{
        backgroundColor: '#9bf57f',
        minHeight: '100vh',
        fontFamily: "'Comic Neue', cursive",
        position: 'relative',
      }}
    >
      {/* Üst Başlık */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '20px',
        }}
      >
        <h1 style={{ marginRight: '10px', fontSize: '36px' }}>Ethos Tower</h1>
        <img src="/ethos-logo.png" alt="Logo" style={{ height: '75px' }} />
      </div>

      {/* Sağ üst köşe Twitter linki */}
      <a
        href="https://x.com/sametx123" // ← kendi Twitter linkinle değiştir
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
        }}
      >
        <img
          src="/twitter.png" // ← twitter logonu public klasörüne eklediğini varsayıyorum
          alt="Twitter"
          style={{ width: '36px', height: '36px' }}
        />
      </a>

      {/* Oyun Alanı */}
      <Game />
    </div>
  );
}
