import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Building2, Gem, Ticket, Users, Star, Bell, LogOut, Menu, X, ChevronRight, Tag, Layers, Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";




const navigationItems = [
  { icon: Home, label: "Dashboard", path: "/admin" },
  { icon: Building2, label: "Branches", path: "/admin/branches" },
  { icon: Gem, label: "Products", path: "/admin/products" },
  { icon: Tag, label: "Categories", path: "/admin/categories" },
  { icon: Layers, label: "Metals", path: "/admin/metals" },
  { icon: Diamond, label: "Gems", path: "/admin/gems" },
  { icon: Ticket, label: "Requests", path: "/admin/requests" },
  { icon: Users, label: "Users & Roles", path: "/admin/users" },
  { icon: Star, label: "Reviews", path: "/admin/reviews" },
];



export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();


// Get roleId from localStorage and convert to number

  const roleId = Number(localStorage.getItem("roleId"));
  const roleName = localStorage.getItem("roleName");

  // Filter items based on roleId
  const filteredItems = navigationItems.filter((item) => {
    if (item.label === "Users & Roles" && (roleName ?? "").toLowerCase() !== "admin") {
      return false;
    }
    return true;
  });

  const handleLogout = () => {  
    logout();
    navigate("/");
  };

  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    return paths.map((path, index) => ({
        label: path.charAt(0).toUpperCase() + path.slice(1),
        path: "/" + paths.slice(0, index + 1).join("/"),
      }))
      .filter(crumb => crumb.label !== "Admin"); // remove 'Admin'
  };  
  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r border-border bg-card">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center justify-center px-4 mb-8">
            <Link to="/admin" className="flex flex-col items-center">
              <h1 className="text-2xl font-display font-bold text-primary">New Kalyani Jewellers</h1>
              <p className="text-sm text-muted-foreground">{`${roleName} Panel`}</p>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {filteredItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground elegant-shadow"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-50">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-5">
                <Link to="/admin" className="flex flex-col" onClick={() => setSidebarOpen(false)}>
                  <h1 className="text-xl font-display font-bold text-primary">New Kalyani Jewellers</h1>
                  {/* <p className="text-xs text-muted-foreground">Admin Panel</p> */}
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex-1 px-4 space-y-2">
                {filteredItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-card border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Breadcrumbs */}
            <nav className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.path} className="flex items-center">
                  {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
                  <Link
                    to={crumb.path}
                    className={`hover:text-foreground transition-colors ${
                      index === breadcrumbs.length - 1 ? "text-foreground font-medium" : ""
                    }`}
                  >
                    {crumb.label}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button> */}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user?.userFname?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">
                      {`${roleName}`}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
