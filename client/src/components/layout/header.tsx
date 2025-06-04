import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { UserRole } from "@shared/schema";

type HeaderProps = {
  toggleSidebar?: () => void;
};

export function Header({ toggleSidebar }: HeaderProps) {
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">Store Rating Platform</h1>
        </div>
        
        {user && (
          <>
            {/* Desktop user menu */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  {user.role === UserRole.ADMIN ? "Admin" : 
                   user.role === UserRole.OWNER ? "Store Owner" : "User"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="text-gray-700 hover:text-primary-500"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="text-gray-500 hover:text-gray-700"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </>
        )}
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && user && (
        <div className="md:hidden bg-white shadow-md pb-3 px-4">
          <div className="pt-2 pb-3 space-y-1">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                {user.role === UserRole.ADMIN ? "Admin" : 
                 user.role === UserRole.OWNER ? "Store Owner" : "User"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full text-left justify-start px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
