import { Home, Search, Bell, Mail, Bookmark, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { User as UserType } from "@shared/schema";

interface SidebarProps {
  onCreatePost: () => void;
}

export default function Sidebar({ onCreatePost }: SidebarProps) {
  const { data: user } = useQuery<UserType>({
    queryKey: ["/api/user"],
  });

  return (
    <div className="hidden lg:flex flex-col w-64 bg-card border-r border-border fixed h-full">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-5 h-5 text-primary-foreground">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-xl font-bold text-foreground">SocialConnect</h1>
        </div>
        
        <nav className="space-y-2">
          <a 
            href="#" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground"
            data-testid="nav-home"
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Home</span>
          </a>
          <a 
            href="#" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
            data-testid="nav-explore"
          >
            <Search className="h-5 w-5" />
            <span className="font-medium">Explore</span>
          </a>
          <a 
            href="#" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
            data-testid="nav-notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="font-medium">Notifications</span>
            <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">3</span>
          </a>
          <a 
            href="#" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
            data-testid="nav-messages"
          >
            <Mail className="h-5 w-5" />
            <span className="font-medium">Messages</span>
          </a>
          <a 
            href="#" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
            data-testid="nav-saved"
          >
            <Bookmark className="h-5 w-5" />
            <span className="font-medium">Saved</span>
          </a>
          <a 
            href="#" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
            data-testid="nav-profile"
          >
            <User className="h-5 w-5" />
            <span className="font-medium">Profile</span>
          </a>
        </nav>
      </div>
      
      <div className="mt-auto p-6">
        <Button 
          onClick={onCreatePost}
          className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
          data-testid="button-create-post"
        >
          <Plus className="h-4 w-4" />
          <span>Create Post</span>
        </Button>
        
        {user && (
          <div className="mt-6 flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors">
            <img 
              src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64"} 
              alt="User profile" 
              className="w-10 h-10 rounded-full object-cover"
              data-testid="img-user-avatar"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate" data-testid="text-user-name">{user.name}</p>
              <p className="text-muted-foreground text-xs" data-testid="text-user-username">@{user.username}</p>
            </div>
            <div className="text-muted-foreground">⋯</div>
          </div>
        )}
      </div>
    </div>
  );
}
