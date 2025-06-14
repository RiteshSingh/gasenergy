
import { useRef, useEffect } from 'react';
import { Molecule, SimulationParams, Stats } from '@/lib/types';
import * as Vec from '@/lib/vector';

interface CollisionSimulationProps {
  params: SimulationParams;
  onStatsUpdate: (stats: Stats) => void;
}

const MOLECULE_RADIUS = 3;
const MAX_INITIAL_VELOCITY = 1;

const CollisionSimulation = ({ params, onStatsUpdate }: CollisionSimulationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const moleculesRef = useRef<Molecule[]>([]);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if(!parent) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = parent.clientWidth * dpr;
    canvas.height = parent.clientHeight * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${parent.clientWidth}px`;
    canvas.style.height = `${parent.clientHeight}px`;
    const width = parent.clientWidth;
    const height = parent.clientHeight;

    // Initialize molecules
    moleculesRef.current = [];
    const createMolecules = (count: number, mass: number, type: 1 | 2, color: string) => {
      for (let i = 0; i < count; i++) {
        moleculesRef.current.push({
          id: `${type}-${i}`,
          type,
          x: MOLECULE_RADIUS + Math.random() * (width - 2 * MOLECULE_RADIUS),
          y: MOLECULE_RADIUS + Math.random() * (height - 2 * MOLECULE_RADIUS),
          vx: (Math.random() - 0.5) * 2 * MAX_INITIAL_VELOCITY,
          vy: (Math.random() - 0.5) * 2 * MAX_INITIAL_VELOCITY,
          mass,
          radius: MOLECULE_RADIUS,
          color,
        });
      }
    };
    createMolecules(params.count1, params.mass1, 1, 'rgb(34 211 238)'); // cyan-400
    createMolecules(params.count2, params.mass2, 2, 'rgb(217 70 239)'); // fuchsia-500

    const update = () => {
      const molecules = moleculesRef.current;
      
      // Update positions and handle wall collisions
      for (const m of molecules) {
        m.x += m.vx;
        m.y += m.vy;

        if (m.x - m.radius < 0) { m.vx = Math.abs(m.vx); m.x = m.radius; }
        if (m.x + m.radius > width) { m.vx = -Math.abs(m.vx); m.x = width - m.radius; }
        if (m.y - m.radius < 0) { m.vy = Math.abs(m.vy); m.y = m.radius; }
        if (m.y + m.radius > height) { m.vy = -Math.abs(m.vy); m.y = height - m.radius; }
      }

      // Handle molecule collisions
      for (let i = 0; i < molecules.length; i++) {
        for (let j = i + 1; j < molecules.length; j++) {
          const m1 = molecules[i];
          const m2 = molecules[j];
          const distVec = Vec.subtract({x: m2.x, y: m2.y}, {x: m1.x, y: m1.y});
          const dist = Vec.magnitude(distVec);

          if (dist < m1.radius + m2.radius) {
            const normal = Vec.normalize(distVec);
            const tangent = { x: -normal.y, y: normal.x };
            const v1 = { x: m1.vx, y: m1.vy };
            const v2 = { x: m2.vx, y: m2.vy };

            const v1n_scalar = Vec.dot(v1, normal);
            const v1t_scalar = Vec.dot(v1, tangent);
            const v2n_scalar = Vec.dot(v2, normal);
            const v2t_scalar = Vec.dot(v2, tangent);
            
            const v1n_scalar_final = (v1n_scalar * (m1.mass - m2.mass) + 2 * m2.mass * v2n_scalar) / (m1.mass + m2.mass);
            const v2n_scalar_final = (v2n_scalar * (m2.mass - m1.mass) + 2 * m1.mass * v1n_scalar) / (m1.mass + m2.mass);

            const v1n_final = Vec.scale(normal, v1n_scalar_final);
            const v2n_final = Vec.scale(normal, v2n_scalar_final);
            const v1t_final = Vec.scale(tangent, v1t_scalar);
            const v2t_final = Vec.scale(tangent, v2t_scalar);

            m1.vx = v1n_final.x + v1t_final.x;
            m1.vy = v1n_final.y + v1t_final.y;
            m2.vx = v2n_final.x + v2t_final.x;
            m2.vy = v2n_final.y + v2t_final.y;

            // Separation to prevent sticking
            const overlap = m1.radius + m2.radius - dist;
            const separationVector = Vec.scale(normal, overlap / 2);
            m1.x -= separationVector.x;
            m1.y -= separationVector.y;
            m2.x += separationVector.x;
            m2.y += separationVector.y;
          }
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const m of moleculesRef.current) {
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = m.color;
        ctx.fill();
      }
    };
    
    const calculateStats = () => {
        let totalKE1 = 0, count1 = 0;
        let totalKE2 = 0, count2 = 0;

        for (const m of moleculesRef.current) {
            const ke = 0.5 * m.mass * (m.vx * m.vx + m.vy * m.vy);
            if(m.type === 1) {
                totalKE1 += ke;
                count1++;
            } else {
                totalKE2 += ke;
                count2++;
            }
        }
        onStatsUpdate({
            meanKE1: count1 > 0 ? totalKE1 / count1 : 0,
            meanKE2: count2 > 0 ? totalKE2 / count2 : 0,
        });
    }

    const gameLoop = () => {
      update();
      draw();
      calculateStats();
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [params, onStatsUpdate]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default CollisionSimulation;
