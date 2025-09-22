import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Smile, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

interface CreatePostCardProps {
  onCreatePost: () => void;
}

export default function CreatePostCard({ onCreatePost }: CreatePostCardProps) {
  const [content, setContent] = useState("");
  
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const handleQuickPost = () => {
    if (content.trim()) {
      onCreatePost();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 m-4 lg:mt-6">
      <div className="flex items-start space-x-4">
        <img 
          src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=48&h=48"} 
          alt="Your profile" 
          className="w-12 h-12 rounded-full object-cover"
          data-testid="img-create-post-avatar"
        />
        <div className="flex-1">
          <Textarea
            placeholder={`What's on your mind, ${user?.name || 'there'}?`}
            className="w-full bg-muted text-foreground placeholder-muted-foreground border-0 resize-none focus:ring-2 focus:ring-primary"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onClick={onCreatePost}
            data-testid="textarea-create-post-quick"
          />
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <button 
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={onCreatePost}
                data-testid="button-add-photo"
              >
                <Image className="h-4 w-4" />
                <span className="text-sm font-medium">Photo</span>
              </button>
              <button 
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                data-testid="button-add-feeling"
              >
                <Smile className="h-4 w-4" />
                <span className="text-sm font-medium">Feeling</span>
              </button>
              <button 
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                data-testid="button-add-location"
              >
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">Location</span>
              </button>
            </div>
            <Button
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              disabled={!content.trim()}
              onClick={handleQuickPost}
              data-testid="button-post-quick"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
