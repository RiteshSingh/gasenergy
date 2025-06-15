
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stats } from "@/lib/types";

interface StatsDisplayProps {
  stats: Stats;
}

const StatsDisplay = ({ stats }: StatsDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-cyan-400">Gas 1</h3>
          <p className="text-2xl font-semibold">
            {stats.meanKE1.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">Mean Kinetic Energy</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-fuchsia-400">Gas 2</h3>
          <p className="text-2xl font-semibold">
            {stats.meanKE2.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">Mean Kinetic Energy</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsDisplay;
