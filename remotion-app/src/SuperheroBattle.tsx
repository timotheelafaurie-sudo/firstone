import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const HERO_SIZE = 80;

function useSpring(frame: number, from: number, config?: object) {
  const fps = useVideoConfig().fps;
  return spring({ frame: frame - from, fps, config: { damping: 12, stiffness: 80, ...config } });
}

function Background({ frame }: { frame: number }) {
  const shake = frame > 180 && frame < 220 ? Math.sin(frame * 1.5) * 6 : 0;
  const flashOpacity = interpolate(frame, [180, 185, 195, 200], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flash2Opacity = interpolate(frame, [310, 315, 325, 330], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${shake}px, ${shake / 2}px)` }}>
      {/* Sky gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #0a0020 0%, #1a0040 40%, #2d0060 70%, #0d0030 100%)",
      }} />
      {/* Stars */}
      {[...Array(60)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 37 + 13) % 100}%`,
          top: `${(i * 53 + 7) % 60}%`,
          width: i % 5 === 0 ? 3 : 1.5,
          height: i % 5 === 0 ? 3 : 1.5,
          borderRadius: "50%",
          background: "white",
          opacity: 0.4 + (i % 3) * 0.2,
        }} />
      ))}
      {/* City skyline */}
      {[0.05, 0.12, 0.2, 0.28, 0.35, 0.5, 0.58, 0.65, 0.72, 0.8, 0.88, 0.95].map((x, i) => (
        <div key={i} style={{
          position: "absolute",
          bottom: 60,
          left: `${x * 100}%`,
          width: 40 + (i % 4) * 20,
          height: 80 + (i % 5) * 60,
          background: i % 3 === 0 ? "#1a1a3e" : "#12122a",
          border: "1px solid #2a2a5e",
        }}>
          {[...Array(3)].map((_, j) => (
            <div key={j} style={{
              position: "absolute",
              top: 8 + j * 18,
              left: 6,
              right: 6,
              height: 8,
              background: Math.random() > 0.5 ? "#ffdd44" : "transparent",
              opacity: 0.6,
            }} />
          ))}
        </div>
      ))}
      {/* Ground */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
        background: "linear-gradient(180deg, #1a0030 0%, #0a0020 100%)",
        borderTop: "2px solid #4400aa",
        boxShadow: "0 -4px 20px #6600cc",
      }} />
      {/* Flash effects */}
      <div style={{ position: "absolute", inset: 0, background: "white", opacity: flashOpacity, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "white", opacity: flash2Opacity, pointerEvents: "none" }} />
    </div>
  );
}

function Hero({ frame, side, color, glowColor }: {
  frame: number;
  side: "left" | "right";
  color: string;
  glowColor: string;
}) {
  const fps = useVideoConfig().fps;
  const dir = side === "left" ? 1 : -1;
  const startX = side === "left" ? -200 : 1480;
  const centerX = side === "left" ? 380 : 900;
  const fightX = side === "left" ? 480 : 800;
  const finalX = side === "left" ? 200 : 1080;

  // Phase 1: fly in (0-60)
  const flyIn = interpolate(frame, [0, 60], [startX, centerX], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 2: charge toward each other (60-90)
  const charge = interpolate(frame, [60, 90], [centerX, fightX], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 3: fight in center (90-300) - oscillate
  const fightOscillate = fightX + Math.sin(frame * 0.15) * 30 * dir;

  // Phase 4: knockback (300-360)
  const knockback = interpolate(frame, [300, 340], [fightX, finalX], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 5: final charge (360-420)
  const finalCharge = interpolate(frame, [360, 400], [finalX, 640 - HERO_SIZE / 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  let x = flyIn;
  if (frame >= 60 && frame < 90) x = charge;
  else if (frame >= 90 && frame < 300) x = fightOscillate;
  else if (frame >= 300 && frame < 360) x = knockback;
  else if (frame >= 360) x = finalCharge;

  const y = 720 / 2 - HERO_SIZE - 30;
  const flyY = interpolate(frame, [0, 40, 60], [-80, y - 40, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const punchRotation = frame >= 90 && frame < 300
    ? Math.sin(frame * 0.3 + (side === "right" ? Math.PI : 0)) * 15
    : 0;

  const hitShake = frame >= 90 && frame < 300 && frame % 10 < 3
    ? Math.sin(frame * 5) * 4
    : 0;

  const opacity = frame >= 410 ? interpolate(frame, [410, 445], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

  const scaleKnockback = frame >= 300 && frame < 360
    ? interpolate(frame, [300, 320], [1, 1.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  return (
    <div style={{
      position: "absolute",
      left: x + hitShake,
      top: frame < 60 ? flyY : y,
      width: HERO_SIZE,
      height: HERO_SIZE * 1.6,
      opacity,
      transform: `scaleX(${-dir}) scale(${scaleKnockback}) rotate(${punchRotation}deg)`,
      filter: `drop-shadow(0 0 16px ${glowColor}) drop-shadow(0 0 32px ${glowColor})`,
    }}>
      {/* Cape */}
      <div style={{
        position: "absolute",
        top: 20,
        left: side === "left" ? -10 : HERO_SIZE - 10,
        width: 30,
        height: 70,
        background: `linear-gradient(180deg, ${color} 0%, transparent 100%)`,
        transform: `skewY(${Math.sin(frame * 0.2) * 10}deg)`,
        opacity: 0.8,
        borderRadius: "0 0 15px 15px",
      }} />
      {/* Body */}
      <div style={{
        position: "absolute",
        top: 24,
        left: 12,
        width: HERO_SIZE - 24,
        height: 50,
        background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
        borderRadius: 8,
        border: `2px solid ${glowColor}`,
      }}>
        {/* Chest emblem */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 20,
          height: 20,
          background: glowColor,
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          opacity: 0.9,
        }} />
      </div>
      {/* Head */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 18,
        width: HERO_SIZE - 36,
        height: HERO_SIZE - 36,
        background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
        borderRadius: "50% 50% 40% 40%",
        border: `2px solid ${glowColor}`,
      }}>
        {/* Mask eyes */}
        <div style={{ position: "absolute", top: "40%", left: "15%", right: "15%", display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: 10, height: 6, background: glowColor, borderRadius: 3, boxShadow: `0 0 8px ${glowColor}` }} />
          <div style={{ width: 10, height: 6, background: glowColor, borderRadius: 3, boxShadow: `0 0 8px ${glowColor}` }} />
        </div>
      </div>
      {/* Legs */}
      <div style={{ position: "absolute", top: 74, left: 12, width: 22, height: 54, background: color, borderRadius: "0 0 6px 6px", border: `1px solid ${glowColor}` }} />
      <div style={{ position: "absolute", top: 74, left: HERO_SIZE - 34, width: 22, height: 54, background: color, borderRadius: "0 0 6px 6px", border: `1px solid ${glowColor}` }} />
      {/* Fist punch arm */}
      <div style={{
        position: "absolute",
        top: 34,
        left: side === "left" ? HERO_SIZE - 8 : -20,
        width: 28,
        height: 14,
        background: color,
        borderRadius: 7,
        border: `1px solid ${glowColor}`,
        transform: `translateX(${Math.sin(frame * 0.4) * 8}px)`,
      }} />
    </div>
  );
}

function EnergyClash({ frame }: { frame: number }) {
  if (frame < 85 || frame > 300) return null;

  const opacity = interpolate(frame, [85, 95, 290, 300], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(frame * 0.5) * 0.3;
  const sparks = [...Array(12)].map((_, i) => ({
    angle: (i / 12) * 360 + frame * 3,
    dist: 30 + Math.sin(frame * 0.2 + i) * 20,
  }));

  return (
    <div style={{ position: "absolute", left: 640 - 60, top: 720 / 2 - HERO_SIZE - 30 + 20, width: 120, height: 80, opacity }}>
      {/* Core explosion */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: `translate(-50%, -50%) scale(${pulse})`,
        width: 80, height: 80,
        background: "radial-gradient(circle, white 0%, #ffdd44 40%, #ff6600 70%, transparent 100%)",
        borderRadius: "50%",
        boxShadow: "0 0 40px #ffaa00, 0 0 80px #ff6600",
      }} />
      {/* Sparks */}
      {sparks.map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          top: "50%", left: "50%",
          width: 4, height: 4,
          background: i % 2 === 0 ? "#ff4400" : "#4488ff",
          borderRadius: "50%",
          transform: `translate(-50%, -50%) rotate(${s.angle}deg) translateX(${s.dist}px)`,
          boxShadow: `0 0 6px ${i % 2 === 0 ? "#ff4400" : "#4488ff"}`,
        }} />
      ))}
    </div>
  );
}

function FinalExplosion({ frame }: { frame: number }) {
  if (frame < 400) return null;
  const progress = interpolate(frame, [400, 450], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const size = interpolate(progress, [0, 0.5, 1], [0, 800, 1400]);
  const opacity = interpolate(progress, [0, 0.1, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div style={{
      position: "absolute",
      left: 640 - size / 2,
      top: 360 - size / 2,
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, white 0%, #ffdd44 20%, #ff6600 50%, #aa00ff 80%, transparent 100%)`,
      opacity,
      pointerEvents: "none",
    }} />
  );
}

function EnergyBeam({ frame, side }: { frame: number; side: "left" | "right" }) {
  const active = frame >= 120 && frame < 180;
  if (!active) return null;

  const opacity = interpolate(frame, [120, 130, 170, 180], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const color = side === "left" ? "#ff4400" : "#4488ff";
  const fromX = side === "left" ? 460 : 820;
  const width = side === "left" ? 180 : 180;

  return (
    <div style={{
      position: "absolute",
      left: fromX,
      top: 720 / 2 - HERO_SIZE - 30 + 38,
      width,
      height: 12,
      background: `linear-gradient(${side === "left" ? "90deg" : "270deg"}, ${color}, transparent)`,
      opacity,
      boxShadow: `0 0 20px ${color}`,
      borderRadius: 6,
    }} />
  );
}

function HitText({ frame }: { frame: number }) {
  const hits: { frame: number; text: string; x: number; color: string }[] = [
    { frame: 110, text: "POW!", x: 580, color: "#ffdd44" },
    { frame: 160, text: "SMASH!", x: 520, color: "#ff4444" },
    { frame: 220, text: "BOOM!", x: 560, color: "#44aaff" },
    { frame: 270, text: "CRACK!", x: 540, color: "#ff8800" },
  ];

  return (
    <>
      {hits.map((h, i) => {
        const age = frame - h.frame;
        if (age < 0 || age > 30) return null;
        const opacity = interpolate(age, [0, 5, 25, 30], [0, 1, 1, 0]);
        const scale = interpolate(age, [0, 5], [0.3, 1], { extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute",
            left: h.x,
            top: 220 + Math.sin(i) * 30,
            fontSize: 48,
            fontWeight: 900,
            fontFamily: "Impact, Arial Black, sans-serif",
            color: h.color,
            opacity,
            transform: `scale(${scale}) rotate(${(i % 2 === 0 ? 1 : -1) * 8}deg)`,
            textShadow: `0 0 20px ${h.color}, 2px 2px 0 black`,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}>
            {h.text}
          </div>
        );
      })}
    </>
  );
}

function Title({ frame }: { frame: number }) {
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const endOpacity = interpolate(frame, [60, 80], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finalOpacity = interpolate(frame, [420, 435], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        opacity: Math.min(opacity, endOpacity),
      }}>
        <div style={{
          fontSize: 80,
          fontWeight: 900,
          fontFamily: "Impact, Arial Black, sans-serif",
          color: "white",
          textShadow: "0 0 40px #aa00ff, 0 0 80px #6600cc, 4px 4px 0 black",
          letterSpacing: 8,
        }}>
          HERO CLASH
        </div>
        <div style={{
          fontSize: 24,
          fontFamily: "Arial, sans-serif",
          color: "#aa88ff",
          letterSpacing: 4,
          textShadow: "0 0 10px #8800ff",
        }}>
          THE ULTIMATE BATTLE
        </div>
      </div>
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        opacity: finalOpacity,
      }}>
        <div style={{
          fontSize: 80,
          fontWeight: 900,
          fontFamily: "Impact, Arial Black, sans-serif",
          color: "white",
          textShadow: "0 0 40px #ffaa00, 0 0 80px #ff6600, 4px 4px 0 black",
        }}>
          DRAW!
        </div>
      </div>
    </>
  );
}

export const SuperheroBattle: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1280, height: 720, overflow: "hidden", position: "relative", fontFamily: "sans-serif" }}>
      <Background frame={frame} />
      <EnergyBeam frame={frame} side="left" />
      <EnergyBeam frame={frame} side="right" />
      <EnergyClash frame={frame} />
      <Hero frame={frame} side="left" color="#cc1111" glowColor="#ff4444" />
      <Hero frame={frame} side="right" color="#1144cc" glowColor="#4488ff" />
      <HitText frame={frame} />
      <FinalExplosion frame={frame} />
      <Title frame={frame} />
    </div>
  );
};
