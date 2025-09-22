import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const trendingTopics = [
  { tag: "#TechNews", posts: "12.5K" },
  { tag: "#FoodieLife", posts: "8.3K" },
  { tag: "#Adventure", posts: "6.7K" },
];

export default function TrendingSection() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <h2 className="font-bold text-lg mb-4" data-testid="text-trending-title">Trending Now</h2>
      <div className="space-y-4">
        {trendingTopics.map((topic, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground" data-testid={`text-trending-tag-${index}`}>
                {topic.tag}
              </p>
              <p className="text-muted-foreground text-sm" data-testid={`text-trending-posts-${index}`}>
                {topic.posts} posts
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              data-testid={`button-trending-options-${index}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
