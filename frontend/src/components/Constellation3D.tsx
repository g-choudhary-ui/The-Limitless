import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Node3D {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  status: 'mastered' | 'developing' | 'gap_detected' | 'unassessed';
  mastery: number;
}

interface Constellation3DProps {
  splineUrl?: string;
  interactive?: boolean;
  className?: string;
}

export const Constellation3D: React.FC<Constellation3DProps> = ({
  splineUrl,
  interactive = true,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node3D | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initial 3D nodes representing the knowledge network
    const nodes: Node3D[] = [
      { id: '1', name: 'BST Subtree Bounds', x: -120, y: -40, z: 20, vx: 0.15, vy: 0.2, vz: 0.1, radius: 9, status: 'gap_detected', mastery: 45 },
      { id: '2', name: 'Recursive Call Stack', x: 0, y: -100, z: -30, vx: -0.1, vy: 0.1, vz: -0.2, radius: 8, status: 'developing', mastery: 75 },
      { id: '3', name: 'In-Order Traversal', x: 130, y: -20, z: 40, vx: 0.1, vy: -0.15, vz: 0.15, radius: 10, status: 'mastered', mastery: 88 },
      { id: '4', name: 'Interval Invariants', x: -60, y: 80, z: -10, vx: -0.2, vy: -0.1, vz: 0.2, radius: 7, status: 'developing', mastery: 65 },
      { id: '5', name: 'Memoization Caching', x: 100, y: 90, z: -50, vx: 0.12, vy: 0.15, vz: -0.1, radius: 8, status: 'unassessed', mastery: 30 },
      { id: '6', name: 'Cache-Aside Invariant', x: 30, y: 140, z: 10, vx: -0.15, vy: -0.12, vz: 0.05, radius: 8, status: 'developing', mastery: 60 },
      { id: '7', name: 'Base-Case Terminating', x: -130, y: 40, z: -40, vx: 0.1, vy: 0.1, vz: -0.1, radius: 7, status: 'mastered', mastery: 92 },
    ];

    // Node connections
    const links: [number, number][] = [
      [0, 1], [0, 3], [1, 2], [1, 6], [2, 3], [3, 4], [4, 5], [5, 6], [0, 6]
    ];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      mouseRef.current.targetX = x * 0.0008;
      mouseRef.current.targetY = y * 0.0008;

      // Hit test for tooltip
      let found: Node3D | null = null;
      for (const node of nodes) {
        // approximate screen projected position
        const fov = 350;
        const scale = fov / (fov + node.z);
        const px = node.x * scale + width / 2;
        const py = node.y * scale + height / 2;
        const dist = Math.hypot(e.clientX - rect.left - px, e.clientY - rect.top - py);
        if (dist < node.radius * scale + 10) {
          found = node;
          break;
        }
      }
      setHoveredNode(found);
    };

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    const render = () => {
      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Rotate nodes around center
      const rotY = mouseRef.current.x + 0.002;
      const rotX = -mouseRef.current.y + 0.001;

      nodes.forEach(node => {
        // Physics float
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        if (Math.abs(node.x) > 170) node.vx *= -1;
        if (Math.abs(node.y) > 130) node.vy *= -1;
        if (Math.abs(node.z) > 100) node.vz *= -1;

        // 3D Rotation matrices
        // Y rotation
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.z * cosY + node.x * sinY;

        // X rotation
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y2 = node.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + node.y * sinX;

        node.x = x1;
        node.y = y2;
        node.z = z2;
      });

      // Sort nodes by Z for depth rendering
      const sortedIndices = nodes.map((_, i) => i).sort((a, b) => nodes[a].z - nodes[b].z);

      // Draw links
      links.forEach(([i, j]) => {
        const n1 = nodes[i];
        const n2 = nodes[j];

        const fov = 350;
        const s1 = fov / (fov + n1.z);
        const s2 = fov / (fov + n2.z);

        const x1 = n1.x * s1 + width / 2;
        const y1 = n1.y * s1 + height / 2;
        const x2 = n2.x * s2 + width / 2;
        const y2 = n2.y * s2 + height / 2;

        const avgZ = (n1.z + n2.z) / 2;
        const alpha = Math.max(0.08, Math.min(0.45, (100 - avgZ) / 250));

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, `rgba(191, 122, 117, ${alpha})`);
        gradient.addColorStop(1, `rgba(212, 139, 114, ${alpha})`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // Draw nodes
      sortedIndices.forEach(idx => {
        const node = nodes[idx];
        const fov = 350;
        const scale = fov / (fov + node.z);
        const px = node.x * scale + width / 2;
        const py = node.y * scale + height / 2;
        const r = Math.max(3, node.radius * scale);

        // Halo / Glow in warm dusty rose & sand tones
        const glow = ctx.createRadialGradient(px, py, 0, px, py, r * 2.8);
        if (node.status === 'mastered') {
          glow.addColorStop(0, 'rgba(212, 139, 114, 0.75)');
          glow.addColorStop(1, 'rgba(212, 139, 114, 0)');
        } else if (node.status === 'gap_detected') {
          glow.addColorStop(0, 'rgba(191, 122, 117, 0.8)');
          glow.addColorStop(1, 'rgba(191, 122, 117, 0)');
        } else {
          glow.addColorStop(0, 'rgba(226, 185, 180, 0.65)');
          glow.addColorStop(1, 'rgba(226, 185, 180, 0)');
        }

        ctx.beginPath();
        ctx.arc(px, py, r * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core Node
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        if (node.status === 'mastered') {
          ctx.fillStyle = '#d48b72'; // warm terracotta sand
        } else if (node.status === 'gap_detected') {
          ctx.fillStyle = '#bf7a75'; // dusty rose
        } else {
          ctx.fillStyle = '#e2b9b4'; // soft blush
        }
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Node label
        ctx.font = `${Math.max(10, Math.round(11 * scale))}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, px, py + r + 13 * scale);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [interactive]);

  return (
    <div className={`relative w-full h-full min-h-[380px] flex items-center justify-center overflow-hidden ${className}`}>
      {splineUrl ? (
        <iframe
          src={splineUrl}
          title="Spline 3D Scene"
          className="w-full h-full border-0 pointer-events-auto"
          loading="lazy"
        />
      ) : (
        <>
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />
          {/* Subtle Ambient Background Gradients in Warm Beige & Dusty Rose */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-brand-500/15 rounded-full blur-[90px] pointer-events-none -z-10" />
          <div className="absolute top-1/3 left-1/4 w-[240px] h-[240px] bg-electric-400/20 rounded-full blur-[80px] pointer-events-none -z-10" />

          {/* Interactive Tooltip */}
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl glass-card text-xs shadow-lg pointer-events-none flex items-center gap-3 border border-brand-200/50 dark:border-brand-900/40"
            >
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  hoveredNode.status === 'mastered'
                    ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                    : hoveredNode.status === 'gap_detected'
                    ? 'bg-rose-400 shadow-[0_0_8px_#f87171]'
                    : 'bg-brand-400 shadow-[0_0_8px_#a78bfa]'
                }`}
              />
              <span className="font-semibold text-slate-800 dark:text-slate-100">{hoveredNode.name}</span>
              <span className="text-slate-500 dark:text-slate-400 font-mono">Mastery: {hoveredNode.mastery}%</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {hoveredNode.status.replace('_', ' ')}
              </span>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};
