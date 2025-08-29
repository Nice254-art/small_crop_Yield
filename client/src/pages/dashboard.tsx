import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AlertsBanner from "@/components/dashboard/AlertsBanner";
import FieldMapWidget from "@/components/dashboard/FieldMapWidget";
import WeatherWidget from "@/components/dashboard/WeatherWidget";
import QuickActionsWidget from "@/components/dashboard/QuickActionsWidget";
import AnalyticsSection from "@/components/dashboard/AnalyticsSection";
import FieldsOverview from "@/components/dashboard/FieldsOverview";
import RecentAlertsSection from "@/components/dashboard/RecentAlertsSection";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-6">
      <DashboardHeader />
      <AlertsBanner />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <FieldMapWidget />
        </div>
        <div className="space-y-6">
          <WeatherWidget />
          <QuickActionsWidget />
        </div>
      </div>

      <AnalyticsSection />
      <FieldsOverview />
      <RecentAlertsSection />
    </main>
  );
}
