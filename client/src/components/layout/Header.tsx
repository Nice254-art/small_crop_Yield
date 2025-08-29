import { Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

export default function Header() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  
  const { data: unreadAlerts } = useQuery({
    queryKey: ["/api/alerts/unread"],
    enabled: !!user,
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getActiveLink = (path: string) => {
    return location === path ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground";
  };

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="gradient-bg p-2 rounded-lg">
              <i className="fas fa-seedling text-primary-foreground text-xl"></i>
            </div>
            <h1 className="ml-3 text-xl font-bold text-foreground">CropSight</h1>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => navigate("/")}
              className={`${getActiveLink("/")} transition-colors`}
              data-testid="link-dashboard"
            >
              Dashboard
            </button>
            <button 
              onClick={() => navigate("/fields")}
              className={`${getActiveLink("/fields")} transition-colors`}
              data-testid="link-fields"
            >
              Fields
            </button>
            <button 
              onClick={() => navigate("/analytics")}
              className={`${getActiveLink("/analytics")} transition-colors`}
              data-testid="link-analytics"
            >
              Analytics
            </button>
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              data-testid="button-notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadAlerts && unreadAlerts.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  data-testid="badge-unread-count"
                >
                  {unreadAlerts.length}
                </Badge>
              )}
            </Button>
            
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImageUrl} alt="User Avatar" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium" data-testid="text-user-name">
                {user?.firstName || user?.email || 'User'}
              </span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
