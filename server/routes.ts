import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { hashPassword, comparePasswords } from "./auth-utils";
import { validateUserSchema, validateStoreSchema, validateRatingSchema, changePasswordSchema } from "@shared/validation";
import { UserRole } from "@shared/schema";
import { ZodError } from "zod";

// Middleware to check if user is authenticated
const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Middleware to check if user has admin role
const ensureAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user.role === UserRole.ADMIN) {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
};

// Middleware to check if user is a store owner
const ensureStoreOwner = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user.role === UserRole.OWNER) {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication with await since it's now async
  await setupAuth(app);

  // Error handling for validation errors
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors,
      });
    }
    next(err);
  });

  // Admin routes

  // Get dashboard statistics
  app.get("/api/admin/statistics", ensureAdmin, async (req, res) => {
    try {
      const stats = await storage.getStatistics();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Get all users with store details
  app.get("/api/admin/users", ensureAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove password from response
      const sanitizedUsers = users.map(({ password, ...rest }) => rest);
      res.json(sanitizedUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Create a new user (by admin)
  app.post("/api/admin/users", ensureAdmin, async (req, res) => {
    try {
      const userData = validateUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Get all stores with ratings
  app.get("/api/admin/stores", ensureAdmin, async (req, res) => {
    try {
      const stores = await storage.getAllStores();
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stores" });
    }
  });

  // Create a new store
  app.post("/api/admin/stores", ensureAdmin, async (req, res) => {
    try {
      const storeData = validateStoreSchema.parse(req.body);
      
      // Check if store with email already exists
      const existingUser = await storage.getUserByEmail(storeData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const store = await storage.createStore(storeData);
      res.status(201).json(store);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      }
      res.status(500).json({ message: "Failed to create store" });
    }
  });

  // User & Common routes

  // Get stores with filters and user ratings
  app.get("/api/stores", ensureAuthenticated, async (req, res) => {
    try {
      const { search } = req.query;
      let stores;
      
      if (search && typeof search === 'string') {
        // Try to find by name first
        stores = await storage.getStoresByName(search);
        
        // If no results, try to find by address
        if (stores.length === 0) {
          stores = await storage.getStoresByAddress(search);
        }
      } else {
        // Get all stores
        stores = await storage.getAllStores();
      }
      
      // If user is a normal user, include their rating for each store
      if (req.user && req.user.role === UserRole.USER) {
        stores = await Promise.all(
          stores.map(async (store) => {
            const userRating = await storage.getRating(req.user!.id, store.id);
            return {
              ...store,
              userRating: userRating?.rating
            };
          })
        );
      }
      
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stores" });
    }
  });

  // Submit or update a rating
  app.post("/api/ratings", ensureAuthenticated, async (req, res) => {
    try {
      // We know req.user is defined because of ensureAuthenticated middleware
      const user = req.user!;

      // Only normal users can submit ratings
      if (user.role !== UserRole.USER) {
        return res.status(403).json({ message: "Only normal users can submit ratings" });
      }
      
      const { storeId, rating } = validateRatingSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      // Check if store exists
      const store = await storage.getStore(storeId);
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      
      // Check if user already rated this store
      const existingRating = await storage.getRating(user.id, storeId);
      
      let result;
      if (existingRating) {
        // Update existing rating
        result = await storage.updateRating(user.id, storeId, rating);
      } else {
        // Create new rating
        result = await storage.createRating({
          userId: user.id,
          storeId,
          rating
        });
      }
      
      res.status(existingRating ? 200 : 201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      }
      res.status(500).json({ message: "Failed to submit rating" });
    }
  });

  // Change password
  app.post("/api/change-password", ensureAuthenticated, async (req, res) => {
    try {
      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
      
      // We know req.user is defined because of ensureAuthenticated middleware
      const userId = req.user!.id;
      
      // Get the current user
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify current password
      const isPasswordValid = await comparePasswords(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      // Update password
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUserPassword(user.id, hashedPassword);
      
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      }
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // Store Owner routes

  // Get owner's store with ratings
  app.get("/api/owner/store", ensureStoreOwner, async (req, res) => {
    try {
      // We know req.user is defined because of ensureStoreOwner middleware
      const userId = req.user!.id;
      const store = await storage.getStoreByOwner(userId);
      
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      
      const storeWithRating = await storage.calculateStoreRating(store);
      res.json(storeWithRating);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch store" });
    }
  });

  // Get ratings for owner's store
  app.get("/api/owner/ratings", ensureStoreOwner, async (req, res) => {
    try {
      // We know req.user is defined because of ensureStoreOwner middleware
      const userId = req.user!.id;
      const store = await storage.getStoreByOwner(userId);
      
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      
      const ratings = await storage.getRatingsByStore(store.id);
      res.json(ratings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ratings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
