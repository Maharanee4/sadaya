import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Gamepad2, Heart, RotateCcw, Sparkles } from 'lucide-react';
import './SadayaPlay.css';

const GAME_SECONDS = 60;
const STARTING_LIVES = 5;
const PLAYER_Y = 84;
const TICK_MS = 50;

const makeBall = (id) => ({
  id,
  x: 7 + Math.random() * 86,
  y: -5,
  speed: 15 + Math.random() * 10,
  kind: Math.random() > 0.9 ? 'golden' : 'normal',
});

const initialState = () => ({
  phase: 'start',
  score: 0,
  best: Number(localStorage.getItem('sadaya_catch_best') || 0),
  secondsLeft: GAME_SECONDS,
  lives: STARTING_LIVES,
  playerX: 50,
  balls: [],
  elapsed: 0,
  spawnIn: 300,
  nextBallId: 1,
});

export default function SadayaPlay() {
  const navigate = useNavigate();
  const boardRef = useRef(null);
  const [game, setGame] = useState(initialState);

  const movePlayer = useCallback((amount) => {
    setGame((current) => current.phase === 'playing'
      ? { ...current, playerX: Math.max(7, Math.min(93, current.playerX + amount)) }
      : current);
  }, []);

  const placePlayer = useCallback((event) => {
    const bounds = boardRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const playerX = Math.max(7, Math.min(93, ((event.clientX - bounds.left) / bounds.width) * 100));
    setGame((current) => current.phase === 'playing' ? { ...current, playerX } : current);
  }, []);

  const startGame = () => {
    setGame({ ...initialState(), phase: 'playing', best: game.best });
  };

  useEffect(() => {
    if (game.phase !== 'playing') return undefined;

    const onKeyDown = (event) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(event.key)) event.preventDefault();
      if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') movePlayer(-7);
      if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') movePlayer(7);
    };
    window.addEventListener('keydown', onKeyDown);

    const timer = window.setInterval(() => {
      setGame((current) => {
        if (current.phase !== 'playing') return current;
        const elapsed = current.elapsed + TICK_MS;
        const secondsLeft = Math.max(0, GAME_SECONDS - Math.floor(elapsed / 1000));
        let score = current.score;
        let lives = current.lives;
        const balls = [];

        current.balls.forEach((ball) => {
          const y = ball.y + (ball.speed * TICK_MS) / 1000;
          const caught = y >= PLAYER_Y - 3 && y <= PLAYER_Y + 4 && Math.abs(ball.x - current.playerX) < 10;
          if (caught) score += ball.kind === 'golden' ? 30 : 10;
          else if (y > 100) lives -= 1;
          else balls.push({ ...ball, y });
        });

        let spawnIn = current.spawnIn - TICK_MS;
        let nextBallId = current.nextBallId;
        if (spawnIn <= 0 && balls.length < 7) {
          balls.push(makeBall(nextBallId));
          nextBallId += 1;
          spawnIn = 500 + Math.random() * 550;
        }

        const best = Math.max(current.best, score);
        if (best !== current.best) localStorage.setItem('sadaya_catch_best', String(best));
        const phase = lives <= 0 || secondsLeft <= 0 ? 'end' : 'playing';
        return { ...current, elapsed, secondsLeft, score, lives: Math.max(0, lives), balls, spawnIn, nextBallId, best, phase };
      });
    }, TICK_MS);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [game.phase, movePlayer]);

  return (
    <main className="sadaya-play-page animate-fade-in">
      <header className="sadaya-play-header">
        <button className="icon-btn-rounded" onClick={() => navigate('/home')} aria-label="Kembali ke beranda"><ArrowLeft size={20} /></button>
        <div className="sadaya-play-brand"><span><Gamepad2 size={19} /></span><strong>SADAYA BERDAYA</strong></div>
        <span className="sadaya-play-spacer" />
      </header>

      <section className="sadaya-play-hero">
        <span className="sadaya-play-eyebrow"><Sparkles size={15} /> GAME SANTAI · TANTANGAN REFLEKS</span>
        <h1>Tangkap Bolanya!<br /><span>Kejar skor tertinggi.</span></h1>
        <p>Geser keranjang ke kiri dan kanan untuk menangkap bola yang jatuh. Bola emas memberi 30 poin. Kamu punya 60 detik—siap mencetak rekor?</p>
      </section>

      <section className="sadaya-catch-game" aria-label="Permainan menangkap bola">
        <div className="sadaya-catch-scorebar">
          <div><small>SKOR</small><strong>{game.score}</strong></div>
          <div className="sadaya-catch-timer"><small>WAKTU</small><strong>{game.secondsLeft}<span> dtk</span></strong></div>
          <div className="sadaya-catch-lives" aria-label={`${game.lives} kesempatan tersisa`}><small>KESEMPATAN</small><strong>{Array.from({ length: STARTING_LIVES }, (_, index) => <Heart key={index} size={17} fill={index < game.lives ? 'currentColor' : 'transparent'} />)}</strong></div>
        </div>

        <div
          ref={boardRef}
          className={`sadaya-catch-board ${game.phase === 'playing' ? 'is-playing' : ''}`}
          onPointerDown={(event) => { if (game.phase === 'playing') { event.currentTarget.setPointerCapture(event.pointerId); placePlayer(event); } }}
          onPointerMove={(event) => { if (event.buttons > 0 && game.phase === 'playing') placePlayer(event); }}
          role="application"
          aria-label="Area permainan. Geser atau sentuh untuk memindahkan keranjang."
        >
          <div className="sadaya-catch-sky" aria-hidden="true"><i>✦</i><i>✧</i><i>✦</i><i>✧</i></div>
          {game.balls.map((ball) => <span key={ball.id} className={`sadaya-falling-ball ${ball.kind}`} style={{ left: `${ball.x}%`, top: `${ball.y}%` }} aria-label={ball.kind === 'golden' ? 'Bola emas, 30 poin' : 'Bola, 10 poin'} />)}
          {game.phase === 'playing' && <div className="sadaya-catch-basket" style={{ left: `${game.playerX}%`, top: `${PLAYER_Y}%` }} aria-label="Keranjang pemain"><span /></div>}
          {game.phase === 'start' && <div className="sadaya-catch-overlay"><span className="sadaya-catch-overlay-icon"><Gamepad2 size={30} /></span><h2>Waktunya main!</h2><p>Gunakan tombol panah atau A/D. Di HP, geser keranjang dengan jari.</p><p className="sadaya-catch-best">Rekor terbaik: <strong>{game.best}</strong></p><button className="sadaya-play-primary" onClick={startGame}>Mulai main <ArrowRight size={17} /></button></div>}
          {game.phase === 'end' && <div className="sadaya-catch-overlay" aria-live="polite"><span className="sadaya-catch-overlay-icon"><Sparkles size={30} /></span><h2>{game.secondsLeft === 0 ? 'Waktu habis!' : 'Kesempatan habis!'}</h2><p>Skormu <strong>{game.score}</strong> · rekor terbaik <strong>{game.best}</strong></p><button className="sadaya-play-primary" onClick={startGame}><RotateCcw size={17} /> Main lagi</button></div>}
        </div>

        {game.phase === 'playing' && <div className="sadaya-catch-controls" aria-label="Kontrol permainan">
          <button type="button" onClick={() => movePlayer(-9)} aria-label="Geser keranjang ke kiri"><ArrowLeft size={22} /></button>
          <span>Gunakan ← → atau geser keranjang</span>
          <button type="button" onClick={() => movePlayer(9)} aria-label="Geser keranjang ke kanan"><ArrowRight size={22} /></button>
        </div>}
      </section>

      <aside className="sadaya-catch-tip"><span>💡</span><p>Bola hijau bernilai 10 poin. Tangkap bola emas untuk bonus 30 poin. Kamu punya lima kesempatan selama 60 detik; rekor hanya tersimpan di perangkat ini.</p></aside>
    </main>
  );
}
