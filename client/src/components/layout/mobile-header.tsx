import { Search, Bell } from "lucide-react";

export default function MobileHeader() {
  return (
    <div className="lg:hidden bg-card border-b border-border p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 text-primary-foreground">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-lg font-bold">SocialConnect</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Search className="h-5 w-5 text-muted-foreground" data-testid="icon-search" />
          <Bell className="h-5 w-5 text-muted-foreground" data-testid="icon-notifications" />
        </div>
      </div>
    </div>
  );
}
