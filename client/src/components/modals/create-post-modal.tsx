import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, Smile, MapPin, X } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState("public");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const createPostMutation = useMutation({
    mutationFn: (postData: { content: string; imageUrl?: string }) => 
      apiRequest("POST", "/api/posts", postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = () => {
    if (!content.trim()) return;

    // For now, we'll just use the preview URL as the image URL
    // In a real app, you'd upload the image to a storage service first
    const postData = {
      content,
      imageUrl: imagePreview || undefined,
    };

    createPostMutation.mutate(postData);
  };

  const handleClose = () => {
    setContent("");
    setImageFile(null);
    setImagePreview(null);
    setPrivacy("public");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="text-xl font-bold text-foreground">Create Post</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="flex items-start space-x-4">
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=48&h=48"} 
              alt="Your profile" 
              className="w-12 h-12 rounded-full object-cover"
              data-testid="img-modal-avatar"
            />
            <div>
              <h3 className="font-semibold text-foreground" data-testid="text-modal-username">
                {user?.name || "User"}
              </h3>
              <Select value={privacy} onValueChange={setPrivacy}>
                <SelectTrigger className="w-32 h-8 bg-muted border border-border text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends</SelectItem>
                  <SelectItem value="private">Only me</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-background border border-border rounded-lg p-4 h-32 resize-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
            data-testid="textarea-modal-content"
          />
          
          {imagePreview && (
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={imagePreview} 
                className="w-full h-64 object-cover" 
                alt="Preview"
                data-testid="img-modal-preview"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
                onClick={removeImage}
                data-testid="button-remove-image"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                <Image className="h-5 w-5" />
                <span className="font-medium">Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  data-testid="input-image-upload"
                />
              </label>
              
              <button 
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                data-testid="button-add-feeling-modal"
              >
                <Smile className="h-5 w-5" />
                <span className="font-medium">Feeling</span>
              </button>
              
              <button 
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                data-testid="button-add-location-modal"
              >
                <MapPin className="h-5 w-5" />
                <span className="font-medium">Location</span>
              </button>
            </div>
            
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || createPostMutation.isPending}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              data-testid="button-submit-post"
            >
              {createPostMutation.isPending ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
