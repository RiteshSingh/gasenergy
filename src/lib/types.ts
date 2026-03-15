
export interface Molecule {
  id: string;
  type: 1 | 2;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
}

export interface Stats {
  meanKE1: number;
  meanKE2: number;
}

export interface SimulationParams {
  mass1: number;
  count1: number;
  mass2: number;
  count2: number;
}
