import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { comparePasswords } from "./auth-utils";
import { storage } from "./storage";
import { User } from "@shared/schema";
import { validateUserSchema, loginSchema } from "@shared/validation";

declare global {
  namespace Express {
    interface User {
      id: number;
      name: string;
      email: string;
      address: string;
      role: string;
      createdAt: Date;
    }
  }
}

export async function setupAuth(app: Express) {
  const sessionSecret = process.env.SESSION_SECRET || "change-me-in-production";
  
  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          // Exclude password from the user object
          const { password: _, ...safeUser } = user;
          return done(null, safeUser);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      // Exclude password from the user object
      const { password: _, ...safeUser } = user;
      done(null, safeUser);
    } catch (error) {
      done(error);
    }
  });

  // Register endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      // Validate request body
      const parseResult = validateUserSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.message });
      }

      // Check if user with the same email already exists
      const existingUser = await storage.getUserByEmail(req.body.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // Create the user
      const user = await storage.createUser(parseResult.data);

      // Auto-login the new user
      req.login({ ...user, password: undefined }, (err) => {
        if (err) return next(err);
        return res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });

  // Login endpoint
  app.post("/api/login", (req, res, next) => {
    // Validate request body
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.message });
    }

    passport.authenticate("local", (err: Error, user: Express.User) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(200).json(user);
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Current user endpoint
  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }
    return res.status(401).json({ message: "Not authenticated" });
  });

  // Change password endpoint
  app.post("/api/user/change-password", async (req, res, next) => {
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

      // Get the user with password from the database
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verify current password
      const passwordMatches = await comparePasswords(currentPassword, user.password);
      if (!passwordMatches) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      // Update password
      await storage.updateUserPassword(user.id, newPassword);
      
      return res.json({ message: "Password updated successfully" });
    } catch (error) {
      next(error);
    }
  });
}