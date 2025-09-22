import { Button } from "@/components/ui/button";

const suggestedUsers = [
  {
    name: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40",
    mutualConnections: "5 mutual connections"
  },
  {
    name: "James Thompson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40",
    mutualConnections: "3 mutual connections"
  },
  {
    name: "Olivia Garcia",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40",
    mutualConnections: "8 mutual connections"
  }
];

export default function SuggestedConnections() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="font-bold text-lg mb-4" data-testid="text-suggestions-title">People You May Know</h2>
      <div className="space-y-4">
        {suggestedUsers.map((user, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={user.avatar} 
                alt="Suggested connection" 
                className="w-10 h-10 rounded-full object-cover"
                data-testid={`img-suggestion-avatar-${index}`}
              />
              <div>
                <p className="font-medium text-sm text-foreground" data-testid={`text-suggestion-name-${index}`}>
                  {user.name}
                </p>
                <p className="text-muted-foreground text-xs" data-testid={`text-suggestion-mutual-${index}`}>
                  {user.mutualConnections}
                </p>
              </div>
            </div>
            <Button 
              size="sm"
              className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm font-medium hover:opacity-90 transition-opacity"
              data-testid={`button-connect-${index}`}
            >
              Connect
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
