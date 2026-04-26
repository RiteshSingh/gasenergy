
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
          <h3 className="text-xs font-medium text-muted-foreground">
            Elapsed time (s)
          </h3>
          <p className="text-2xl font-semibold">
            {stats.elapsedSeconds.toFixed(1)}
          </p>
        </div>
        <div>
          <h3 className="text-xs font-medium text-cyan-400">
            Mean KE (Gas 1)
          </h3>
          <p className="text-2xl font-semibold">
            {stats.meanKE1.toFixed(2)}
          </p>
        </div>
        <div>
          <h3 className="text-xs font-medium text-cyan-400">
            Time-Avg KE (Gas 1)
          </h3>
          <p className="text-2xl font-semibold">
            {stats.timeAvgKE1.toFixed(2)}
          </p>
        </div>
        <div>
          <h3 className="text-xs font-medium text-fuchsia-400">
            Mean KE (Gas 2)
          </h3>
          <p className="text-2xl font-semibold">
            {stats.meanKE2.toFixed(2)}
          </p>
        </div>
        <div>
          <h3 className="text-xs font-medium text-fuchsia-400">
            Time-Avg KE (Gas 2)
          </h3>
          <p className="text-2xl font-semibold">
            {stats.timeAvgKE2.toFixed(2)}
          </p>
        </div>
        <div>
          <h3 className="text-xs font-medium text-orange-400">
            Opposite-dir collisions/s
          </h3>
          <p className="text-2xl font-semibold">
            {stats.oppositeCollisionsPerSec.toFixed(0)}
          </p>
        </div>
        <div>
          <h3 className="text-xs font-medium text-green-400">
            Same-dir collisions/s
          </h3>
          <p className="text-2xl font-semibold">
            {stats.sameCollisionsPerSec.toFixed(0)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsDisplay;
