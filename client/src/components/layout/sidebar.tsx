import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  User,
  Settings
} from "lucide-react";
import { UserRole } from "@shared/schema";

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
}

function NavLink({ href, icon, children, isActive }: NavLinkProps) {
  // Fix for nested <a> tags issue by using div instead of <a> tag
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
          isActive 
            ? "text-primary-600 bg-primary-50" 
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        )}
      >
        {icon}
        {children}
      </div>
    </Link>
  );
}

interface SidebarProps {
  userRole: UserRole;
}

export function Sidebar({ userRole }: SidebarProps) {
  const [location] = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="px-4 py-6">
        <div className="flex flex-col">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Navigation
          </div>
          
          <nav className="mt-5 space-y-1">
            {userRole === UserRole.ADMIN && (
              <>
                <NavLink 
                  href="/admin/dashboard" 
                  icon={<LayoutDashboard className="mr-3 h-5 w-5" />}
                  isActive={location === "/admin/dashboard"}
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  href="/admin/stores" 
                  icon={<Store className="mr-3 h-5 w-5" />}
                  isActive={location === "/admin/stores"}
                >
                  Stores
                </NavLink>
                <NavLink 
                  href="/admin/users" 
                  icon={<Users className="mr-3 h-5 w-5" />}
                  isActive={location === "/admin/users"}
                >
                  Users
                </NavLink>
              </>
            )}

            {userRole === UserRole.USER && (
              <>
                <NavLink 
                  href="/user/dashboard" 
                  icon={<LayoutDashboard className="mr-3 h-5 w-5" />}
                  isActive={location === "/user/dashboard"}
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  href="/user/stores" 
                  icon={<Store className="mr-3 h-5 w-5" />}
                  isActive={location === "/user/stores"}
                >
                  Browse Stores
                </NavLink>
                <NavLink 
                  href="/user/profile" 
                  icon={<Settings className="mr-3 h-5 w-5" />}
                  isActive={location === "/user/profile"}
                >
                  My Profile
                </NavLink>
              </>
            )}

            {userRole === UserRole.OWNER && (
              <>
                <NavLink 
                  href="/owner/dashboard" 
                  icon={<LayoutDashboard className="mr-3 h-5 w-5" />}
                  isActive={location === "/owner/dashboard"}
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  href="/owner/profile" 
                  icon={<Settings className="mr-3 h-5 w-5" />}
                  isActive={location === "/owner/profile"}
                >
                  My Profile
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </div>
    </aside>
  );
}
