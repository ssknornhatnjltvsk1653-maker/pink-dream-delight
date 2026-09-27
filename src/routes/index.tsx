import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Heart, Music, Volume2, VolumeX } from "lucide-react";
import envelope from "@/assets/envelope.png";
import hug from "@/assets/hug.png";
import sorry from "@/assets/sorry.png";
import moon from "@/assets/moon.png";
import dance from "@/assets/dance.png";
import berry from "@/assets/berry.png";
import gift from "@/assets/gift.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "a little place for you ♡" },
      { name: "description", content: "A soft little pink world made with love, a real apology and a few surprises" },
      { property: "og:title", content: "a little place for you ♡" },
      { property: "og:description", content: "A soft little pink world made with love, a real apology and a few surprises" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Story,
});

const SONG_ID = "QBDem6bffyo";

const thoughts = [
  "you make ordinary days feel softer", "i love having you in my life", "you deserve to feel appreciated",
  "you deserve reassurance", "you deserve patience", "you deserve softness",
  "i like the little world we have", "your smile matters to me", "i'm glad it's you",
  "you make the quiet moments lovely", "i want to listen better", "you matter on the hard days too",
  "i love the way you are simply you", "i want to choose kindness", "you deserve to be spoiled with love too",
];

const littleThings = [
  "your presence", "your energy", "the way you make things feel less boring", "the comfort you bring",
  "the way you can make me smile without even trying", "your little habits", "your random moments", "the way you are simply you",
];

function Img({ src, className = "", alt = "", eager = false }: { src: string; className?: string; alt?: string; eager?: boolean }) {
  return <img src={src} alt={alt} width={1024} height={1024} loading={eager ? "eager" : "lazy"} className={`doodle-img select-none ${className}`} draggable={false} />;
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="font-hand text-2xl text-primary md:text-3xl">{children}</p>;
}

/* ---------- opening ---------- */
function Intro({ onDone }: { onDone: () => void }) {
  const [opening, setOpening] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const open = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(() => setLeaving(true), 700);
    setTimeout(onDone, 1800);
  };
  return (
    <div className={`intro paper fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6 text-center ${leaving ? "leaving" : ""}`}>
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} className="petal font-display text-xl" style={{ left: `${(i * 37) % 100}%`, animationDuration: `${9 + (i % 5) * 2}s`, animationDelay: `${-i * 1.3}s` }}>♡</span>
      ))}
      <p className="fade-late font-hand text-3xl text-muted-foreground" style={{ animationDelay: ".2s" }}>psst</p>
      <div className="mx-auto mt-2 inline-block">
        <h1 className="type-line pb-3 font-display text-3xl italic md:text-5xl">something came for you</h1>
      </div>
      <button onClick={open} aria-label="Open the letter" className="relative mt-8 w-64 md:w-80">
        <div className="env-enter"><div className={opening ? "env-open" : "env-idle"}><Img src={envelope} eager alt="A pink love letter with a heart seal" /></div></div>
      </button>
      <p className="fade-late font-hand text-3xl text-primary" style={{ animationDelay: "3.4s" }}>tap the letter</p>
    </div>
  );
}

/* ---------- scratch card ---------- */
function ScratchCard({ onReveal }: { onReveal: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);
  const drawing = useRef(false);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const r = c.getBoundingClientRect(); c.width = r.width * 2; c.height = r.height * 2; ctx.scale(2, 2);
    const cs = getComputedStyle(document.documentElement);
    const g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, cs.getPropertyValue("--primary")); g.addColorStop(1, cs.getPropertyValue("--lilac"));
    ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
    ctx.fillStyle = cs.getPropertyValue("--primary-foreground");
    ctx.font = "700 30px Caveat"; ctx.textAlign = "center";
    ctx.fillText("scratch me gently", r.width / 2, r.height / 2 + 8);
  }, []);
  const scratch = (e: React.PointerEvent) => {
    if (!drawing.current || done) return;
    const c = ref.current!; const ctx = c.getContext("2d")!; const r = c.getBoundingClientRect();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.arc(e.clientX - r.left, e.clientY - r.top, 22, 0, Math.PI * 2); ctx.fill();
    const data = ctx.getImageData(0, 0, c.width, c.height).data; let clear = 0;
    for (let i = 3; i < data.length; i += 64) if (data[i] === 0) clear++;
    if (clear / (data.length / 64) > 0.45) { setDone(true); onReveal(); }
  };
  return (
    <div className="relative mx-auto h-48 w-full max-w-sm overflow-hidden rounded-3xl bg-card shadow-lg ring-1 ring-border">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <p className="font-display text-3xl italic">i love you</p>
        <p className="font-hand text-3xl text-primary">so so much</p>
      </div>
      <canvas ref={ref} className={`absolute inset-0 h-full w-full touch-none transition-opacity duration-700 ${done ? "opacity-0" : ""}`}
        onPointerDown={e => { drawing.current = true; scratch(e); }} onPointerMove={scratch} onPointerUp={() => (drawing.current = false)} onPointerLeave={() => (drawing.current = false)} />
    </div>
  );
}

/* ---------- forgive me ---------- */
function ForgiveMe({ onYes }: { onYes: () => void }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [tries, setTries] = useState(0);
  const [yes, setYes] = useState(false);
  const noLines = ["no", "r u sure", "pls", "think again", "pretty pls", "ok u can't click me"];
  const run = () => { setTries(t => t + 1); setPos({ x: (Math.random() - 0.5) * 240, y: (Math.random() - 0.5) * 140 }); };
  if (yes) return <div className="animate-scale-in text-center"><Img src={hug} className="mx-auto w-56" /><p className="font-display text-3xl italic">yayyy</p><p className="font-hand text-3xl text-primary">ok now come here n hug me</p></div>;
  return (
    <div className="relative text-center">
      <p className="font-display text-3xl italic md:text-4xl">so… do u forgive me</p>
      <div className="relative mt-8 flex h-40 items-center justify-center gap-6">
        <button onClick={() => { setYes(true); onYes(); }} className="rounded-full bg-primary px-8 py-3 font-hand text-3xl text-primary-foreground shadow-lg transition-transform hover:scale-110" style={{ transform: `scale(${1 + tries * 0.12})` }}>yes</button>
        <button onMouseEnter={run} onClick={run} className="rounded-full border-2 border-primary bg-card px-6 py-3 font-hand text-2xl text-primary transition-transform duration-300" style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}>{noLines[Math.min(tries, noLines.length - 1)]}</button>
      </div>
    </div>
  );
}

/* ---------- main ---------- */
function Story() {
  const [started, setStarted] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [slip, setSlip] = useState<number | null>(null);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [giftOpen, setGiftOpen] = useState(false);
  const [songOn, setSongOn] = useState(false);
  const [sound, setSound] = useState(true);
  const audio = useRef<AudioContext | null>(null);

  const chime = () => {
    if (!sound) return;
    try {
      const ctx = audio.current ?? new AudioContext(); audio.current = ctx;
      [659.25, 783.99, 1046.5].forEach((f, i) => {
        const o = ctx.createOscillator(); const g = ctx.createGain(); const t = ctx.currentTime + i * 0.08;
        o.type = "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.03, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
        o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.65);
      });
    } catch { /* optional */ }
  };
  const burst = () => { setBurstKey(k => k + 1); chime(); };

  useEffect(() => {
    if (!started) return;
    const obs = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add("is-visible")), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [started, giftOpen]);

  const drawSlip = () => { let n = Math.floor(Math.random() * thoughts.length); if (n === slip) n = (n + 1) % thoughts.length; setSlip(n); burst(); };

  return (
    <main className="paper relative min-h-screen">
      {!started && <Intro onDone={() => { setStarted(true); burst(); }} />}

      {burstKey > 0 && (
        <div className="burst" key={burstKey} aria-hidden="true">
          {Array.from({ length: 22 }, (_, i) => <span key={i} style={{ "--angle": `${i * 137.5}deg`, "--distance": `${90 + (i % 5) * 40}px` } as CSSProperties}>♡</span>)}
        </div>
      )}

      <button onClick={() => setSound(!sound)} aria-label={sound ? "Turn sounds off" : "Turn sounds on"} className="fixed right-4 top-4 z-40 rounded-full bg-card/80 p-3 text-primary shadow-md backdrop-blur">
        {sound ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </button>

      <div className="relative z-10">
        {/* hero */}
        <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <Img src={hug} eager className="float w-60 md:w-80" alt="Two doodle people hugging with a heart balloon" />
          <Kicker>first things first</Kicker>
          <h1 className="mt-2 font-display text-5xl leading-tight md:text-7xl">you are very<br /><em className="text-primary">very loved</em></h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">more than i probably say properly sometimes</p>
          <p className="mt-12 animate-bounce font-hand text-2xl text-primary">scroll slowly</p>
        </section>

        {/* apology */}
        <section className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-24 md:grid-cols-[1fr_1.3fr]">
          <Img src={sorry} className="reveal mx-auto w-64 md:w-full" alt="Doodle boy holding flowers and a sorry sign" />
          <div className="space-y-6">
            <Kicker>a lil honesty</Kicker>
            <div className="letter-card reveal relative p-7 text-lg leading-9">
              <span className="tape -top-3 left-8 -rotate-6" />
              i'm sorry for letting my ego get in the way jab actually matter u aur hum karte the  kabhi kabhi main apni feelings mein itna ulajh jaata hoon ki cheezein unnecessarily harder bana deta hoon  and ngl mujhe hate hota hai ki maine ek stupid si fight ko us insaan se bhi bigger bana diya jise main love karta hoon
            </div>
            <div className="letter-card reveal relative p-7 text-lg leading-9">
              <span className="tape -top-3 right-8 rotate-6" />
              u deserve nahi karti thi ki tujhe lage main apne ego ko tumse upar choose kar raha hoon  i'm genuinely sorry for that  main apne liye excuses nahi bana raha  bas chahta hoon ki tujhe pata ho mujhe samajh aa gaya hai main kahan galat tha and i genuinely care about making things better  sirf sorry bolke move on karne ke liye nahi
            </div>
          </div>
        </section>

        {/* reasons jar surprise */}
        <section className="px-6 py-24 text-center">
          <Kicker>a lil garden of thoughts</Kicker>
          <h2 className="reveal font-display text-4xl md:text-6xl">and there's more<br /><em className="text-primary">i want you to know</em></h2>
          <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-8 md:flex-row md:justify-center">
            <button onClick={drawSlip} className="reveal group" aria-label="Pick a little thought">
              <Img src={berry} className="float-slow w-64 transition-transform group-hover:scale-105 md:w-80" alt="Doodle girl hugging a giant strawberry" />
              <span className="font-hand text-2xl text-primary">tap for a lil thought</span>
            </button>
            <div className="min-h-40 w-full max-w-xs">
              {slip !== null ? (
                <div key={slip} className="jar-slip relative rounded-2xl bg-card p-6 font-hand text-3xl leading-snug shadow-xl ring-1 ring-border">
                  <span className="tape -top-3 left-1/2 -translate-x-1/2" />
                  {thoughts[slip]}
                  <p className="mt-3 font-body text-xs text-muted-foreground">{slip + 1} of {thoughts.length} · tap again</p>
                </div>
              ) : <p className="font-hand text-2xl text-muted-foreground">there are {thoughts.length} lil notes hiding in there</p>}
            </div>
          </div>
          <div className="letter-card reveal relative mx-auto mt-16 max-w-2xl space-y-5 p-8 text-left text-lg leading-9">
            <p>kabhi kabhi mujhe lagta hai main properly explain hi nahi kar pata ki tum mere liye kitni important ho</p>
            <p>sirf big moments hi reason nahi hain ki mujhe tumhe apni life mein rakhna itna pasand hai  lil things bhi matter karte hain  jis tarah tum ek normal convo ko special bana deti ho  jis tarah tumhari presence poore din ka mood change kar sakti hai  aur somehow jab sab kuch messy lagta hai tab bhi mera ek part bas tumhare paas rehna aur sab theek karna chahta hai</p>
            <p>main nahi chahta ki tumhare liye meri love sirf cute words tak rahe  main chahta hoon ki woh mere listen karne ke tareeke mein dikhe  tumhe samajhne mein dikhe  jab main galat hoon tab properly apologise karne mein dikhe  aur jab hum ek dusre se annoyed hon tab bhi kindness choose karne mein dikhe</p>
          </div>
        </section>

        {/* flip cards */}
        <section className="px-6 py-24 text-center">
          <Kicker>scribbled in the margins</Kicker>
          <h2 className="reveal font-display text-4xl md:text-6xl">little things <em className="text-primary">i love</em></h2>
          <p className="mt-3 text-muted-foreground">tap each card to flip it</p>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-5 md:grid-cols-4">
            {littleThings.map((line, i) => {
              const on = flipped.includes(i);
              return (
                <button key={line} onClick={() => { setFlipped(f => on ? f.filter(x => x !== i) : [...f, i]); if (!on) chime(); }} className={`flip reveal h-44 ${on ? "flipped" : ""}`} style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className="flip-inner h-full w-full">
                    <div className="flip-face flex flex-col items-center justify-center rounded-2xl bg-card shadow-md ring-1 ring-border" style={{ transform: `rotate(${i % 2 ? 2 : -2}deg)` }}>
                      <span className="font-display text-5xl italic text-primary">0{i + 1}</span>
                      <span className="font-hand text-xl text-muted-foreground">flip me</span>
                    </div>
                    <div className="flip-face flip-back flex items-center justify-center rounded-2xl bg-accent p-4 font-hand text-2xl leading-tight shadow-md">{line}</div>
                  </div>
                </button>
              );
            })}
          </div>
          {flipped.length === littleThings.length && <p className="mt-10 animate-fade-in font-display text-3xl italic">basically… <span className="text-primary">you</span></p>}
        </section>

        {/* evening */}
        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
          <Img src={moon} className="reveal float-slow mx-auto w-64 md:w-80" alt="Doodle couple sitting on the moon" />
          <div className="space-y-4">
            <p className="reveal font-hand text-3xl text-muted-foreground">and honestly</p>
            <p className="reveal font-display text-2xl md:text-3xl">main nahi chahta ki humare beech ki yeh chhoti si baat us pyaar se badi ban jaaye jo humare beech hai</p>
            <p className="reveal font-display text-2xl md:text-3xl">i care about you way too much for that</p>
            <p className="reveal font-display text-4xl italic text-primary md:text-5xl">i'm sorry baby</p>
          </div>
          <div className="letter-card reveal mt-12 p-8 text-left text-lg leading-9">
            mujhe pata hai sorry bolne se bad moment magically erase nahi hota  but main phir bhi properly sorry kehna chahta hoon bc tum mere liye matter karti ho aur mujhe kabhi apne pride ko tumhare liye care se louder nahi hone dena chahiye  jab hum agree na karein tab tumhe samajhne aur un moments ko handle karne mein main better hona chahta hoon  bc kisi se love karna sirf easy days ke baare mein nahi hota  difficult days mein ek dusre ke saath thoda softer hona seekhna bhi usi ka part hai
            <p className="mt-4 font-hand text-3xl text-primary">i mean that</p>
          </div>
        </section>

        {/* ribbon words */}
        <section className="px-6 py-16">
          <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-4">
            {["love", "patience", "comfort", "trust", "laughter", "understanding", "us"].map((w, i) => (
              <span key={w} className="reveal rounded-full px-6 py-2 font-display text-2xl italic shadow-sm md:text-3xl" style={{ background: `var(--${["blush", "peach", "lilac", "butter", "mint"][i % 5]})`, transitionDelay: `${i * 90}ms`, transform: `rotate(${(i % 3) - 1}deg)` }}>{w}</span>
            ))}
          </div>
        </section>

        {/* scratch */}
        <section className="px-6 py-24 text-center">
          <Kicker>a lil secret under here</Kicker>
          <div className="reveal mt-6"><ScratchCard onReveal={burst} /></div>
          <p className="reveal mt-8 font-display text-2xl">and i'm really sorry</p>
          <p className="reveal font-hand text-3xl text-primary">thank you for being you</p>
        </section>

        {/* last letter */}
        <section className="mx-auto max-w-2xl px-6 py-24">
          <div className="letter-card reveal relative p-8 text-lg leading-9">
            <span className="tape -top-3 left-10 -rotate-3" />
            agar is poore moment se main ek cheez seekh kar le jaaun, toh woh yeh hogi ki main kabhi apne ego ko itna big nahi hone dunga ki main bhool jaun tum mere liye kitni precious ho  main expect nahi karta ki humare beech sab kuch hamesha perfect rahega and i don't think love ka matlab kabhi annoyed na hona ya difficult moments na aana hai  bas main chahta hoon ki hum thodi aur patience aur thodi aur softness ke saath hamesha ek dusre ko samajhne ki taraf wapas aa sakein  aur meri side se main is cheez mein better karna chahta hoon bc tum mujhse yahi deserve karti ho
          </div>
          <div className="mt-12 space-y-3 text-center">
            <p className="reveal font-hand text-3xl text-muted-foreground">so yeah...</p>
            <p className="reveal font-display text-2xl">this is me putting my ego down for a second...</p>
            <p className="reveal font-display text-2xl">and choosing to tell you what i should've told you sooner...</p>
            <p className="reveal font-display text-5xl italic text-primary">i love you.</p>
          </div>
        </section>

        {/* forgive */}
        <section className="px-6 py-24"><div className="reveal mx-auto max-w-xl"><ForgiveMe onYes={burst} /></div></section>

        {/* gift */}
        <section className="px-6 py-24 text-center">
          {!giftOpen ? (
            <>
              <p className="reveal font-hand text-3xl text-muted-foreground">there's one more little thing...</p>
              <button onClick={() => { setGiftOpen(true); burst(); }} className="gift-shake reveal mt-4" aria-label="Open the gift">
                <Img src={gift} className="w-64 md:w-80" alt="A pink gift box with hearts" />
              </button>
              <p className="font-hand text-2xl text-primary">tap the gift</p>
            </>
          ) : (
            <div className="mx-auto max-w-lg animate-scale-in space-y-3">
              <Img src={gift} className="mx-auto w-40" />
              {["okay...", "one last thing", "you are loved.", "you are appreciated.", "you are important.", "and i hope you never forget that."].map((l, i) => (
                <p key={l} className="fade-late font-display text-3xl italic" style={{ animationDelay: `${i * 0.6}s` }}>{l}</p>
              ))}
            </div>
          )}
        </section>

        {/* song + final */}
        <section className="px-6 pb-32 pt-16 text-center">
          <Kicker>ok last surprise i promise</Kicker>
          <h2 className="reveal font-display text-4xl md:text-6xl">a song <em className="text-primary">for us</em></h2>
          <div className="reveal mx-auto mt-10 max-w-md rounded-[2rem] bg-card p-6 shadow-2xl ring-1 ring-border">
            <Img src={dance} className="mx-auto w-64" alt="Doodle couple dancing next to a record player" />
            <div className="mt-2 flex items-center gap-4 text-left">
              <div className={`vinyl ${songOn ? "playing" : ""} grid h-16 w-16 shrink-0 place-items-center rounded-full bg-ink`}>
                <div className="h-5 w-5 rounded-full bg-primary ring-4 ring-blush" />
              </div>
              <div className="flex-1">
                <p className="font-display text-2xl italic">Be My Baby</p>
                <p className="text-sm text-muted-foreground">The Ronettes · for u</p>
              </div>
              <button onClick={() => { setSongOn(true); burst(); }} aria-label="Play Be My Baby" className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110">
                <Music className="h-6 w-6" />
              </button>
            </div>
            {songOn && (
              <div className="mt-5 aspect-video overflow-hidden rounded-2xl animate-fade-in">
                <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${SONG_ID}?autoplay=1`} title="Be My Baby by The Ronettes" allow="autoplay; encrypted-media" allowFullScreen />
              </div>
            )}
          </div>

          <div className="mt-24 space-y-3">
            <p className="reveal font-hand text-3xl text-muted-foreground">that's all i wanted to say...</p>
            <h2 className="reveal font-display text-6xl italic text-primary md:text-7xl">i love you</h2>
            <p className="reveal font-display text-2xl">and i'm sorry</p>
            <p className="reveal font-hand text-4xl">come here</p>
            <button onClick={burst} className="reveal mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-hand text-2xl text-primary-foreground shadow-lg transition-transform hover:scale-105">
              <Heart className="h-5 w-5" fill="currentColor" /> tap the heart if you smiled
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
