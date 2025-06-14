
export interface Vector {
  x: number;
  y: number;
}

export const dot = (v1: Vector, v2: Vector): number => v1.x * v2.x + v1.y * v2.y;
export const scale = (v: Vector, s: number): Vector => ({ x: v.x * s, y: v.y * s });
export const add = (v1: Vector, v2: Vector): Vector => ({ x: v1.x + v2.x, y: v1.y + v2.y });
export const subtract = (v1: Vector, v2: Vector): Vector => ({ x: v1.x - v2.x, y: v1.y - v2.y });
export const magnitude = (v: Vector): number => Math.sqrt(v.x * v.x + v.y * v.y);
export const normalize = (v: Vector): Vector => {
  const mag = magnitude(v);
  if (mag === 0) return { x: 0, y: 0 };
  return scale(v, 1 / mag);
};
