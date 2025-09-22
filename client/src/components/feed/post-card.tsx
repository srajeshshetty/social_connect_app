import { useState } from "react";
import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CommentSection from "./comment-section";
import type { PostWithAuthor } from "@shared/schema";

interface PostCardProps {
  post: PostWithAuthor;
}

export default function PostCard({ post }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/posts/${post.id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  return (
    <article className="bg-card border border-border rounded-lg overflow-hidden hover:scale-[1.01] transition-transform duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={post.author.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=48&h=48"} 
              alt="User profile" 
              className="w-12 h-12 rounded-full object-cover"
              data-testid={`img-post-avatar-${post.id}`}
            />
            <div>
              <h3 className="font-semibold text-foreground" data-testid={`text-post-author-${post.id}`}>
                {post.author.name}
              </h3>
              <p className="text-muted-foreground text-sm" data-testid={`text-post-time-${post.id}`}>
                {formatTimeAgo(post.createdAt!)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground transition-colors p-2"
              data-testid={`button-post-options-${post.id}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-foreground leading-relaxed" data-testid={`text-post-content-${post.id}`}>
            {post.content}
          </p>
        </div>
        
        {post.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt="Post image" 
              className="w-full h-80 object-cover"
              data-testid={`img-post-image-${post.id}`}
            />
          </div>
        )}
        
        <div className="flex items-center justify-between text-muted-foreground text-sm mb-4">
          <div className="flex items-center space-x-4">
            <span data-testid={`text-post-likes-${post.id}`}>
              {post.likesCount || 0} likes
            </span>
            <span data-testid={`text-post-comments-${post.id}`}>
              {post.commentsCount || 0} comments
            </span>
            <span data-testid={`text-post-shares-${post.id}`}>
              {post.sharesCount || 0} shares
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between border-t border-border pt-4">
          <Button
            variant="ghost"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              post.isLiked 
                ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
            onClick={handleLike}
            disabled={likeMutation.isPending}
            data-testid={`button-like-${post.id}`}
          >
            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="font-medium">{post.isLiked ? 'Liked' : 'Like'}</span>
          </Button>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setShowComments(!showComments)}
            data-testid={`button-comment-${post.id}`}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="font-medium">Comment</span>
          </Button>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
            data-testid={`button-share-${post.id}`}
          >
            <Share className="h-4 w-4" />
            <span className="font-medium">Share</span>
          </Button>
        </div>
      </div>
      
      {showComments && <CommentSection postId={post.id} />}
    </article>
  );
}
