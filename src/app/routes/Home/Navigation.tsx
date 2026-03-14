import { Menu, Share, LogOut } from "lucide-react";
import SearchBar from "./SearchBar";
import { Button } from "@components/ui/elements/button";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/elements/avatar";
import { useOnlineStatus } from "@hooks/isOnline";
import { useThemeToggle } from "@hooks/useTheme";
import { SidebarTrigger } from "@components/ui/elements/sidebar";
import useAuthStore from "@stores/authStore";
import { Link } from "react-router";
import { paths } from "@config/paths";

export default function Navigation() {
  const { theme, toggleTheme } = useThemeToggle();
  const isOnline = useOnlineStatus();
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Box 1 */}
        <div className="flex items-center gap-2 shrink-0">

          <SidebarTrigger>
            <Menu className="clickable" />
          </SidebarTrigger>

          <span >Product Strategy Q3</span>
        </div>
        {/* Box 2 */}
        <SearchBar />
        {/* Box 3 starts */}
        <div className="flex items-center gap-4 shrink-0">
          {/* <span>Status</span> */}
          <Button
            variant="secondary"
            size="sm"
            className={`${isOnline ? "bg-success text-success-foreground hover:bg-success/90" : "bg-destructive text-destructive-foreground hover:bg-destructive/90"}`}
          >
            {isOnline ? (
              <>
                Online
                <span className="ml-2 h-3 w-3 rounded-full bg-success-foreground animate-pulse" />
              </>
            ) : (
              <>
                Offline
                <span className="ml-2 h-3 w-3 rounded-full bg-destructive-foreground animate-pulse" />
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Share
            <Share className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleTheme}
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </Button>

          {/* Auth-aware section */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>
                  {user?.name?.slice(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="secondary"
                size="sm"
                onClick={logout}
                className="gap-1.5 text-destructive-foreground hover:bg-destructive/80 bg-destructive"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" asChild>
                <Link to={paths.auth.login}>Sign In</Link>
              </Button>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                asChild
              >
                <Link to={paths.auth.register}>Sign Up</Link>
              </Button>
            </div>
          )}
          {/* Box 3 ends */}
        </div>

      </div>
    </header>
  );
}
