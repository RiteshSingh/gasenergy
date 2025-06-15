
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SimulationParams } from "@/lib/types";

interface ControlsProps {
  onStart: (params: SimulationParams) => void;
  initialParams: SimulationParams;
}

const Controls = ({ onStart, initialParams }: ControlsProps) => {
  const [params, setParams] = useState<SimulationParams>(initialParams);

  const handleSliderChange = (type: keyof SimulationParams, value: number) => {
    setParams(prev => ({...prev, [type]: value}));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="mass1" className="text-cyan-400">Mass 1 ({params.mass1})</Label>
          <Slider id="mass1" min={1} max={20} step={1} value={[params.mass1]} onValueChange={([v]) => handleSliderChange('mass1', v)} />
        </div>
        <div className="space-y-3">
          <Label htmlFor="count1" className="text-cyan-400">Count 1 ({params.count1})</Label>
          <Slider id="count1" min={1} max={10000} step={1} value={[params.count1]} onValueChange={([v]) => handleSliderChange('count1', v)} />
        </div>
        <div className="space-y-3">
          <Label htmlFor="mass2" className="text-fuchsia-400">Mass 2 ({params.mass2})</Label>
          <Slider id="mass2" min={1} max={20} step={1} value={[params.mass2]} onValueChange={([v]) => handleSliderChange('mass2', v)} />
        </div>
         <div className="space-y-3">
          <Label htmlFor="count2" className="text-fuchsia-400">Count 2 ({params.count2})</Label>
          <Slider id="count2" min={1} max={10000} step={1} value={[params.count2]} onValueChange={([v]) => handleSliderChange('count2', v)} />
        </div>
        <Button onClick={() => onStart(params)} className="w-full">
          Run Simulation
        </Button>
      </CardContent>
    </Card>
  );
};

export default Controls;
