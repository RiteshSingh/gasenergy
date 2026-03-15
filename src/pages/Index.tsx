import { useState } from 'react';
import CollisionSimulation from '@/components/CollisionSimulation';
import Controls from '@/components/Controls';
import StatsDisplay from '@/components/StatsDisplay';
import { SimulationParams, Stats } from '@/lib/types';

const INITIAL_PARAMS: SimulationParams = {
  mass1: 5,
  count1: 50,
  mass2: 15,
  count2: 25,
};

const Index = () => {
  const [simulationKey, setSimulationKey] = useState(1);
  const [params, setParams] = useState<SimulationParams>(INITIAL_PARAMS);
  const [stats, setStats] = useState<Stats>({ meanKE1: 0, meanKE2: 0 });
  
  const handleStartSimulation = (newParams: SimulationParams) => {
    setParams(newParams);
    setSimulationKey(prev => prev + 1); // Remounts the simulation component
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-80 flex-shrink-0 bg-card p-6 overflow-y-auto space-y-6 border-r border-border">
        <h1 className="text-lg font-bold">Molecule Collision Simulator</h1>
        <div className="text-sm text-muted-foreground space-y-2 text-justify">
          <p>
            This is a simulation of two monoatomic gases in a 2D box. The two gases start with different mean kinetic energies.
          </p>
          <p>
            The simulation shows that the mean kinetic energies for the two gases tend to approach each other with time.
          </p>
        </div>
        <Controls onStart={handleStartSimulation} initialParams={params} />
        <StatsDisplay stats={stats} />
      </aside>
      <main className="flex-1 relative">
        <CollisionSimulation
          key={simulationKey}
          params={params}
          onStatsUpdate={setStats}
        />
      </main>
    </div>
  );
};

export default Index;
