import React from "react";

interface MeteorConfig {
  id: number;
  top: string;
  right: string;
  width: string;
  height: string;
  duration: string;
  delay: string;
  depthZ: string; // e.g. "150px", "0px", "-200px"
  colorGradient: string;
  glowColor: string;
  headColor: string;
}

const METEORS: MeteorConfig[] = [
  // Foreground 3D Tier (Large, Fast, High Z)
  {
    id: 1,
    top: "-5%",
    right: "10%",
    width: "140px",
    height: "2.5px",
    duration: "2.8s",
    delay: "0s",
    depthZ: "140px",
    colorGradient: "linear-gradient(90deg, rgba(236,72,153,0) 0%, #ec4899 50%, #ffffff 100%)",
    glowColor: "rgba(236, 72, 153, 0.9)",
    headColor: "#ffffff",
  },
  {
    id: 2,
    top: "15%",
    right: "55%",
    width: "130px",
    height: "2.5px",
    duration: "2.5s",
    delay: "1.2s",
    depthZ: "120px",
    colorGradient: "linear-gradient(90deg, rgba(6,182,212,0) 0%, #06b6d4 50%, #ffffff 100%)",
    glowColor: "rgba(6, 182, 212, 0.9)",
    headColor: "#ffffff",
  },
  {
    id: 3,
    top: "35%",
    right: "20%",
    width: "150px",
    height: "2.5px",
    duration: "3.1s",
    delay: "3.4s",
    depthZ: "160px",
    colorGradient: "linear-gradient(90deg, rgba(245,158,11,0) 0%, #f59e0b 50%, #ffffff 100%)",
    glowColor: "rgba(245, 158, 11, 0.9)",
    headColor: "#ffffff",
  },
  {
    id: 4,
    top: "55%",
    right: "70%",
    width: "135px",
    height: "2.5px",
    duration: "2.7s",
    delay: "2.1s",
    depthZ: "130px",
    colorGradient: "linear-gradient(90deg, rgba(217,70,239,0) 0%, #d946ef 50%, #ffffff 100%)",
    glowColor: "rgba(217, 70, 239, 0.9)",
    headColor: "#ffffff",
  },

  // Midground 3D Tier (Medium, Normal Z)
  {
    id: 5,
    top: "5%",
    right: "35%",
    width: "100px",
    height: "2px",
    duration: "3.4s",
    delay: "0.6s",
    depthZ: "20px",
    colorGradient: "linear-gradient(90deg, rgba(16,185,129,0) 0%, #10b981 50%, #e0e7ff 100%)",
    glowColor: "rgba(16, 185, 129, 0.8)",
    headColor: "#d1fae5",
  },
  {
    id: 6,
    top: "25%",
    right: "80%",
    width: "110px",
    height: "2px",
    duration: "3.2s",
    delay: "2.8s",
    depthZ: "0px",
    colorGradient: "linear-gradient(90deg, rgba(168,85,247,0) 0%, #a855f7 50%, #ffffff 100%)",
    glowColor: "rgba(168, 85, 247, 0.8)",
    headColor: "#f3e8ff",
  },
  {
    id: 7,
    top: "45%",
    right: "40%",
    width: "95px",
    height: "2px",
    duration: "3.6s",
    delay: "4.2s",
    depthZ: "-10px",
    colorGradient: "linear-gradient(90deg, rgba(244,63,94,0) 0%, #f43f5e 50%, #ffffff 100%)",
    glowColor: "rgba(244, 63, 94, 0.8)",
    headColor: "#ffe4e6",
  },
  {
    id: 8,
    top: "65%",
    right: "15%",
    width: "105px",
    height: "2px",
    duration: "3.0s",
    delay: "1.7s",
    depthZ: "30px",
    colorGradient: "linear-gradient(90deg, rgba(59,130,246,0) 0%, #3b82f6 50%, #ffffff 100%)",
    glowColor: "rgba(59, 130, 246, 0.8)",
    headColor: "#dbeafe",
  },

  // Deep Space 3D Tier (Small, Micro, Negative Z, Slower)
  {
    id: 9,
    top: "0%",
    right: "75%",
    width: "60px",
    height: "1.2px",
    duration: "4.2s",
    delay: "1.9s",
    depthZ: "-180px",
    colorGradient: "linear-gradient(90deg, rgba(236,72,153,0) 0%, #f472b6 60%, #ffffff 100%)",
    glowColor: "rgba(244, 114, 182, 0.6)",
    headColor: "#ffffff",
  },
  {
    id: 10,
    top: "20%",
    right: "25%",
    width: "70px",
    height: "1.2px",
    duration: "4.5s",
    delay: "0.3s",
    depthZ: "-220px",
    colorGradient: "linear-gradient(90deg, rgba(56,189,248,0) 0%, #38bdf8 60%, #ffffff 100%)",
    glowColor: "rgba(56, 189, 248, 0.6)",
    headColor: "#ffffff",
  },
  {
    id: 11,
    top: "40%",
    right: "90%",
    width: "65px",
    height: "1.2px",
    duration: "4.0s",
    delay: "3.8s",
    depthZ: "-150px",
    colorGradient: "linear-gradient(90deg, rgba(250,204,21,0) 0%, #facc15 60%, #ffffff 100%)",
    glowColor: "rgba(250, 204, 21, 0.6)",
    headColor: "#ffffff",
  },
  {
    id: 12,
    top: "60%",
    right: "45%",
    width: "75px",
    height: "1.2px",
    duration: "4.3s",
    delay: "2.5s",
    depthZ: "-200px",
    colorGradient: "linear-gradient(90deg, rgba(192,132,252,0) 0%, #c084fc 60%, #ffffff 100%)",
    glowColor: "rgba(192, 132, 252, 0.6)",
    headColor: "#ffffff",
  },
  {
    id: 13,
    top: "75%",
    right: "80%",
    width: "80px",
    height: "1.5px",
    duration: "3.8s",
    delay: "0.9s",
    depthZ: "-120px",
    colorGradient: "linear-gradient(90deg, rgba(52,211,153,0) 0%, #34d399 60%, #ffffff 100%)",
    glowColor: "rgba(52, 211, 153, 0.6)",
    headColor: "#ffffff",
  },
];

export const ShootingStars: React.FC = () => {
  return (
    <div className="perspective-container fixed inset-0 pointer-events-none z-0 overflow-hidden">
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
            boxShadow: `0 0 6px ${m.glowColor}, 0 0 14px ${m.glowColor}, 0 0 24px ${m.glowColor}`,
            animationDuration: m.duration,
            animationDelay: m.delay,
            ["--star-z" as any]: m.depthZ,
          }}
        >
          {/* Intense Glowing Core Head */}
          <div
            className="meteor-head absolute right-0 top-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: "4px",
              height: "4px",
              backgroundColor: m.headColor,
              boxShadow: `0 0 8px #ffffff, 0 0 16px ${m.glowColor}, 0 0 28px ${m.glowColor}`,
            }}
          />
        </div>
      ))}
    </div>
  );
};
