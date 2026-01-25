import type { EditorMode } from "../types";
import { Button } from "@components/ui/elements/button";
import { Type, Pencil } from "lucide-react";

interface ToolbarProps {
    mode: EditorMode;
    setMode: (mode: EditorMode) => void;
}

export default function Toolbar({ mode, setMode }: ToolbarProps) {
    return (
        <div className="flex items-center gap-2 p-2 border-b bg-muted/20">
            <Button
                variant={mode === 'text' ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setMode('text')}
                className="gap-2"
            >
                <Type className="w-4 h-4" />
                Text
            </Button>
            <Button
                variant={mode === 'draw' ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setMode('draw')}
                className="gap-2"
            >
                <Pencil className="w-4 h-4" />
                Draw
            </Button>
        </div>
    );
}
