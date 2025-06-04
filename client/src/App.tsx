import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import { UserRole } from "@shared/schema";

// Admin pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminStores from "@/pages/admin/stores";
import AdminUsers from "@/pages/admin/users";

// Normal user pages
import UserDashboard from "@/pages/user/dashboard";
import UserStores from "@/pages/user/stores";
import UserProfile from "@/pages/user/profile";

// Store owner pages
import OwnerDashboard from "@/pages/owner/dashboard";
import OwnerProfile from "@/pages/owner/profile";

// Root component that redirects based on user role
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

function RootRedirect() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return <Redirect to="/auth" />;
  }
  
  switch (user.role) {
    case UserRole.ADMIN:
      return <Redirect to="/admin/dashboard" />;
    case UserRole.OWNER:
      return <Redirect to="/owner/dashboard" />;
    case UserRole.USER:
      return <Redirect to="/user/dashboard" />;
    default:
      return <Redirect to="/auth" />;
  }
}

function Router() {
  return (
    <Switch>
      {/* Root route redirects based on user role */}
      <Route path="/" component={RootRedirect} />
      
      {/* Auth page */}
      <Route path="/auth" component={AuthPage} />
      
      {/* Admin routes */}
      <ProtectedRoute 
        path="/admin/dashboard" 
        component={AdminDashboard} 
        allowedRoles={[UserRole.ADMIN]} 
      />
      <ProtectedRoute 
        path="/admin/stores" 
        component={AdminStores} 
        allowedRoles={[UserRole.ADMIN]} 
      />
      <ProtectedRoute 
        path="/admin/users" 
        component={AdminUsers} 
        allowedRoles={[UserRole.ADMIN]} 
      />
      
      {/* Normal user routes */}
      <ProtectedRoute 
        path="/user/dashboard" 
        component={UserDashboard} 
        allowedRoles={[UserRole.USER]} 
      />
      <ProtectedRoute 
        path="/user/stores" 
        component={UserStores} 
        allowedRoles={[UserRole.USER]} 
      />
      <ProtectedRoute 
        path="/user/profile" 
        component={UserProfile} 
        allowedRoles={[UserRole.USER]} 
      />
      
      {/* Store owner routes */}
      <ProtectedRoute 
        path="/owner/dashboard" 
        component={OwnerDashboard} 
        allowedRoles={[UserRole.OWNER]} 
      />
      <ProtectedRoute 
        path="/owner/profile" 
        component={OwnerProfile} 
        allowedRoles={[UserRole.OWNER]} 
      />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
