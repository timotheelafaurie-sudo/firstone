import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const BG = "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)";
const ACCENT = "#7c5cff";
const ACCENT_LIGHT = "#a78bfa";

function Background() {
  return (
    <div style={{ position: "absolute", inset: 0, background: BG }}>
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 47 + 11) % 100}%`,
          top: `${(i * 31 + 5) % 100}%`,
          width: 2,
          height: 2,
          borderRadius: "50%",
          background: ACCENT_LIGHT,
          opacity: 0.25,
        }} />
      ))}
    </div>
  );
}

function Logo({ frame }: { frame: number }) {
  const fps = useVideoConfig().fps;
  const opacity = interpolate(frame, [0, 15, 50, 65], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity,
      transform: `scale(${scale})`,
    }}>
      <div style={{
        fontSize: 72, fontWeight: 800, color: "white", letterSpacing: 12,
        fontFamily: "Arial, sans-serif",
        textShadow: `0 0 40px ${ACCENT}`,
      }}>
        AURA
      </div>
      <div style={{ fontSize: 18, color: ACCENT_LIGHT, letterSpacing: 6, marginTop: 8 }}>
        WIRELESS SOUND
      </div>
    </div>
  );
}

function EarbudIcon({ size = 1, glow = true }: { size?: number; glow?: number | boolean }) {
  return (
    <div style={{
      width: 180 * size,
      height: 220 * size,
      position: "relative",
      filter: glow ? `drop-shadow(0 0 30px ${ACCENT})` : undefined,
    }}>
      {/* Case body */}
      <div style={{
        position: "absolute",
        top: 0, left: "50%", transform: "translateX(-50%)",
        width: 160 * size, height: 120 * size,
        background: "linear-gradient(145deg, #f5f5f7 0%, #d8d8e0 100%)",
        borderRadius: 24 * size,
        border: "2px solid #ffffff44",
      }} />
      {/* Lid line */}
      <div style={{
        position: "absolute",
        top: 58 * size, left: "50%", transform: "translateX(-50%)",
        width: 160 * size, height: 2,
        background: "#aaaab0",
      }} />
      {/* Earbuds inside */}
      <div style={{
        position: "absolute", top: 78 * size, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 16 * size,
      }}>
        {[0, 1].map((i) => (
          <div key={i} style={{
            width: 36 * size, height: 36 * size,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ffffff 0%, #e0e0e8 100%)",
            border: `2px solid ${ACCENT}`,
          }} />
        ))}
      </div>
      {/* LED indicator */}
      <div style={{
        position: "absolute", top: 10 * size, left: "50%", transform: "translateX(-50%)",
        width: 8 * size, height: 8 * size, borderRadius: "50%",
        background: "#4ade80", boxShadow: "0 0 10px #4ade80",
      }} />
    </div>
  );
}

function ProductReveal({ frame }: { frame: number }) {
  const fps = useVideoConfig().fps;
  const localFrame = frame - 60;
  if (localFrame < -10) return null;

  const enter = spring({ frame: localFrame, fps, config: { damping: 13, stiffness: 70 } });
  const y = interpolate(enter, [0, 1], [60, 0]);
  const opacity = interpolate(frame, [55, 75, 165, 180], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rotate = interpolate(localFrame, [0, 110], [0, 8], { extrapolateRight: "clamp" });
  const float = Math.sin(frame * 0.08) * 8;

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity,
    }}>
      <div style={{ transform: `translateY(${y + float}px) rotate(${rotate}deg)` }}>
        <EarbudIcon size={1.6} />
      </div>
      <div style={{
        marginTop: 30, fontSize: 32, fontWeight: 700, color: "white",
        fontFamily: "Arial, sans-serif",
      }}>
        Meet AURA Pro
      </div>
      <div style={{ fontSize: 16, color: ACCENT_LIGHT, marginTop: 6, letterSpacing: 2 }}>
        Premium Wireless Earbuds
      </div>
    </div>
  );
}

const FEATURES = [
  { icon: "🔇", title: "Active Noise Cancelling", desc: "Silence the world around you", from: 180, to: 230 },
  { icon: "🔋", title: "30h Battery Life", desc: "Power that lasts all week", from: 230, to: 280 },
  { icon: "💧", title: "Waterproof IPX7", desc: "Built for every workout", from: 280, to: 330 },
];

function FeatureCallouts({ frame }: { frame: number }) {
  return (
    <>
      {FEATURES.map((f, i) => {
        const local = frame - f.from;
        if (local < -5 || frame > f.to + 5) return null;
        const opacity = interpolate(frame, [f.from, f.from + 12, f.to - 5, f.to], [0, 1, 1, 0], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const x = interpolate(local, [0, 15], [-40, 0], { extrapolateRight: "clamp" });

        return (
          <div key={i} style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) translateX(${x}px)`,
            opacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 80, marginBottom: 20 }}>{f.icon}</div>
            <div style={{ fontSize: 38, fontWeight: 700, color: "white", fontFamily: "Arial, sans-serif" }}>
              {f.title}
            </div>
            <div style={{ fontSize: 18, color: ACCENT_LIGHT, marginTop: 10 }}>
              {f.desc}
            </div>
          </div>
        );
      })}
    </>
  );
}

function CallToAction({ frame }: { frame: number }) {
  const fps = useVideoConfig().fps;
  const local = frame - 330;
  if (local < -10) return null;

  const enter = spring({ frame: local, fps, config: { damping: 14, stiffness: 90 } });
  const opacity = interpolate(frame, [330, 345], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(frame * 0.15) * 0.04;

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity,
      transform: `scale(${interpolate(enter, [0, 1], [0.85, 1])})`,
    }}>
      <EarbudIcon size={0.9} />
      <div style={{ fontSize: 44, fontWeight: 800, color: "white", marginTop: 20, fontFamily: "Arial, sans-serif" }}>
        AURA Pro
      </div>
      <div style={{ fontSize: 22, color: ACCENT_LIGHT, marginTop: 4 }}>
        $129 — Available Now
      </div>
      <div style={{
        marginTop: 30,
        padding: "16px 48px",
        background: ACCENT,
        borderRadius: 30,
        color: "white",
        fontSize: 20,
        fontWeight: 700,
        boxShadow: `0 0 30px ${ACCENT}`,
        transform: `scale(${pulse})`,
      }}>
        Shop Now
      </div>
    </div>
  );
}

export const ProductShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1280, height: 720, overflow: "hidden", position: "relative" }}>
      <Background />
      <Logo frame={frame} />
      <ProductReveal frame={frame} />
      <FeatureCallouts frame={frame} />
      <CallToAction frame={frame} />
    </div>
  );
};
