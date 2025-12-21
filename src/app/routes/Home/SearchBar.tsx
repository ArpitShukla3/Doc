import { CustomTooltip } from "@components/ui/elements/tooltip";
import { Command, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function SearchBar() {
    const inputref = useRef<HTMLInputElement>(null);
    const inputFocusShortcut = (e:Event) => {
        e.preventDefault();
        inputref.current?.focus();
    }
    const inputBlur=() => {
        inputref.current?.blur();
    }
    const inputClear=() => {
        setInputText("");
    }
    const inputUnFocusAndClearShortcut = (e:Event) => {
        e.preventDefault();
        inputBlur();
        inputClear();
    }
    useHotkeys("mod+k", inputFocusShortcut, [], {enableOnFormTags: true});
    useHotkeys("esc", inputUnFocusAndClearShortcut, [], {enableOnFormTags: true});

    const [inputText, setInputText] = useState("");
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    }
    const [isMac] = useState(()=>{
        if(navigator.platform.toLowerCase().includes('mac')){
            return true;
        }
        return false;
    });
    return (
        <div className="flex items-center gap-3 w-1/3 rounded-md bg-secondary px-4 py-2 text-muted-foreground">

            {/* Search icon */}
            <Search className="h-4 w-4 shrink-0" />

            {/* Input */}
            <input
                type="text"
                placeholder="Search or jump to..."
                className="
          w-full bg-transparent text-secondary-foreground
          placeholder:text-muted-foreground
          outline-none border-none
          focus:outline-none focus:ring-0
        "
                ref={inputref}
                value={inputText}
                onChange={handleInputChange}
            />

            {/* Shortcut */}
            <CustomTooltip tooltipContent={`Press ${isMac ? "⌘K" : "Ctrl+K"} to search`}>
            <div className="flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                {isMac ? <Command className="h-3.5 w-3.5" /> : <span>Ctrl+</span>}
                <span>K</span>
            </div>
            </CustomTooltip>
        </div>
    );
}
