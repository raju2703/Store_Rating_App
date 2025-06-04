import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocation } from "wouter";
import { validateUserSchema, loginSchema } from "@shared/validation";
import { UserRole } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import loginBackground from './Images/log9.avif';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof validateUserSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(validateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      password: "",
      role: UserRole.USER,
    },
  });

  // If user is already logged in, redirect to home page
  if (user) {
    // Use useEffect for navigation after render to avoid React hook errors
    setTimeout(() => {
      setLocation("/");
    }, 0);
    return null;
  }

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >

      {/* Info Section (Left Side) */}
      <div className="flex-1  flex flex-col   p-9">
        <div className="max-w-md space-y-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Discover and review your favorite stores
          </h1>
          <p className="text-lg">
            Discover trusted stores through real customer reviews.
            Your insights help build a smarter shopping community and support quality local businesses.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-medium">Find Stores</h3>
              <p className="text-sm text-gray-600">
                Discover stores in your neighborhood
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-medium">Rate & Review</h3>
              <p className="text-sm text-gray-600">
                Share your experiences with others
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-medium">Manage Your Store</h3>
              <p className="text-sm text-gray-600">
                Monitor ratings as a store owner
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-medium">Admin Dashboard</h3>
              <p className="text-sm text-gray-600">
                Oversee platform activity
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Section (Right Side - Bottom Aligned) */}
      <div className="flex-1 flex items-end justify-center p-11">
        <Card className="w-full max-w-md mb-5">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-bold">
              Store Rating Platform
            </CardTitle>
            <CardDescription className="text-center flex items-center justify-center gap-2">
              <span className="flex-1 border-t "></span>
              <span>Sign in to your account or create a new one</span>
              <span className="flex-1 border-t "></span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="login"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your password" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="Create a password" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-center text-gray-500 w-full">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );

}