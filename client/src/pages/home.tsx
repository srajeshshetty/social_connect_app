import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import CreatePostCard from "@/components/feed/create-post-card";
import PostCard from "@/components/feed/post-card";
import CreatePostModal from "@/components/modals/create-post-modal";
import TrendingSection from "@/components/sidebar/trending-section";
import SuggestedConnections from "@/components/sidebar/suggested-connections";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { PostWithAuthor } from "@shared/schema";

export default function Home() {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  const { data: posts, isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/posts"],
  });

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar onCreatePost={() => setIsCreatePostModalOpen(true)} />
      
      <div className="flex-1 lg:ml-64">
        <div className="max-w-4xl mx-auto">
          <MobileHeader />
          
          <div className="flex">
            <div className="flex-1 max-w-2xl mx-auto">
              <CreatePostCard onCreatePost={() => setIsCreatePostModalOpen(true)} />
              
              <div className="space-y-4 mx-4 pb-20 lg:pb-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-start space-x-3 mb-4">
                          <Skeleton className="w-12 h-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-20 w-full mb-4" />
                        <Skeleton className="h-64 w-full rounded-lg" />
                      </div>
                    ))}
                  </div>
                ) : posts && posts.length > 0 ? (
                  posts.map((post) => <PostCard key={post.id} post={post} />)
                ) : (
                  <div className="bg-card border border-border rounded-lg p-8 text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
                    <p className="text-muted-foreground">Be the first to share something!</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="hidden xl:block w-80 p-6">
              <TrendingSection />
              <SuggestedConnections />
            </div>
          </div>
        </div>
      </div>
      
      <MobileBottomNav onCreatePost={() => setIsCreatePostModalOpen(true)} />
      
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
      />
    </div>
  );
}
