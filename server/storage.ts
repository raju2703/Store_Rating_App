import { users, stores, ratings, User, InsertUser, Store, InsertStore, Rating, InsertRating, StoreWithRating, UserWithStore, RatingWithUser, StoreStatistics, UserRole } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: number, password: string): Promise<User | undefined>;
  getAllUsers(): Promise<UserWithStore[]>;
  getUsersByRole(role: UserRole): Promise<User[]>;
  
  // Store operations
  getStore(id: number): Promise<Store | undefined>;
  createStore(store: InsertStore): Promise<Store>;
  getAllStores(): Promise<StoreWithRating[]>;
  getStoresByName(name: string): Promise<StoreWithRating[]>;
  getStoresByAddress(address: string): Promise<StoreWithRating[]>;
  getStoreByOwner(ownerId: number): Promise<Store | undefined>;
  calculateStoreRating(store: Store): Promise<StoreWithRating>; // Added to interface
  
  // Rating operations
  getRating(userId: number, storeId: number): Promise<Rating | undefined>;
  createRating(rating: InsertRating): Promise<Rating>;
  updateRating(userId: number, storeId: number, rating: number): Promise<Rating | undefined>;
  getRatingsByStore(storeId: number): Promise<RatingWithUser[]>;
  
  // Statistics
  getStatistics(): Promise<StoreStatistics>;
  
  // Session store
  sessionStore: any; // Use any type for session store to avoid TypeScript issues
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private stores: Map<number, Store>;
  private ratings: Map<string, Rating>;
  sessionStore: any; // Use any type for session store to avoid TypeScript issues
  private userId: number;
  private storeId: number;
  private ratingId: number;

  constructor() {
    this.users = new Map();
    this.stores = new Map();
    this.ratings = new Map();
    this.userId = 1;
    this.storeId = 1;
    this.ratingId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // We'll initialize the admin user in an async initialization method
    this.initAdminUser();
  }

  private async initAdminUser() {
    try {
      // Import the hashPassword function from auth-utils.ts
      const { hashPassword } = await import('./auth-utils');
      
      // Hash the admin password
      const hashedPassword = await hashPassword("Admin123!");
      
      // Create admin user with hashed password
      this.createUser({
        name: "System Administrator",
        email: "admin@example.com",
        password: hashedPassword,
        address: "123 Admin Street, Admin City, 12345",
        role: UserRole.ADMIN
      });
    } catch (error) {
      console.error("Failed to initialize admin user:", error);
      
      // Fallback: create admin with a pre-hashed password if dynamic import fails
      // This is a hardcoded hash of "Admin123!" - only for demonstration purposes
      const fallbackHashedPassword = "c42a54b44af0b0a533a7c1545e4eb4afefd0e0264f0764475eb498f4bb331ae2238c358c9bf1e52765dd9c611cb093d9eb5cfce8c87fe4c3744464bc508c7b0f.c70bd28f26df2f19a675d49a3c1d9e52";
      
      this.createUser({
        name: "System Administrator",
        email: "admin@example.com",
        password: fallbackHashedPassword,
        address: "123 Admin Street, Admin City, 12345",
        role: UserRole.ADMIN
      });
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    // Create a valid User object with proper typing
    const user: User = {
      id,
      name: insertUser.name,
      email: insertUser.email,
      password: insertUser.password,
      address: insertUser.address,
      role: insertUser.role || UserRole.USER,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPassword(id: number, password: string): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, password };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<UserWithStore[]> {
    const users = Array.from(this.users.values());
    return Promise.all(users.map(async (user) => {
      if (user.role === UserRole.OWNER) {
        const store = await this.getStoreByOwner(user.id);
        if (store) {
          const storeWithRating = await this.calculateStoreRating(store);
          return {
            ...user,
            storeName: store.name,
            storeRating: storeWithRating.averageRating
          };
        }
      }
      return { ...user };
    }));
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  // Store operations
  async getStore(id: number): Promise<Store | undefined> {
    return this.stores.get(id);
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    const id = this.storeId++;
    // Create a valid Store object with proper typing
    const store: Store = {
      id,
      name: insertStore.name,
      email: insertStore.email,
      address: insertStore.address,
      ownerId: insertStore.ownerId,
      createdAt: new Date()
    };
    this.stores.set(id, store);
    return store;
  }

  async getStoreByOwner(ownerId: number): Promise<Store | undefined> {
    return Array.from(this.stores.values()).find(
      (store) => store.ownerId === ownerId
    );
  }

  // Make this public so it can be used in routes
  async calculateStoreRating(store: Store): Promise<StoreWithRating> {
    const storeRatings = Array.from(this.ratings.values()).filter(
      r => r.storeId === store.id
    );
    
    const totalRatings = storeRatings.length;
    const sum = storeRatings.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = totalRatings > 0 ? sum / totalRatings : 0;
    
    return {
      ...store,
      averageRating,
      totalRatings
    };
  }

  private async calculateStoreRatingForUser(store: Store, userId: number): Promise<StoreWithRating> {
    const storeWithRating = await this.calculateStoreRating(store);
    const userRating = await this.getRating(userId, store.id);
    
    return {
      ...storeWithRating,
      userRating: userRating?.rating
    };
  }

  async getAllStores(): Promise<StoreWithRating[]> {
    const stores = Array.from(this.stores.values());
    return Promise.all(stores.map(store => this.calculateStoreRating(store)));
  }

  async getStoresByName(name: string): Promise<StoreWithRating[]> {
    const stores = Array.from(this.stores.values()).filter(
      store => store.name.toLowerCase().includes(name.toLowerCase())
    );
    return Promise.all(stores.map(store => this.calculateStoreRating(store)));
  }

  async getStoresByAddress(address: string): Promise<StoreWithRating[]> {
    const stores = Array.from(this.stores.values()).filter(
      store => store.address.toLowerCase().includes(address.toLowerCase())
    );
    return Promise.all(stores.map(store => this.calculateStoreRating(store)));
  }

  // Rating operations
  private getRatingKey(userId: number, storeId: number): string {
    return `${userId}-${storeId}`;
  }

  async getRating(userId: number, storeId: number): Promise<Rating | undefined> {
    const key = this.getRatingKey(userId, storeId);
    return this.ratings.get(key);
  }

  async createRating(insertRating: InsertRating): Promise<Rating> {
    const id = this.ratingId++;
    const key = this.getRatingKey(insertRating.userId, insertRating.storeId);
    // Create a valid Rating object with proper typing
    const rating: Rating = {
      id,
      rating: insertRating.rating,
      userId: insertRating.userId,
      storeId: insertRating.storeId,
      createdAt: new Date()
    };
    this.ratings.set(key, rating);
    return rating;
  }

  async updateRating(userId: number, storeId: number, rating: number): Promise<Rating | undefined> {
    const key = this.getRatingKey(userId, storeId);
    const existingRating = this.ratings.get(key);
    
    if (!existingRating) return undefined;
    
    const updatedRating = { ...existingRating, rating };
    this.ratings.set(key, updatedRating);
    return updatedRating;
  }

  async getRatingsByStore(storeId: number): Promise<RatingWithUser[]> {
    const storeRatings = Array.from(this.ratings.values()).filter(
      rating => rating.storeId === storeId
    );
    
    return Promise.all(storeRatings.map(async (rating) => {
      const user = await this.getUser(rating.userId);
      return {
        ...rating,
        userName: user?.name || "Unknown",
        userEmail: user?.email || "unknown@example.com"
      };
    }));
  }

  // Statistics
  async getStatistics(): Promise<StoreStatistics> {
    return {
      totalUsers: this.users.size,
      totalStores: this.stores.size,
      totalRatings: this.ratings.size
    };
  }

  // Get all stores with user rating
  async getStoresWithUserRating(userId: number): Promise<StoreWithRating[]> {
    const stores = Array.from(this.stores.values());
    return Promise.all(stores.map(store => this.calculateStoreRatingForUser(store, userId)));
  }
}

export const storage = new MemStorage();
