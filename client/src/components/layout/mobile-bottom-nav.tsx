import { Home, Search, Plus, Bell, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { User as UserType } from "@shared/schema";

interface MobileBottomNavProps {
  onCreatePost: () => void;
}

export default function MobileBottomNav({ onCreatePost }: MobileBottomNavProps) {
  const { data: user } = useQuery<UserType>({
    queryKey: ["/api/user"],
  });

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-20">
      <div className="flex items-center justify-around py-2">
        <button className="flex flex-col items-center space-y-1 py-2 px-4 text-primary" data-testid="button-nav-home">
          <Home className="h-5 w-5" />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center space-y-1 py-2 px-4 text-muted-foreground" data-testid="button-nav-search">
          <Search className="h-5 w-5" />
          <span className="text-xs font-medium">Search</span>
        </button>
        <button 
          onClick={onCreatePost}
          className="flex flex-col items-center space-y-1 py-2 px-4 text-muted-foreground"
          data-testid="button-nav-create"
        >
          <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
            <Plus className="h-4 w-4" />
          </div>
          <span className="text-xs font-medium">Create</span>
        </button>
        <button className="flex flex-col items-center space-y-1 py-2 px-4 text-muted-foreground" data-testid="button-nav-notifications">
          <div className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
          </div>
          <span className="text-xs font-medium">Alerts</span>
        </button>
        <button className="flex flex-col items-center space-y-1 py-2 px-4 text-muted-foreground" data-testid="button-nav-profile">
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt="Profile" 
              className="w-6 h-6 rounded-full object-cover"
              data-testid="img-nav-profile"
            />
          ) : (
            <User className="h-5 w-5" />
          )}
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
}
