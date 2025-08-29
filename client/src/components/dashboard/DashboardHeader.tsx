import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";

export default function DashboardHeader() {
  const { user } = useAuth();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="gradient-bg rounded-xl p-6 text-primary-foreground animate-pulse">
          <div className="h-8 bg-white/20 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-white/20 rounded w-1/2 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="h-8 bg-white/20 rounded mb-2"></div>
                <div className="h-4 bg-white/20 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="gradient-bg rounded-xl p-6 text-primary-foreground">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, <span data-testid="text-user-first-name">{user?.firstName || 'Farmer'}!</span>
        </h2>
        <p className="text-primary-foreground/80 mb-4">Here's your farm overview for today</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold" data-testid="stat-total-fields">
              {stats?.totalFields || 0}
            </div>
            <div className="text-sm text-primary-foreground/80">Total Fields</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold" data-testid="stat-healthy-fields">
              {stats?.healthyFields || 0}
            </div>
            <div className="text-sm text-primary-foreground/80">Healthy Fields</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold" data-testid="stat-total-acres">
              {stats?.totalAcres || 0}
            </div>
            <div className="text-sm text-primary-foreground/80">Total Acres</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold" data-testid="stat-predicted-yield">
              {stats?.predictedYield ? `${stats.predictedYield}t` : '0t'}
            </div>
            <div className="text-sm text-primary-foreground/80">Predicted Yield</div>
          </div>
        </div>
      </div>
    </div>
  );
}
