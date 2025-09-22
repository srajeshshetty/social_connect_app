import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CommentWithAuthor, User } from "@shared/schema";

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: comments, isLoading } = useQuery<CommentWithAuthor[]>({
    queryKey: ["/api/posts", postId, "comments"],
  });

  const createCommentMutation = useMutation({
    mutationFn: (content: string) => 
      apiRequest("POST", `/api/posts/${postId}/comments`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", postId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setNewComment("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create comment",
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      createCommentMutation.mutate(newComment);
    }
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes === 1) return "1 minute ago";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  return (
    <div className="border-t border-border bg-muted/30">
      <div className="p-6">
        {isLoading ? (
          <div className="text-muted-foreground text-sm">Loading comments...</div>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-4 mb-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <img 
                  src={comment.author.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=32&h=32"} 
                  alt="Commenter profile" 
                  className="w-8 h-8 rounded-full object-cover"
                  data-testid={`img-comment-avatar-${comment.id}`}
                />
                <div className="flex-1">
                  <div className="bg-card rounded-lg p-3">
                    <p className="font-semibold text-sm text-foreground" data-testid={`text-comment-author-${comment.id}`}>
                      {comment.author.name}
                    </p>
                    <p className="text-foreground text-sm" data-testid={`text-comment-content-${comment.id}`}>
                      {comment.content}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    <button className="hover:text-primary" data-testid={`button-like-comment-${comment.id}`}>
                      Like
                    </button>
                    <button className="hover:text-primary" data-testid={`button-reply-comment-${comment.id}`}>
                      Reply
                    </button>
                    <span data-testid={`text-comment-time-${comment.id}`}>
                      {formatTimeAgo(comment.createdAt!)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm mb-4">No comments yet. Be the first to comment!</div>
        )}
        
        <form onSubmit={handleSubmitComment} className="flex items-center space-x-3">
          <img 
            src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=32&h=32"} 
            alt="Your profile" 
            className="w-8 h-8 rounded-full object-cover"
            data-testid="img-comment-input-avatar"
          />
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-card border border-border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary"
              data-testid={`input-comment-${postId}`}
            />
          </div>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80 transition-colors"
            disabled={!newComment.trim() || createCommentMutation.isPending}
            data-testid={`button-submit-comment-${postId}`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
