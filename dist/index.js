var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/auth-utils.ts
var auth_utils_exports = {};
__export(auth_utils_exports, {
  comparePasswords: () => comparePasswords,
  hashPassword: () => hashPassword
});
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
var scryptAsync;
var init_auth_utils = __esm({
  "server/auth-utils.ts"() {
    "use strict";
    scryptAsync = promisify(scrypt);
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
import { pgTable, text, serial, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  address: text("address").notNull(),
  role: text("role", { enum: ["admin" /* ADMIN */, "user" /* USER */, "owner" /* OWNER */] }).notNull().default("user" /* USER */),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  address: text("address").notNull(),
  imageUrl: text("image_url"),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertStoreSchema = createInsertSchema(stores).omit({
  id: true,
  createdAt: true
});
var ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  rating: integer("rating").notNull(),
  storeId: integer("store_id").references(() => stores.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => {
  return {
    userStoreIdx: uniqueIndex("user_store_idx").on(table.userId, table.storeId)
  };
});
var insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  createdAt: true
});

// server/storage.ts
import session from "express-session";
import createMemoryStore from "memorystore";
var MemoryStore = createMemoryStore(session);
var MemStorage = class {
  users;
  stores;
  ratings;
  sessionStore;
  // Use any type for session store to avoid TypeScript issues
  userId;
  storeId;
  ratingId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.stores = /* @__PURE__ */ new Map();
    this.ratings = /* @__PURE__ */ new Map();
    this.userId = 1;
    this.storeId = 1;
    this.ratingId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
      // prune expired entries every 24h
    });
    this.initAdminUser();
  }
  async initAdminUser() {
    try {
      const { hashPassword: hashPassword2 } = await Promise.resolve().then(() => (init_auth_utils(), auth_utils_exports));
      const hashedPassword = await hashPassword2("Admin123!");
      this.createUser({
        name: "System Administrator",
        email: "admin@example.com",
        password: hashedPassword,
        address: "123 Admin Street, Admin City, 12345",
        role: "admin" /* ADMIN */
      });
    } catch (error) {
      console.error("Failed to initialize admin user:", error);
      const fallbackHashedPassword = "c42a54b44af0b0a533a7c1545e4eb4afefd0e0264f0764475eb498f4bb331ae2238c358c9bf1e52765dd9c611cb093d9eb5cfce8c87fe4c3744464bc508c7b0f.c70bd28f26df2f19a675d49a3c1d9e52";
      this.createUser({
        name: "System Administrator",
        email: "admin@example.com",
        password: fallbackHashedPassword,
        address: "123 Admin Street, Admin City, 12345",
        role: "admin" /* ADMIN */
      });
    }
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  async createUser(insertUser) {
    const id = this.userId++;
    const user = {
      id,
      name: insertUser.name,
      email: insertUser.email,
      password: insertUser.password,
      address: insertUser.address,
      role: insertUser.role || "user" /* USER */,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  async updateUserPassword(id, password) {
    const user = await this.getUser(id);
    if (!user) return void 0;
    const updatedUser = { ...user, password };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async getAllUsers() {
    const users3 = Array.from(this.users.values());
    return Promise.all(users3.map(async (user) => {
      if (user.role === "owner" /* OWNER */) {
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
  async getUsersByRole(role) {
    return Array.from(this.users.values()).filter((user) => user.role === role);
  }
  // Store operations
  async getStore(id) {
    return this.stores.get(id);
  }
  async createStore(insertStore) {
    const id = this.storeId++;
    const store = {
      id,
      name: insertStore.name,
      email: insertStore.email,
      address: insertStore.address,
      ownerId: insertStore.ownerId,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.stores.set(id, store);
    return store;
  }
  async getStoreByOwner(ownerId) {
    return Array.from(this.stores.values()).find(
      (store) => store.ownerId === ownerId
    );
  }
  // Make this public so it can be used in routes
  async calculateStoreRating(store) {
    const storeRatings = Array.from(this.ratings.values()).filter(
      (r) => r.storeId === store.id
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
  async calculateStoreRatingForUser(store, userId) {
    const storeWithRating = await this.calculateStoreRating(store);
    const userRating = await this.getRating(userId, store.id);
    return {
      ...storeWithRating,
      userRating: userRating?.rating
    };
  }
  async getAllStores() {
    const stores3 = Array.from(this.stores.values());
    return Promise.all(stores3.map((store) => this.calculateStoreRating(store)));
  }
  async getStoresByName(name) {
    const stores3 = Array.from(this.stores.values()).filter(
      (store) => store.name.toLowerCase().includes(name.toLowerCase())
    );
    return Promise.all(stores3.map((store) => this.calculateStoreRating(store)));
  }
  async getStoresByAddress(address) {
    const stores3 = Array.from(this.stores.values()).filter(
      (store) => store.address.toLowerCase().includes(address.toLowerCase())
    );
    return Promise.all(stores3.map((store) => this.calculateStoreRating(store)));
  }
  // Rating operations
  getRatingKey(userId, storeId) {
    return `${userId}-${storeId}`;
  }
  async getRating(userId, storeId) {
    const key = this.getRatingKey(userId, storeId);
    return this.ratings.get(key);
  }
  async createRating(insertRating) {
    const id = this.ratingId++;
    const key = this.getRatingKey(insertRating.userId, insertRating.storeId);
    const rating = {
      id,
      rating: insertRating.rating,
      userId: insertRating.userId,
      storeId: insertRating.storeId,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.ratings.set(key, rating);
    return rating;
  }
  async updateRating(userId, storeId, rating) {
    const key = this.getRatingKey(userId, storeId);
    const existingRating = this.ratings.get(key);
    if (!existingRating) return void 0;
    const updatedRating = { ...existingRating, rating };
    this.ratings.set(key, updatedRating);
    return updatedRating;
  }
  async getRatingsByStore(storeId) {
    const storeRatings = Array.from(this.ratings.values()).filter(
      (rating) => rating.storeId === storeId
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
  async getStatistics() {
    return {
      totalUsers: this.users.size,
      totalStores: this.stores.size,
      totalRatings: this.ratings.size
    };
  }
  // Get all stores with user rating
  async getStoresWithUserRating(userId) {
    const stores3 = Array.from(this.stores.values());
    return Promise.all(stores3.map((store) => this.calculateStoreRatingForUser(store, userId)));
  }
};
var storage = new MemStorage();

// server/auth.ts
init_auth_utils();
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";

// shared/validation.ts
import { z } from "zod";
var validateUserSchema = insertUserSchema.extend({
  name: z.string().min(20, "Name must be at least 20 characters long").max(60, "Name must be at most 60 characters long"),
  address: z.string().max(400, "Address must be at most 400 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long").max(16, "Password must be at most 16 characters long").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  email: z.string().email("Must be a valid email address")
});
var loginSchema = z.object({
  email: z.string().email("Must be a valid email address"),
  password: z.string().min(1, "Password is required")
});
var validateStoreSchema = insertStoreSchema.extend({
  name: z.string().min(20, "Name must be at least 20 characters long").max(60, "Name must be at most 60 characters long"),
  address: z.string().max(400, "Address must be at most 400 characters long"),
  email: z.string().email("Must be a valid email address"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")).transform((val) => val === "" ? null : val)
});
var changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters long").max(16, "Password must be at most 16 characters long").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Confirm password is required")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
var validateRatingSchema = insertRatingSchema.extend({
  rating: z.number().int("Rating must be an integer").min(1, "Rating must be at least 1").max(5, "Rating must be at most 5")
});

// server/auth.ts
async function setupAuth(app2) {
  const sessionSecret = process.env.SESSION_SECRET || "change-me-in-production";
  const sessionSettings = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1e3 * 60 * 60 * 24 * 7
      // 1 week
    },
    store: storage.sessionStore
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false);
        } else {
          const { password: _, ...safeUser } = user;
          return done(null, safeUser);
        }
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      const { password: _, ...safeUser } = user;
      done(null, safeUser);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const parseResult = validateUserSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.message });
      }
      const existingUser = await storage.getUserByEmail(req.body.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
      const user = await storage.createUser(parseResult.data);
      req.login({ ...user, password: void 0 }, (err) => {
        if (err) return next(err);
        return res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.message });
    }
    passport.authenticate("local", (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      req.login(user, (err2) => {
        if (err2) return next(err2);
        return res.status(200).json(user);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }
    return res.status(401).json({ message: "Not authenticated" });
  });
  app2.post("/api/user/change-password", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: "All fields are required" });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "New passwords do not match" });
      }
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const passwordMatches = await comparePasswords(currentPassword, user.password);
      if (!passwordMatches) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      await storage.updateUserPassword(user.id, newPassword);
      return res.json({ message: "Password updated successfully" });
    } catch (error) {
      next(error);
    }
  });
}

// server/routes.ts
init_auth_utils();
import { ZodError } from "zod";
var ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
var ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin" /* ADMIN */) {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
};
var ensureStoreOwner = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "owner" /* OWNER */) {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
};
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.use((err, req, res, next) => {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors
      });
    }
    next(err);
  });
  app2.get("/api/admin/statistics", ensureAdmin, async (req, res) => {
    try {
      const stats = await storage.getStatistics();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });
  app2.get("/api/admin/users", ensureAdmin, async (req, res) => {
    try {
      const users3 = await storage.getAllUsers();
      const sanitizedUsers = users3.map(({ password, ...rest }) => rest);
      res.json(sanitizedUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.post("/api/admin/users", ensureAdmin, async (req, res) => {
    try {
      const userData = validateUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      const hashedPassword = await hashPassword(userData.password);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  app2.get("/api/admin/stores", ensureAdmin, async (req, res) => {
    try {
      const stores3 = await storage.getAllStores();
      res.json(stores3);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stores" });
    }
  });
  app2.post("/api/admin/stores", ensureAdmin, async (req, res) => {
    try {
      const storeData = validateStoreSchema.parse(req.body);
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
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to create store" });
    }
  });
  app2.get("/api/stores", ensureAuthenticated, async (req, res) => {
    try {
      const { search } = req.query;
      let stores3;
      if (search && typeof search === "string") {
        stores3 = await storage.getStoresByName(search);
        if (stores3.length === 0) {
          stores3 = await storage.getStoresByAddress(search);
        }
      } else {
        stores3 = await storage.getAllStores();
      }
      if (req.user && req.user.role === "user" /* USER */) {
        stores3 = await Promise.all(
          stores3.map(async (store) => {
            const userRating = await storage.getRating(req.user.id, store.id);
            return {
              ...store,
              userRating: userRating?.rating
            };
          })
        );
      }
      res.json(stores3);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stores" });
    }
  });
  app2.post("/api/ratings", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      if (user.role !== "user" /* USER */) {
        return res.status(403).json({ message: "Only normal users can submit ratings" });
      }
      const { storeId, rating } = validateRatingSchema.parse({
        ...req.body,
        userId: user.id
      });
      const store = await storage.getStore(storeId);
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      const existingRating = await storage.getRating(user.id, storeId);
      let result;
      if (existingRating) {
        result = await storage.updateRating(user.id, storeId, rating);
      } else {
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
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to submit rating" });
    }
  });
  app2.post("/api/change-password", ensureAuthenticated, async (req, res) => {
    try {
      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isPasswordValid = await comparePasswords(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUserPassword(user.id, hashedPassword);
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  app2.get("/api/owner/store", ensureStoreOwner, async (req, res) => {
    try {
      const userId = req.user.id;
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
  app2.get("/api/owner/ratings", ensureStoreOwner, async (req, res) => {
    try {
      const userId = req.user.id;
      const store = await storage.getStoreByOwner(userId);
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      const ratings3 = await storage.getRatingsByStore(store.id);
      res.json(ratings3);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ratings" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 4e3;
  server.listen(port, () => {
    console.log(`\u{1F680} Serving on port ${port}`);
  });
})();
