import type { EditorMode, DrawTool } from "../types";
import { Button } from "@components/ui/elements/button";
import { Type, Pencil, Eraser } from "lucide-react";

interface ToolbarProps {
    mode: EditorMode;
    setMode: (mode: EditorMode) => void;
    tool: DrawTool;
    setTool: (tool: DrawTool) => void;
}

export default function Toolbar({ mode, setMode, tool, setTool }: ToolbarProps) {
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

            {mode === 'draw' && (
                <>
                    <div className="w-px h-4 bg-border mx-2" />
                    <Button
                        variant={tool === 'pen' ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setTool('pen')}
                        className="gap-2"
                    >
                        <Pencil className="w-3 h-3" />
                        Pen
                    </Button>
                    <Button
                        variant={tool === 'eraser' ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setTool('eraser')}
                        className="gap-2"
                    >
                        <Eraser className="w-3 h-3" />
                        Eraser
                    </Button>
                </>
            )}
        </div>
    );
}
