
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SimulationMode, SimulationParams } from "@/lib/types";

interface ControlsProps {
  onStart: (params: SimulationParams) => void;
  initialParams: SimulationParams;
}

const Controls = ({ onStart, initialParams }: ControlsProps) => {
  const [params, setParams] = useState<SimulationParams>(initialParams);

  const handleSliderChange = (type: keyof SimulationParams, value: number) => {
    setParams(prev => ({ ...prev, [type]: value }));
  };

  const handleModeChange = (mode: SimulationMode) => {
    if (mode === 'two') {
      setParams(prev => ({ ...prev, mode, count1: 1, count2: 1, radius: 20 }));
    } else {
      setParams(prev => ({ ...prev, mode, count1: 50, count2: 25, radius: 1.5 }));
    }
  };

  const isTwo = params.mode === 'two';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Simulation Mode</Label>
          <Select value={params.mode} onValueChange={(v) => handleModeChange(v as SimulationMode)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="many">Many Molecules</SelectItem>
              <SelectItem value="two">Two Molecules (1 of each)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="meanKE">Mean Kinetic Energy (both gases) = {params.meanKE}</Label>
          <Slider id="meanKE" min={0.5} max={1000} step={0.5} value={[params.meanKE]} onValueChange={([v]) => handleSliderChange('meanKE', v)} />
        </div>

        <div className="space-y-3">
          <Label htmlFor="mass1" className="text-cyan-400">Mass (Gas 1) = {params.mass1}</Label>
          <Slider id="mass1" min={1} max={20} step={1} value={[params.mass1]} onValueChange={([v]) => handleSliderChange('mass1', v)} />
        </div>
        {!isTwo && (
          <div className="space-y-3">
            <Label htmlFor="count1" className="text-cyan-400">Count (Gas 1) = {params.count1}</Label>
            <Slider id="count1" min={1} max={1000} step={1} value={[params.count1]} onValueChange={([v]) => handleSliderChange('count1', v)} />
          </div>
        )}
        <div className="space-y-3">
          <Label htmlFor="mass2" className="text-fuchsia-400">Mass (Gas 2) = {params.mass2}</Label>
          <Slider id="mass2" min={1} max={20} step={1} value={[params.mass2]} onValueChange={([v]) => handleSliderChange('mass2', v)} />
        </div>
        {!isTwo && (
          <div className="space-y-3">
            <Label htmlFor="count2" className="text-fuchsia-400">Count (Gas 2) = {params.count2}</Label>
            <Slider id="count2" min={1} max={1000} step={1} value={[params.count2]} onValueChange={([v]) => handleSliderChange('count2', v)} />
          </div>
        )}
        {isTwo && (
          <div className="space-y-3">
            <Label htmlFor="radius">Radius (both molecules) = {params.radius}</Label>
            <Slider id="radius" min={5} max={400} step={1} value={[params.radius]} onValueChange={([v]) => handleSliderChange('radius', v)} />
          </div>
        )}
        <Button onClick={() => onStart(params)} className="w-full">
          Run Simulation
        </Button>
      </CardContent>
    </Card>
  );
};

export default Controls;
