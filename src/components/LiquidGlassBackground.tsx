import React, { useEffect, useState } from "react";

interface GlassBlobProps {
  size: number;
  top: string;
  left?: string;
  right?: string;
  bottom?: string;
  animationClass: string;
  delay?: string;
  duration?: string;
  opacity?: number;
  highlightPosition?: "top-left" | "top-right";
  hasRing?: boolean;
}

export const LiquidGlassBackground: React.FC = () => {
  // Gentle mouse parallax effect for ultra-realistic liquid feel
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse between -1 and 1
      const normalizedX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normalizedY = (e.clientY / window.innerHeight - 0.5) * 2;

      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x: normalizedX, y: normalizedY });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      id="liquid-glass-background-layer"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* 🌊 Ambient Light Green & Mint Caustic Fluid Glows */}
      <div 
        className="absolute top-[-10%] left-[10%] w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] rounded-full bg-gradient-to-br from-emerald-200/40 via-teal-100/50 to-emerald-300/30 blur-[130px] transition-transform duration-1000 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * -20}px, ${mousePos.y * -20}px, 0)`,
        }}
      />
      
      <div 
        className="absolute top-[30%] right-[-5%] w-[650px] sm:w-[900px] h-[650px] sm:h-[900px] rounded-full bg-gradient-to-bl from-teal-200/40 via-lime-100/45 to-emerald-200/35 blur-[150px] transition-transform duration-1000 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * 25}px, ${mousePos.y * 25}px, 0)`,
        }}
      />

      <div 
        className="absolute bottom-[-10%] left-[5%] w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] rounded-full bg-emerald-200/40 blur-[140px] transition-transform duration-1000 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * -15}px, ${mousePos.y * -15}px, 0)`,
        }}
      />

      {/* 💧 Submerged Ripple & Caustics Grid Overlay (Sunlight on clear shallow water) */}
      <div className="absolute inset-0 opacity-[0.22] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_35%,#000_65%,transparent_100%)]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="liquid-water-grid" width="180" height="180" patternUnits="userSpaceOnUse">
              <path d="M 0 90 Q 45 45 90 90 T 180 90 Q 135 135 90 90 T 0 90" fill="none" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" strokeDasharray="4 6" />
              <circle cx="90" cy="90" r="50" fill="none" stroke="rgba(52, 211, 153, 0.3)" strokeWidth="1" />
              <circle cx="90" cy="90" r="22" fill="none" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="1.5" />
              <path d="M 45 0 Q 90 45 45 90 T 45 180" fill="none" stroke="rgba(20, 184, 166, 0.25)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#liquid-water-grid)" />
        </svg>
      </div>

      {/* 🫧 FLOATING LIQUID GLASS ORBS & PRISMS 🫧 */}

      {/* 1. Large Prime Glass Orb - Floating near Top-Left with refractive highlights */}
      <div 
        className="absolute top-[8%] left-[4%] sm:left-[8%] animate-glass-morph-1 transition-transform duration-700 ease-out"
        style={{
          width: "220px",
          height: "210px",
          transform: `translate3d(${mousePos.x * 35}px, ${mousePos.y * 35}px, 0)`,
        }}
      >
        <div className="w-full h-full liquid-glass-sculpture relative">
          {/* Specular high-gloss light catch */}
          <div className="absolute top-[18%] left-[20%] w-[38%] h-[26%] rounded-full bg-gradient-to-br from-white/95 via-white/50 to-transparent blur-[0.5px] rotate-[-25deg]" />
          {/* Subtle secondary bounce reflection */}
          <div className="absolute bottom-[16%] right-[22%] w-[25%] h-[18%] rounded-full bg-emerald-300/30 blur-[2px]" />
          {/* Inner crystal glass nucleus */}
          <div className="absolute inset-[15%] rounded-full border border-white/40 opacity-70" />
        </div>
      </div>

      {/* 2. Sleek Glass Pill / Bubble - Floating Top-Right */}
      <div 
        className="absolute top-[14%] right-[5%] sm:right-[10%] animate-glass-morph-2 transition-transform duration-700 ease-out"
        style={{
          width: "180px",
          height: "170px",
          transform: `translate3d(${mousePos.x * -30}px, ${mousePos.y * -30}px, 0)`,
        }}
      >
        <div className="w-full h-full liquid-glass-sculpture relative">
          <div className="absolute top-[15%] left-[24%] w-[35%] h-[24%] rounded-full bg-gradient-to-br from-white/95 via-white/40 to-transparent blur-[0.5px] rotate-[-20deg]" />
          <div className="absolute bottom-[18%] right-[20%] w-[30%] h-[20%] rounded-full bg-teal-300/25 blur-[1px]" />
        </div>
      </div>

      {/* 3. Mid-size Glass Droplet - Floating Mid-Left behind content */}
      <div 
        className="absolute top-[45%] left-[2%] sm:left-[5%] animate-glass-float-drift transition-transform duration-700 ease-out hidden sm:block"
        style={{
          width: "140px",
          height: "135px",
          transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 20}px, 0)`,
        }}
      >
        <div className="w-full h-full liquid-glass-sculpture relative">
          <div className="absolute top-[16%] left-[22%] w-[40%] h-[26%] rounded-full bg-gradient-to-br from-white/90 via-white/30 to-transparent blur-[0.5px] rotate-[-30deg]" />
          <div className="absolute bottom-[15%] right-[20%] w-[22%] h-[16%] rounded-full bg-emerald-400/25 blur-[1.5px]" />
        </div>
      </div>

      {/* 4. Large Liquid Glass Sphere - Floating Center-Right */}
      <div 
        className="absolute top-[52%] right-[3%] sm:right-[7%] animate-glass-morph-1 transition-transform duration-700 ease-out"
        style={{
          width: "250px",
          height: "240px",
          transform: `translate3d(${mousePos.x * -25}px, ${mousePos.y * -25}px, 0)`,
        }}
      >
        <div className="w-full h-full liquid-glass-sculpture relative">
          <div className="absolute top-[16%] left-[20%] w-[40%] h-[28%] rounded-full bg-gradient-to-br from-white/95 via-white/50 to-transparent blur-[0.8px] rotate-[-28deg]" />
          <div className="absolute bottom-[14%] right-[20%] w-[32%] h-[22%] rounded-full bg-teal-300/30 blur-[2px]" />
          <div className="absolute inset-[12%] rounded-full border border-white/50 opacity-60" />
        </div>
      </div>

      {/* 5. Fluid Glass Droplet - Floating Lower-Left */}
      <div 
        className="absolute bottom-[18%] left-[8%] sm:left-[14%] animate-glass-morph-2 transition-transform duration-700 ease-out"
        style={{
          width: "160px",
          height: "155px",
          transform: `translate3d(${mousePos.x * 28}px, ${mousePos.y * 28}px, 0)`,
        }}
      >
        <div className="w-full h-full liquid-glass-sculpture relative">
          <div className="absolute top-[18%] left-[22%] w-[38%] h-[24%] rounded-full bg-gradient-to-br from-white/90 via-white/40 to-transparent blur-[0.5px] rotate-[-25deg]" />
          <div className="absolute bottom-[18%] right-[20%] w-[25%] h-[18%] rounded-full bg-emerald-300/30 blur-[1px]" />
        </div>
      </div>

      {/* 6. Floating Ambient Micro Glass Beads / Dewdrops for depth */}
      <div 
        className="absolute top-[28%] left-[32%] w-10 h-10 animate-glass-float-slow transition-transform duration-500 ease-out hidden md:block"
        style={{ transform: `translate3d(${mousePos.x * 40}px, ${mousePos.y * 40}px, 0)` }}
      >
        <div className="w-full h-full liquid-glass-bead relative">
          <div className="absolute top-1 left-2 w-3 h-2 rounded-full bg-white/95 blur-[0.3px]" />
        </div>
      </div>

      <div 
        className="absolute top-[22%] right-[30%] w-14 h-14 animate-glass-float-drift transition-transform duration-500 ease-out hidden md:block"
        style={{ transform: `translate3d(${mousePos.x * -45}px, ${mousePos.y * -45}px, 0)` }}
      >
        <div className="w-full h-full liquid-glass-bead relative">
          <div className="absolute top-1.5 left-2.5 w-4 h-2.5 rounded-full bg-white/95 blur-[0.3px]" />
        </div>
      </div>

      <div 
        className="absolute top-[70%] left-[28%] w-12 h-12 animate-glass-float-slow transition-transform duration-500 ease-out hidden lg:block"
        style={{ transform: `translate3d(${mousePos.x * 35}px, ${mousePos.y * 35}px, 0)` }}
      >
        <div className="w-full h-full liquid-glass-bead relative">
          <div className="absolute top-1.5 left-2 w-3 h-2 rounded-full bg-white/95 blur-[0.3px]" />
        </div>
      </div>

      <div 
        className="absolute top-[75%] right-[25%] w-16 h-16 animate-glass-morph-1 transition-transform duration-500 ease-out hidden lg:block"
        style={{ transform: `translate3d(${mousePos.x * -35}px, ${mousePos.y * -35}px, 0)` }}
      >
        <div className="w-full h-full liquid-glass-bead relative">
          <div className="absolute top-2 left-3 w-5 h-3 rounded-full bg-white/95 blur-[0.4px]" />
        </div>
      </div>

    </div>
  );
};
