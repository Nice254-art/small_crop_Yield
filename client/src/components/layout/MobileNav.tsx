import { Home, MapPin, TrendingUp, Bell } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

export default function MobileNav() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();

  const { data: unreadAlerts } = useQuery({
    queryKey: ["/api/alerts/unread"],
    enabled: !!user,
  });

  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/fields", icon: MapPin, label: "Fields" },
    { path: "/analytics", icon: TrendingUp, label: "Analytics" },
    { path: "/alerts", icon: Bell, label: "Alerts", badge: unreadAlerts?.length },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center relative ${
              location === item.path ? "text-primary" : "text-muted-foreground"
            }`}
            data-testid={`nav-${item.label.toLowerCase()}`}
          >
            <item.icon className="text-lg mb-1 h-6 w-6" />
            <span className="text-xs">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs flex items-center justify-center"
              >
                {item.badge}
              </Badge>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
