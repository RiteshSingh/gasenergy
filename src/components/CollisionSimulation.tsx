
import { useRef, useEffect } from 'react';
import { Molecule, SimulationParams, Stats } from '@/lib/types';
import * as Vec from '@/lib/vector';

interface CollisionSimulationProps {
  params: SimulationParams;
  onStatsUpdate: (stats: Stats) => void;
}

const MOLECULE_RADIUS = 1.5;
const MAX_INITIAL_VELOCITY = 1;

const CollisionSimulation = ({ params, onStatsUpdate }: CollisionSimulationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const moleculesRef = useRef<Molecule[]>([]);
  const animationFrameId = useRef<number>();
  const oppositeCountRef = useRef(0);
  const sameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const startTimeRef = useRef(performance.now());
  const oppositeRateRef = useRef(0);
  const sameRateRef = useRef(0);
  const frameSumKE1 = useRef(0);
  const frameSumKE2 = useRef(0);
  const frameCountRef = useRef(0);

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

    oppositeCountRef.current = 0;
    sameCountRef.current = 0;
    lastTimeRef.current = performance.now();
    startTimeRef.current = performance.now();
    oppositeRateRef.current = 0;
    sameRateRef.current = 0;
    frameSumKE1.current = 0;
    frameSumKE2.current = 0;
    frameCountRef.current = 0;

    // Initialize molecules with random speeds, then rescale so mean KE per gas
    // matches a common target KE.
    moleculesRef.current = [];
    const targetKE = 0.5 * params.mass1 * MAX_INITIAL_VELOCITY * MAX_INITIAL_VELOCITY;

    const createMolecules = (count: number, mass: number, type: 1 | 2, color: string) => {
      const start = moleculesRef.current.length;
      let sumKE = 0;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 2 * MAX_INITIAL_VELOCITY;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        sumKE += 0.5 * mass * (vx * vx + vy * vy);
        moleculesRef.current.push({
          id: `${type}-${i}`,
          type,
          x: MOLECULE_RADIUS + Math.random() * (width - 2 * MOLECULE_RADIUS),
          y: MOLECULE_RADIUS + Math.random() * (height - 2 * MOLECULE_RADIUS),
          vx,
          vy,
          mass,
          radius: MOLECULE_RADIUS,
          color,
        });
      }
      // Rescale velocities so mean KE equals targetKE exactly
      const meanKE = count > 0 ? sumKE / count : 0;
      const scale = meanKE > 0 ? Math.sqrt(targetKE / meanKE) : 1;
      for (let i = start; i < moleculesRef.current.length; i++) {
        moleculesRef.current[i].vx *= scale;
        moleculesRef.current[i].vy *= scale;
      }
    };
    createMolecules(params.count1, params.mass1, 1, 'rgb(34 211 238)');
    createMolecules(params.count2, params.mass2, 2, 'rgb(217 70 239)');

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

            // Classify: axial velocity components along collision normal
            const v1n_scalar = Vec.dot(v1, normal);
            const v2n_scalar = Vec.dot(v2, normal);
            if (m1.type !== m2.type) {
              if (v1n_scalar * v2n_scalar < 0) {
                oppositeCountRef.current++;
              } else {
                sameCountRef.current++;
              }
            }

            const v1t_scalar = Vec.dot(v1, tangent);
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

        const currentKE1 = count1 > 0 ? totalKE1 / count1 : 0;
        const currentKE2 = count2 > 0 ? totalKE2 / count2 : 0;

        frameCountRef.current++;
        frameSumKE1.current += currentKE1;
        frameSumKE2.current += currentKE2;

        const now = performance.now();
        const elapsed = (now - lastTimeRef.current) / 1000;
        if (elapsed >= 1) {
            oppositeRateRef.current = oppositeCountRef.current / elapsed;
            sameRateRef.current = sameCountRef.current / elapsed;
            oppositeCountRef.current = 0;
            sameCountRef.current = 0;
            lastTimeRef.current = now;
        }

        onStatsUpdate({
            meanKE1: currentKE1,
            meanKE2: currentKE2,
            timeAvgKE1: frameSumKE1.current / frameCountRef.current,
            timeAvgKE2: frameSumKE2.current / frameCountRef.current,
            oppositeCollisionsPerSec: oppositeRateRef.current,
            sameCollisionsPerSec: sameRateRef.current,
            elapsedSeconds: (now - startTimeRef.current) / 1000,
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
