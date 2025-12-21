import { Menu, Search, Share } from "lucide-react";
import SearchBar from "./SearchBar";
import { Button } from "@components/ui/elements/button";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/elements/avatar";
export default function Navigation() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 h-16">

        <div className="flex items-center gap-2 shrink-0">
          <Menu />
          <span className="font-medium">Product Strategy Q3</span>
        </div>

        <SearchBar />

        <div className="flex items-center gap-4 shrink-0">
          <span>Status</span>

          <Button
            variant="secondary"
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Share
            <Share className="ml-2 h-4 w-4" />
          </Button>

          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

      </div>
    </header>
  );
}
