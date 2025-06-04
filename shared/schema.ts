import { pgTable, text, serial, integer, timestamp, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define user roles
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  OWNER = "owner"
}

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  address: text("address").notNull(),
  role: text("role", { enum: [UserRole.ADMIN, UserRole.USER, UserRole.OWNER] }).notNull().default(UserRole.USER),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true
});

// Stores table
export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  address: text("address").notNull(),
  imageUrl: text("image_url"),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStoreSchema = createInsertSchema(stores).omit({ 
  id: true,
  createdAt: true
});

// Ratings table
export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  rating: integer("rating").notNull(),
  storeId: integer("store_id").references(() => stores.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    userStoreIdx: uniqueIndex("user_store_idx").on(table.userId, table.storeId),
  };
});

export const insertRatingSchema = createInsertSchema(ratings).omit({ 
  id: true,
  createdAt: true
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Store = typeof stores.$inferSelect;
export type InsertStore = z.infer<typeof insertStoreSchema>;

export type Rating = typeof ratings.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;

// Additional structures for frontend
export type StoreWithRating = Store & {
  averageRating: number;
  totalRatings: number;
  userRating?: number;
};

export type UserWithStore = User & {
  storeName?: string;
  storeRating?: number;
};

export type RatingWithUser = Rating & {
  userName: string;
  userEmail: string;
};

export type StoreStatistics = {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
};
