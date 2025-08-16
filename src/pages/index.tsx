'use client';
import dynamic from 'next/dynamic';

const Menu = dynamic(() => import('@/components/Menu'), { ssr: false });

export default function Home() {
  return <Menu />;
}
