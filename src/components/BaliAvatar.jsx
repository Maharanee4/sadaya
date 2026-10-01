import { Bird, Flower2, Landmark, Leaf, Mountain, Sun, Trees, Waves, Wind } from 'lucide-react';

const AVATAR_ART = {
  Jembrana: { Icon: Waves, color: '#087f8c', background: '#d7f2ed', accent: '#e4bb54' },
  Tabanan: { Icon: Leaf, color: '#397a3f', background: '#e3f0ce', accent: '#d9b344' },
  Badung: { Icon: Wind, color: '#187d72', background: '#d9f1e8', accent: '#efb44b' },
  Gianyar: { Icon: Landmark, color: '#55753d', background: '#edf0ce', accent: '#d9a941' },
  Klungkung: { Icon: Flower2, color: '#a34f61', background: '#f7e1d8', accent: '#dfb33d' },
  Bangli: { Icon: Mountain, color: '#537047', background: '#e2eddd', accent: '#d2a944' },
  Karangasem: { Icon: Sun, color: '#a56824', background: '#f8ebc9', accent: '#4f8251' },
  Buleleng: { Icon: Bird, color: '#287e8c', background: '#d9eff0', accent: '#e1b746' },
  Denpasar: { Icon: Trees, color: '#397a3f', background: '#e2efd8', accent: '#dbb03d' },
};

// eslint-disable-next-line react/prop-types
export default function BaliAvatar({ region = 'Gianyar', size = 48 }) {
  const art = AVATAR_ART[region] || AVATAR_ART.Gianyar;
  const { Icon } = art;

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
      <Icon size={Math.round(size * 0.52)} strokeWidth={1.8} style={{ position: 'relative', zIndex: 1 }} />
    </span>
  );
}
