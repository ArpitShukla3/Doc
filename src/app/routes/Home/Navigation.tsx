import { Menu, Share } from "lucide-react";
import SearchBar from "./SearchBar";
import { Button } from "@components/ui/elements/button";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/elements/avatar";
import { useOnlineStatus } from "@hooks/isOnline";
import { useThemeToggle } from "@hooks/useTheme";
export default function Navigation() {
    const {theme, toggleTheme} = useThemeToggle();
    const isOnline = useOnlineStatus();
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Box 1 */}
        <div className="flex items-center gap-2 shrink-0">
          <Menu className="clickable"/>
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
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        {/* Box 3 ends */}
        </div>

      </div>
    </header>
  );
}
