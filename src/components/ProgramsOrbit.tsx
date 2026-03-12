import { motion } from "framer-motion";
import { Brain, Clock, Rocket, Code } from "lucide-react";

const orbitItems = [
  { label: "Bubble", emoji: "🫧", color: "from-blue-400 to-blue-600" },
  { label: "n8n", emoji: "⚡", color: "from-orange-400 to-red-500" },
  { label: "OpenAI", emoji: "🤖", color: "from-emerald-400 to-teal-600" },
  { label: "Copilot", emoji: "✨", color: "from-sky-400 to-blue-600" },
  { label: "Gemini", emoji: "💎", color: "from-violet-400 to-purple-600" },
  { label: "ElevenLabs", emoji: "🎙️", color: "from-pink-400 to-rose-600" },
];

const ORBIT_RADIUS = 170;

export const ProgramsOrbit = () => {
  const radius = ORBIT_RADIUS;
  return (
    <div className="relative hidden lg:flex flex-col items-center justify-center min-h-[400px] w-full">

      {/* Core Glowing Orb System */}
      <div className="relative w-64 h-64 flex items-center justify-center">

        {/* Outer Ambient Glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-blue-500/30 rounded-full blur-[60px]"
        />

        {/* 3D Rotating Rings */}
        <motion.div
          animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-t border-l border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          style={{ transformStyle: "preserve-3d" }}
        />
        <motion.div
          animate={{ rotateX: [360, 0], rotateZ: [0, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 rounded-full border-b border-r border-purple-400/40 border-dashed shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          style={{ transformStyle: "preserve-3d" }}
        />

        {/* Central Premium Emblem */}
        <motion.div
          animate={{ y: [-10, 10, -10], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 p-[3px] shadow-[0_0_40px_rgba(99,102,241,0.5)]"
        >
          <div className="absolute inset-0 rounded-full bg-white/20 blur-sm mix-blend-overlay" />
          <div className="w-full h-full bg-[#0a192f] rounded-full flex items-center justify-center relative overflow-hidden backdrop-blur-2xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,255,255,0.8)_360deg)]"
            />
            <div className="absolute inset-[2px] bg-[#0f2347] rounded-full flex items-center justify-center">
              <Brain className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            </div>
          </div>
        </motion.div>

        {/* Single rotating container keeps all pills evenly spaced */}
        <motion.div
          className="absolute z-20"
          style={{
            width: radius * 2,
            height: radius * 2,
            top: "50%",
            left: "50%",
            marginTop: -radius,
            marginLeft: -radius,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {orbitItems.map((item, i) => {
            const angle = (360 / orbitItems.length) * i;
            const rad = (angle * Math.PI) / 180;
            const x = radius + Math.cos(rad) * radius - 40;
            const y = radius + Math.sin(rad) * radius - 14;

            return (
              <motion.div
                key={item.label}
                className="absolute"
                style={{ left: x, top: y }}
                // Counter-rotate so text stays upright
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${item.color} shadow-lg shadow-black/20 cursor-pointer backdrop-blur-sm border border-white/20`}
                >
                  <span className="text-sm">{item.emoji}</span>
                  <span className="text-white font-semibold text-xs whitespace-nowrap tracking-wide">
                    {item.label}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Orbit track ring (visual guide) */}
        <div
          className="absolute rounded-full border border-white/[0.06] pointer-events-none"
          style={{
            width: 170 * 2,
            height: 170 * 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Second faint orbit track */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute rounded-full border border-dashed border-white/[0.04] pointer-events-none"
          style={{
            width: 170 * 2 + 30,
            height: 170 * 2 + 30,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Floating Info Cards */}
      <motion.div
        initial={{ opacity: 0, x: 40, y: -40 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
        whileHover={{ scale: 1.1, y: -5 }}
        className="absolute top-[2%] -right-[5%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 cursor-pointer group z-30"
      >
        <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-xl shadow-inner group-hover:rotate-12 transition-transform">
          <Clock className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-xs tracking-wide">Flexible Pacing</p>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-emerald-100/70 text-[10px] text-left">Learn at your speed</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50, y: 40 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
        whileHover={{ scale: 1.1, y: -5 }}
        className="absolute bottom-[5%] -left-[10%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 cursor-pointer group z-30"
      >
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-2 rounded-xl shadow-inner group-hover:-rotate-12 transition-transform">
          <Rocket className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-xs tracking-wide">Real-world Projects</p>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <p className="text-purple-100/70 text-[10px] text-left">Deploy immediately</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100, delay: 0.7 }}
        whileHover={{ scale: 1.1, y: -5 }}
        className="absolute -bottom-[5%] right-[5%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 cursor-pointer group z-30"
      >
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-xl shadow-inner group-hover:rotate-180 transition-transform duration-500">
          <Code className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-xs tracking-wide">Modern Stack</p>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <p className="text-blue-100/70 text-[10px] text-left">No-code & AI</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
