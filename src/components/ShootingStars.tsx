import React from "react";

interface MeteorConfig {
  id: number;
  top: string;
  right: string;
  width: string;
  height: string;
  duration: string;
  delay: string;
  depthZ: string;
  colorGradient: string;
  glowColor: string;
  headColor: string;
}

const METEORS: MeteorConfig[] = [
  // --- Tier 1: Bright Foreground Neon Meteors ---
  {
    id: 1,
    top: "-5%",
    right: "10%",
    width: "180px",
    height: "3px",
    duration: "2.4s",
    delay: "0s",
    depthZ: "150px",
    colorGradient: "linear-gradient(90deg, rgba(236,72,153,0) 0%, #ec4899 50%, #ffffff 100%)",
    glowColor: "rgba(236, 72, 153, 1)",
    headColor: "#ffffff",
  },
  {
    id: 2,
    top: "10%",
    right: "60%",
    width: "160px",
    height: "3px",
    duration: "2.2s",
    delay: "0.8s",
    depthZ: "130px",
    colorGradient: "linear-gradient(90deg, rgba(6,182,212,0) 0%, #00f0ff 50%, #ffffff 100%)",
    glowColor: "rgba(0, 240, 255, 1)",
    headColor: "#ffffff",
  },
  {
    id: 3,
    top: "25%",
    right: "15%",
    width: "190px",
    height: "3.5px",
    duration: "2.6s",
    delay: "2.1s",
    depthZ: "170px",
    colorGradient: "linear-gradient(90deg, rgba(245,158,11,0) 0%, #ffb700 50%, #ffffff 100%)",
    glowColor: "rgba(255, 183, 0, 1)",
    headColor: "#ffffff",
  },
  {
    id: 4,
    top: "45%",
    right: "75%",
    width: "170px",
    height: "3px",
    duration: "2.3s",
    delay: "1.4s",
    depthZ: "140px",
    colorGradient: "linear-gradient(90deg, rgba(217,70,239,0) 0%, #d946ef 50%, #ffffff 100%)",
    glowColor: "rgba(217, 70, 239, 1)",
    headColor: "#ffffff",
  },
  {
    id: 5,
    top: "-10%",
    right: "85%",
    width: "175px",
    height: "3px",
    duration: "2.5s",
    delay: "0.4s",
    depthZ: "160px",
    colorGradient: "linear-gradient(90deg, rgba(16,185,129,0) 0%, #00ff88 50%, #ffffff 100%)",
    glowColor: "rgba(0, 255, 136, 1)",
    headColor: "#ffffff",
  },

  // --- Tier 2: Midground Multi-colored Vivid Meteors ---
  {
    id: 6,
    top: "5%",
    right: "35%",
    width: "140px",
    height: "2.5px",
    duration: "3.0s",
    delay: "0.3s",
    depthZ: "40px",
    colorGradient: "linear-gradient(90deg, rgba(239,68,68,0) 0%, #ff2a5f 50%, #ffffff 100%)",
    glowColor: "rgba(255, 42, 95, 0.9)",
    headColor: "#ffe4e6",
  },
  {
    id: 7,
    top: "20%",
    right: "90%",
    width: "150px",
    height: "2.5px",
    duration: "2.8s",
    delay: "1.7s",
    depthZ: "20px",
    colorGradient: "linear-gradient(90deg, rgba(168,85,247,0) 0%, #a855f7 50%, #ffffff 100%)",
    glowColor: "rgba(168, 85, 247, 0.9)",
    headColor: "#f3e8ff",
  },
  {
    id: 8,
    top: "35%",
    right: "45%",
    width: "135px",
    height: "2.5px",
    duration: "3.2s",
    delay: "2.9s",
    depthZ: "0px",
    colorGradient: "linear-gradient(90deg, rgba(249,115,22,0) 0%, #ff5e00 50%, #ffffff 100%)",
    glowColor: "rgba(255, 94, 0, 0.9)",
    headColor: "#ffedd5",
  },
  {
    id: 9,
    top: "50%",
    right: "20%",
    width: "145px",
    height: "2.5px",
    duration: "2.7s",
    delay: "1.1s",
    depthZ: "50px",
    colorGradient: "linear-gradient(90deg, rgba(59,130,246,0) 0%, #3b82f6 50%, #ffffff 100%)",
    glowColor: "rgba(59, 130, 246, 0.9)",
    headColor: "#dbeafe",
  },
  {
    id: 10,
    top: "65%",
    right: "65%",
    width: "155px",
    height: "2.5px",
    duration: "3.1s",
    delay: "3.5s",
    depthZ: "10px",
    colorGradient: "linear-gradient(90deg, rgba(234,179,8,0) 0%, #facc15 50%, #ffffff 100%)",
    glowColor: "rgba(250, 204, 21, 0.9)",
    headColor: "#fef9c3",
  },

  // --- Tier 3: Lower Canvas & Deep Space Meteors ---
  {
    id: 11,
    top: "0%",
    right: "-5%",
    width: "165px",
    height: "2.5px",
    duration: "2.9s",
    delay: "1.5s",
    depthZ: "30px",
    colorGradient: "linear-gradient(90deg, rgba(20,184,166,0) 0%, #14b8a6 50%, #ffffff 100%)",
    glowColor: "rgba(20, 184, 166, 0.9)",
    headColor: "#ccfbf1",
  },
  {
    id: 12,
    top: "15%",
    right: "25%",
    width: "125px",
    height: "2px",
    duration: "3.5s",
    delay: "0.2s",
    depthZ: "-100px",
    colorGradient: "linear-gradient(90deg, rgba(236,72,153,0) 0%, #f472b6 60%, #ffffff 100%)",
    glowColor: "rgba(244, 114, 182, 0.8)",
    headColor: "#ffffff",
  },
  {
    id: 13,
    top: "30%",
    right: "70%",
    width: "130px",
    height: "2px",
    duration: "3.4s",
    delay: "2.3s",
    depthZ: "-80px",
    colorGradient: "linear-gradient(90deg, rgba(56,189,248,0) 0%, #38bdf8 60%, #ffffff 100%)",
    glowColor: "rgba(56, 189, 248, 0.8)",
    headColor: "#ffffff",
  },
  {
    id: 14,
    top: "40%",
    right: "0%",
    width: "140px",
    height: "2px",
    duration: "3.2s",
    delay: "3.8s",
    depthZ: "-60px",
    colorGradient: "linear-gradient(90deg, rgba(168,85,247,0) 0%, #c084fc 60%, #ffffff 100%)",
    glowColor: "rgba(192, 132, 252, 0.8)",
    headColor: "#ffffff",
  },
  {
    id: 15,
    top: "55%",
    right: "40%",
    width: "135px",
    height: "2.2px",
    duration: "3.0s",
    delay: "0.6s",
    depthZ: "-40px",
    colorGradient: "linear-gradient(90deg, rgba(52,211,153,0) 0%, #34d399 60%, #ffffff 100%)",
    glowColor: "rgba(52, 211, 153, 0.8)",
    headColor: "#ffffff",
  },
  {
    id: 16,
    top: "70%",
    right: "10%",
    width: "150px",
    height: "2.5px",
    duration: "2.6s",
    delay: "1.9s",
    depthZ: "20px",
    colorGradient: "linear-gradient(90deg, rgba(244,63,94,0) 0%, #fb7185 60%, #ffffff 100%)",
    glowColor: "rgba(251, 113, 133, 0.9)",
    headColor: "#ffffff",
  },
  {
    id: 17,
    top: "75%",
    right: "80%",
    width: "145px",
    height: "2.2px",
    duration: "3.1s",
    delay: "2.7s",
    depthZ: "-30px",
    colorGradient: "linear-gradient(90deg, rgba(250,204,21,0) 0%, #fde047 60%, #ffffff 100%)",
    glowColor: "rgba(253, 224, 71, 0.8)",
    headColor: "#ffffff",
  },
  {
    id: 18,
    top: "12%",
    right: "48%",
    width: "160px",
    height: "3px",
    duration: "2.3s",
    delay: "1.0s",
    depthZ: "110px",
    colorGradient: "linear-gradient(90deg, rgba(147,51,234,0) 0%, #c084fc 50%, #ffffff 100%)",
    glowColor: "rgba(192, 132, 252, 1)",
    headColor: "#ffffff",
  },
  {
    id: 19,
    top: "28%",
    right: "82%",
    width: "170px",
    height: "3px",
    duration: "2.5s",
    delay: "3.1s",
    depthZ: "125px",
    colorGradient: "linear-gradient(90deg, rgba(6,182,212,0) 0%, #22d3ee 50%, #ffffff 100%)",
    glowColor: "rgba(34, 211, 238, 1)",
    headColor: "#ffffff",
  },
  {
    id: 20,
    top: "60%",
    right: "95%",
    width: "140px",
    height: "2.2px",
    duration: "3.3s",
    delay: "0.5s",
    depthZ: "-50px",
    colorGradient: "linear-gradient(90deg, rgba(236,72,153,0) 0%, #f472b6 50%, #ffffff 100%)",
    glowColor: "rgba(244, 114, 182, 0.85)",
    headColor: "#ffffff",
  },
];

export const ShootingStars: React.FC = () => {
  return (
    <div className="perspective-container fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {METEORS.map((m) => (
        <div
          key={m.id}
          className="animate-meteor-3d absolute rounded-full"
          style={{
            top: m.top,
            right: m.right,
            width: m.width,
            height: m.height,
            background: m.colorGradient,
            boxShadow: `0 0 8px ${m.glowColor}, 0 0 18px ${m.glowColor}, 0 0 32px ${m.glowColor}`,
            animationDuration: m.duration,
            animationDelay: m.delay,
            ["--star-z" as any]: m.depthZ,
          }}
        >
          {/* Intense Glowing Core Head */}
          <div
            className="meteor-head absolute right-0 top-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: "5px",
              height: "5px",
              backgroundColor: m.headColor,
              boxShadow: `0 0 10px #ffffff, 0 0 20px ${m.glowColor}, 0 0 35px ${m.glowColor}`,
            }}
          />
        </div>
      ))}
    </div>
  );
};
