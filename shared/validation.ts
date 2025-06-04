import { z } from "zod";
import { insertUserSchema, insertStoreSchema, insertRatingSchema } from "./schema";

// Extended validation for user registration/creation
export const validateUserSchema = insertUserSchema.extend({
  name: z.string()
    .min(20, "Name must be at least 20 characters long")
    .max(60, "Name must be at most 60 characters long"),
  address: z.string()
    .max(400, "Address must be at most 400 characters long"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(16, "Password must be at most 16 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  email: z.string()
    .email("Must be a valid email address"),
});

// Login validation
export const loginSchema = z.object({
  email: z.string().email("Must be a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Extended validation for store creation
export const validateStoreSchema = insertStoreSchema.extend({
  name: z.string()
    .min(20, "Name must be at least 20 characters long")
    .max(60, "Name must be at most 60 characters long"),
  address: z.string()
    .max(400, "Address must be at most 400 characters long"),
  email: z.string()
    .email("Must be a valid email address"),
  imageUrl: z.string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? null : val),
});

// Password change validation
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(16, "Password must be at most 16 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Rating validation
export const validateRatingSchema = insertRatingSchema.extend({
  rating: z.number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});
