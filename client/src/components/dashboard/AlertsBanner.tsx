import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AlertsBanner() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: alerts } = useQuery({
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

  const criticalAlerts = alerts?.filter((alert: any) => 
    alert.priority === 'critical' || alert.priority === 'high'
  ) || [];

  if (!criticalAlerts.length) return null;

  return (
    <div className="mb-6">
      {criticalAlerts.map((alert: any) => (
        <div key={alert.id} className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="text-destructive mr-3 h-5 w-5" />
              <div>
                <h4 className="font-semibold text-destructive" data-testid={`alert-title-${alert.id}`}>
                  {alert.title}
                </h4>
                <p className="text-destructive/80" data-testid={`alert-description-${alert.id}`}>
                  {alert.description}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="destructive" 
                size="sm"
                data-testid={`button-view-alert-${alert.id}`}
              >
                View Details
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => markAsReadMutation.mutate(alert.id)}
                disabled={markAsReadMutation.isPending}
                data-testid={`button-dismiss-alert-${alert.id}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
