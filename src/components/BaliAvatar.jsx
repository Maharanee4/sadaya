import { Flower2, Leaf } from 'lucide-react';
import { getFlowerAvatarArt, normalizeBaliAvatar } from './baliAvatarOptions';

// eslint-disable-next-line react/prop-types
export default function BaliAvatar({ region = 'Jepun', size = 48 }) {
  const art = getFlowerAvatarArt(normalizeBaliAvatar(region));

  return (
    <span
      aria-hidden="true"
      style={{
        position: 'relative', display: 'grid', placeItems: 'center', flex: '0 0 auto',
        width: size, height: size, borderRadius: '50%', overflow: 'hidden',
        background: `radial-gradient(circle at 74% 22%, ${art.accent} 0 8%, transparent 9%), ${art.background}`,
        color: art.color,
      }}
    >
      <span style={{ position: 'absolute', width: '72%', height: '24%', bottom: '10%', borderRadius: '50%', background: `${art.color}20` }} />
      <Leaf size={Math.round(size * 0.2)} strokeWidth={1.8} style={{ position: 'absolute', left: '17%', bottom: '21%', transform: 'rotate(-28deg)' }} />
      <Flower2 size={Math.round(size * 0.58)} strokeWidth={1.7} style={{ position: 'relative', zIndex: 1 }} />
    </span>
  );
}
