import { type User, type InsertUser, type Post, type InsertPost, type Comment, type InsertComment, type Like, type InsertLike, type PostWithAuthor, type CommentWithAuthor } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Posts
  getPosts(): Promise<PostWithAuthor[]>;
  getPost(id: string): Promise<PostWithAuthor | undefined>;
  createPost(authorId: string, post: InsertPost): Promise<Post>;
  updatePost(id: string, updates: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: string): Promise<boolean>;
  
  // Comments
  getCommentsByPostId(postId: string): Promise<CommentWithAuthor[]>;
  createComment(authorId: string, comment: InsertComment): Promise<Comment>;
  deleteComment(id: string): Promise<boolean>;
  
  // Likes
  toggleLike(userId: string, postId: string): Promise<boolean>; // returns true if liked, false if unliked
  isPostLikedByUser(userId: string, postId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private posts: Map<string, Post> = new Map();
  private comments: Map<string, Comment> = new Map();
  private likes: Map<string, Like> = new Map();

  constructor() {
    // Create a default user
    const defaultUser: User = {
      id: "user-1",
      username: "alexj",
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      avatar: insertUser.avatar || null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getPosts(): Promise<PostWithAuthor[]> {
    const posts = Array.from(this.posts.values())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    
    const postsWithAuthors: PostWithAuthor[] = [];
    for (const post of posts) {
      const author = await this.getUser(post.authorId);
      if (author) {
        postsWithAuthors.push({ ...post, author });
      }
    }
    return postsWithAuthors;
  }

  async getPost(id: string): Promise<PostWithAuthor | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const author = await this.getUser(post.authorId);
    if (!author) return undefined;
    
    return { ...post, author };
  }

  async createPost(authorId: string, insertPost: InsertPost): Promise<Post> {
    const id = randomUUID();
    const post: Post = {
      ...insertPost,
      id,
      authorId,
      imageUrl: insertPost.imageUrl || null,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: new Date(),
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: string, updates: Partial<InsertPost>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;

    const updatedPost = { ...post, ...updates };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: string): Promise<boolean> {
    return this.posts.delete(id);
  }

  async getCommentsByPostId(postId: string): Promise<CommentWithAuthor[]> {
    const comments = Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
    
    const commentsWithAuthors: CommentWithAuthor[] = [];
    for (const comment of comments) {
      const author = await this.getUser(comment.authorId);
      if (author) {
        commentsWithAuthors.push({ ...comment, author });
      }
    }
    return commentsWithAuthors;
  }

  async createComment(authorId: string, insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = {
      ...insertComment,
      id,
      authorId,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);

    // Update post comments count
    const post = this.posts.get(insertComment.postId);
    if (post) {
      post.commentsCount = (post.commentsCount || 0) + 1;
      this.posts.set(post.id, post);
    }

    return comment;
  }

  async deleteComment(id: string): Promise<boolean> {
    const comment = this.comments.get(id);
    if (!comment) return false;

    const deleted = this.comments.delete(id);
    
    if (deleted) {
      // Update post comments count
      const post = this.posts.get(comment.postId);
      if (post && (post.commentsCount || 0) > 0) {
        post.commentsCount = (post.commentsCount || 0) - 1;
        this.posts.set(post.id, post);
      }
    }

    return deleted;
  }

  async toggleLike(userId: string, postId: string): Promise<boolean> {
    const existingLike = Array.from(this.likes.values())
      .find(like => like.userId === userId && like.postId === postId);

    if (existingLike) {
      // Unlike
      this.likes.delete(existingLike.id);
      
      // Update post likes count
      const post = this.posts.get(postId);
      if (post && (post.likesCount || 0) > 0) {
        post.likesCount = (post.likesCount || 0) - 1;
        this.posts.set(post.id, post);
      }
      
      return false;
    } else {
      // Like
      const id = randomUUID();
      const like: Like = {
        id,
        userId,
        postId,
        createdAt: new Date(),
      };
      this.likes.set(id, like);

      // Update post likes count
      const post = this.posts.get(postId);
      if (post) {
        post.likesCount = (post.likesCount || 0) + 1;
        this.posts.set(post.id, post);
      }

      return true;
    }
  }

  async isPostLikedByUser(userId: string, postId: string): Promise<boolean> {
    return Array.from(this.likes.values())
      .some(like => like.userId === userId && like.postId === postId);
  }
}

export const storage = new MemStorage();
