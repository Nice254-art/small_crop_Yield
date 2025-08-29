import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, CloudRain, X } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function RecentAlertsSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: alerts, isLoading } = useQuery({
    queryKey: ["/api/alerts"],
    enabled: !!user,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await fetch(`/api/alerts/${alertId}/read`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/alerts/unread"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to dismiss alert",
        variant: "destructive",
      });
    },
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'health':
        return <AlertTriangle className="text-destructive" />;
      case 'weather':
        return <CloudRain className="text-blue-600" />;
      case 'yield':
        return <CheckCircle className="text-accent" />;
      default:
        return <AlertTriangle className="text-destructive" />;
    }
  };

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case 'health':
        return 'bg-destructive/10';
      case 'weather':
        return 'bg-blue-100';
      case 'yield':
        return 'bg-accent/10';
      default:
        return 'bg-destructive/10';
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const alertDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - alertDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  // Show recent 5 alerts
  const recentAlerts = alerts?.slice(0, 5) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts & Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        ) : recentAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
            <p className="text-muted-foreground">No recent alerts. Your fields are looking good!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentAlerts.map((alert: any) => (
              <div key={alert.id} className={`flex items-start space-x-4 p-4 border border-border rounded-lg ${getAlertBgColor(alert.type)}`}>
                <div className="p-2 rounded-lg">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium" data-testid={`alert-recent-title-${alert.id}`}>
                    {alert.title}
                  </h4>
                  <p className="text-muted-foreground text-sm" data-testid={`alert-recent-description-${alert.id}`}>
                    {alert.description}
                  </p>
                  <span className="text-xs text-muted-foreground" data-testid={`alert-recent-time-${alert.id}`}>
                    {formatTimeAgo(alert.createdAt)}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => markAsReadMutation.mutate(alert.id)}
                  disabled={markAsReadMutation.isPending}
                  data-testid={`button-dismiss-recent-alert-${alert.id}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
