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

const ORBIT_RADIUS_MOBILE = 110;
const ORBIT_RADIUS_DESKTOP = 170;

export const ProgramsOrbit = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[300px] sm:min-h-[340px] lg:min-h-[400px] w-full">

      {/* Core Glowing Orb System */}
      <div className="relative w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 flex items-center justify-center">

        {/* Outer Ambient Glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-blue-500/30 rounded-full blur-[40px] lg:blur-[60px]"
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
          animate={{ y: [-6, 6, -6], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 p-[3px] shadow-[0_0_30px_rgba(99,102,241,0.5)] lg:shadow-[0_0_40px_rgba(99,102,241,0.5)]"
        >
          <div className="absolute inset-0 rounded-full bg-white/20 blur-sm mix-blend-overlay" />
          <div className="w-full h-full bg-[#0a192f] rounded-full flex items-center justify-center relative overflow-hidden backdrop-blur-2xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,255,255,0.8)_360deg)]"
            />
            <div className="absolute inset-[2px] bg-[#0f2347] rounded-full flex items-center justify-center">
              <Brain className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            </div>
          </div>
        </motion.div>

        {/* Mobile orbit (smaller radius) */}
        <motion.div
          className="absolute z-20 lg:hidden"
          style={{
            width: ORBIT_RADIUS_MOBILE * 2,
            height: ORBIT_RADIUS_MOBILE * 2,
            top: "50%",
            left: "50%",
            marginTop: -ORBIT_RADIUS_MOBILE,
            marginLeft: -ORBIT_RADIUS_MOBILE,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {orbitItems.map((item, i) => {
            const angle = (360 / orbitItems.length) * i;
            const rad = (angle * Math.PI) / 180;
            const x = ORBIT_RADIUS_MOBILE + Math.cos(rad) * ORBIT_RADIUS_MOBILE - 30;
            const y = ORBIT_RADIUS_MOBILE + Math.sin(rad) * ORBIT_RADIUS_MOBILE - 12;

            return (
              <motion.div
                key={item.label}
                className="absolute"
                style={{ left: x, top: y }}
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <motion.div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r ${item.color} shadow-lg shadow-black/20 backdrop-blur-sm border border-white/20`}
                >
                  <span className="text-xs">{item.emoji}</span>
                  <span className="text-white font-semibold text-[10px] whitespace-nowrap tracking-wide">
                    {item.label}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Desktop orbit (larger radius) */}
        <motion.div
          className="absolute z-20 hidden lg:block"
          style={{
            width: ORBIT_RADIUS_DESKTOP * 2,
            height: ORBIT_RADIUS_DESKTOP * 2,
            top: "50%",
            left: "50%",
            marginTop: -ORBIT_RADIUS_DESKTOP,
            marginLeft: -ORBIT_RADIUS_DESKTOP,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {orbitItems.map((item, i) => {
            const angle = (360 / orbitItems.length) * i;
            const rad = (angle * Math.PI) / 180;
            const x = ORBIT_RADIUS_DESKTOP + Math.cos(rad) * ORBIT_RADIUS_DESKTOP - 40;
            const y = ORBIT_RADIUS_DESKTOP + Math.sin(rad) * ORBIT_RADIUS_DESKTOP - 14;

            return (
              <motion.div
                key={item.label}
                className="absolute"
                style={{ left: x, top: y }}
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

        {/* Orbit track ring (visual guide) — mobile */}
        <div
          className="absolute rounded-full border border-white/[0.06] pointer-events-none lg:hidden"
          style={{
            width: ORBIT_RADIUS_MOBILE * 2,
            height: ORBIT_RADIUS_MOBILE * 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        {/* Orbit track ring — desktop */}
        <div
          className="absolute rounded-full border border-white/[0.06] pointer-events-none hidden lg:block"
          style={{
            width: ORBIT_RADIUS_DESKTOP * 2,
            height: ORBIT_RADIUS_DESKTOP * 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Second faint orbit track — mobile */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute rounded-full border border-dashed border-white/[0.04] pointer-events-none lg:hidden"
          style={{
            width: ORBIT_RADIUS_MOBILE * 2 + 20,
            height: ORBIT_RADIUS_MOBILE * 2 + 20,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        {/* Second faint orbit track — desktop */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute rounded-full border border-dashed border-white/[0.04] pointer-events-none hidden lg:block"
          style={{
            width: ORBIT_RADIUS_DESKTOP * 2 + 30,
            height: ORBIT_RADIUS_DESKTOP * 2 + 30,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Floating Info Cards — hidden on mobile to keep layout clean, visible on sm+ */}
      <motion.div
        initial={{ opacity: 0, x: 40, y: -40 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
        whileHover={{ scale: 1.1, y: -5 }}
        className="absolute top-[2%] right-0 sm:-right-[2%] lg:-right-[5%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-2xl hidden sm:flex items-center gap-2 sm:gap-3 cursor-pointer group z-30"
      >
        <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-inner group-hover:rotate-12 transition-transform">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-[10px] sm:text-xs tracking-wide">Flexible Pacing</p>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-emerald-100/70 text-[8px] sm:text-[10px] text-left">Learn at your speed</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50, y: 40 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
        whileHover={{ scale: 1.1, y: -5 }}
        className="absolute bottom-[5%] left-0 sm:-left-[5%] lg:-left-[10%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-2xl hidden sm:flex items-center gap-2 sm:gap-3 cursor-pointer group z-30"
      >
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-inner group-hover:-rotate-12 transition-transform">
          <Rocket className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-[10px] sm:text-xs tracking-wide">Real-world Projects</p>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <p className="text-purple-100/70 text-[8px] sm:text-[10px] text-left">Deploy immediately</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100, delay: 0.7 }}
        whileHover={{ scale: 1.1, y: -5 }}
        className="absolute -bottom-[2%] sm:-bottom-[5%] right-[2%] sm:right-[5%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-2xl hidden sm:flex items-center gap-2 sm:gap-3 cursor-pointer group z-30"
      >
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-inner group-hover:rotate-180 transition-transform duration-500">
          <Code className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-[10px] sm:text-xs tracking-wide">Modern Stack</p>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <p className="text-blue-100/70 text-[8px] sm:text-[10px] text-left">No-code & AI</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
