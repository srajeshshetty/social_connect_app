import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema, insertCommentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all posts
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getPosts();
      
      // Check if posts are liked by current user (using default user for now)
      const currentUserId = "user-1";
      const postsWithLikeStatus = await Promise.all(
        posts.map(async (post) => ({
          ...post,
          isLiked: await storage.isPostLikedByUser(currentUserId, post.id),
        }))
      );
      
      res.json(postsWithLikeStatus);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Create a new post
  app.post("/api/posts", async (req, res) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const currentUserId = "user-1"; // Using default user
      
      const post = await storage.createPost(currentUserId, postData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid post data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create post" });
      }
    }
  });

  // Update a post
  app.patch("/api/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertPostSchema.partial().parse(req.body);
      
      const updatedPost = await storage.updatePost(id, updates);
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(updatedPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid update data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update post" });
      }
    }
  });

  // Delete a post
  app.delete("/api/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePost(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Toggle like on a post
  app.post("/api/posts/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      const currentUserId = "user-1"; // Using default user
      
      const isLiked = await storage.toggleLike(currentUserId, id);
      res.json({ isLiked });
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // Get comments for a post
  app.get("/api/posts/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;
      const comments = await storage.getCommentsByPostId(id);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Create a comment
  app.post("/api/posts/:id/comments", async (req, res) => {
    try {
      const { id: postId } = req.params;
      const commentData = insertCommentSchema.parse({ ...req.body, postId });
      const currentUserId = "user-1"; // Using default user
      
      const comment = await storage.createComment(currentUserId, commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create comment" });
      }
    }
  });

  // Get current user
  app.get("/api/user", async (req, res) => {
    try {
      const currentUserId = "user-1"; // Using default user
      const user = await storage.getUser(currentUserId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
