import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Node {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  description: string;
}

interface Connection {
  from: string;
  to: string;
}

const nodes: Node[] = [
  { id: "idea", label: "Idea", icon: "💡", x: 10, y: 50, description: "Start with any idea" },
  { id: "prompt", label: "AI Prompt", icon: "✨", x: 30, y: 20, description: "Describe what you want" },
  { id: "agent", label: "AI Agent", icon: "🤖", x: 50, y: 55, description: "Automate with n8n & AI" },
  { id: "nocode", label: "No-Code", icon: "🧩", x: 70, y: 25, description: "Build with Bubble & tools" },
  { id: "deploy", label: "Deploy", icon: "🚀", x: 90, y: 50, description: "Ship to the world" },
];

const connections: Connection[] = [
  { from: "idea", to: "prompt" },
  { from: "prompt", to: "agent" },
  { from: "agent", to: "nocode" },
  { from: "nocode", to: "deploy" },
  { from: "idea", to: "agent" },
  { from: "prompt", to: "nocode" },
];

const NodeVisualizer = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [activatedNodes, setActivatedNodes] = useState<Set<string>>(new Set());
  const [particles, setParticles] = useState<{ id: string; from: string; to: string }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 400, h: 300 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const getNodePos = useCallback(
    (node: Node) => ({
      x: (node.x / 100) * dims.w,
      y: (node.y / 100) * dims.h,
    }),
    [dims]
  );

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      setActiveNode(nodeId);
      setActivatedNodes((prev) => {
        const next = new Set(prev);
        next.add(nodeId);
        return next;
      });

      // Fire particles along connected edges
      const connected = connections.filter((c) => c.from === nodeId || c.to === nodeId);
      const newParticles = connected.map((c, i) => ({
        id: `${nodeId}-${i}-${Date.now()}`,
        from: c.from,
        to: c.to,
      }));
      setParticles((prev) => [...prev, ...newParticles]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
        // Activate connected nodes
        connected.forEach((c) => {
          const target = c.from === nodeId ? c.to : c.from;
          setActivatedNodes((prev) => {
            const next = new Set(prev);
            next.add(target);
            return next;
          });
        });
      }, 800);
    },
    []
  );

  const isEdgeActive = (conn: Connection) =>
    activatedNodes.has(conn.from) && activatedNodes.has(conn.to);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-2xl border border-border bg-card/50 overflow-hidden select-none cursor-crosshair"
    >
      {/* Grid background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Connections SVG */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((conn) => {
          const from = getNodePos(nodes.find((n) => n.id === conn.from)!);
          const to = getNodePos(nodes.find((n) => n.id === conn.to)!);
          const active = isEdgeActive(conn);
          return (
            <g key={`${conn.from}-${conn.to}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={active ? "hsl(210, 93%, 36%)" : "hsl(var(--border))"}
                strokeWidth={active ? 2.5 : 1.5}
                strokeDasharray={active ? "none" : "6 4"}
                className="transition-all duration-500"
              />
              {active && (
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="hsl(210, 93%, 50%)"
                  strokeWidth={1}
                  className="opacity-50"
                  filter="url(#glow)"
                />
              )}
            </g>
          );
        })}

        {/* Particles */}
        {particles.map((p) => {
          const from = getNodePos(nodes.find((n) => n.id === p.from)!);
          const to = getNodePos(nodes.find((n) => n.id === p.to)!);
          return (
            <motion.circle
              key={p.id}
              r={4}
              fill="hsl(210, 93%, 50%)"
              filter="url(#glow)"
              initial={{ cx: from.x, cy: from.y, opacity: 1 }}
              animate={{ cx: to.x, cy: to.y, opacity: 0.3 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          );
        })}

        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Nodes */}
      {nodes.map((node) => {
        const pos = getNodePos(node);
        const isActive = activatedNodes.has(node.id);
        const isHovered = activeNode === node.id;
        return (
          <motion.div
            key={node.id}
            className="absolute flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2"
            style={{ left: pos.x, top: pos.y }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNodeClick(node.id)}
          >
            <motion.div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl cursor-pointer border-2 transition-all duration-300 ${
                isActive
                  ? "bg-primary/20 border-primary shadow-[0_0_20px_hsl(210_93%_36%/0.4)]"
                  : "bg-card border-border hover:border-primary/50"
              }`}
              animate={
                isActive
                  ? { boxShadow: ["0 0 15px hsl(210 93% 36% / 0.3)", "0 0 30px hsl(210 93% 36% / 0.5)", "0 0 15px hsl(210 93% 36% / 0.3)"] }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            >
              {node.icon}
            </motion.div>
            <span
              className={`text-[10px] sm:text-xs font-medium whitespace-nowrap transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {node.label}
            </span>

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.9 }}
                  className="absolute top-full mt-2 px-3 py-1.5 rounded-lg bg-popover border border-border shadow-lg text-xs text-popover-foreground whitespace-nowrap z-10"
                >
                  {node.description}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Instruction overlay */}
      <AnimatePresence>
        {activatedNodes.size === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-3 left-0 right-0 text-center"
          >
            <span className="text-xs text-muted-foreground bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border">
              ✨ Click nodes to watch the magic flow
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All activated celebration */}
      <AnimatePresence>
        {activatedNodes.size === nodes.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-3 left-0 right-0 text-center"
          >
            <span className="text-xs font-medium text-primary bg-primary/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary/30">
              🎉 Pipeline Complete — You just built an AI system!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NodeVisualizer;
