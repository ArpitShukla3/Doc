import type { EditorMode, DrawTool } from '../types';
import { Button } from '@components/ui/elements/button';
import { Bold, Italic, Underline, Pencil, Eraser, Type } from 'lucide-react';

interface FloatingMenubarProps {
    mode: EditorMode;
    drawTool: DrawTool;
    setMode: (mode: EditorMode) => void;
    setDrawTool: (tool: DrawTool) => void;
    onFormat: (format: string) => void;
}

export default function FloatingMenubar({
    mode,
    drawTool,
    setMode,
    setDrawTool,
    onFormat
}: FloatingMenubarProps) {
    const isText = mode === 'text';

    const handleTextAction = (action: () => void) => {
        if (!isText) {
            setMode('text');
            // We can't format immediately if we weren't in text mode as selection might be lost or non-existent
            // But for simple "switch to text" it works. 
            // If the user wants to format, they usually need to select text first. 
            // So switching mode is the primary action.
        } else {
            action();
        }
    };

    const handleDrawAction = (tool: DrawTool) => {
        if (mode !== 'draw') {
            setMode('draw');
        }
        setDrawTool(tool);
    };

    return (
        <div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1 p-1 rounded-full bg-card border shadow-lg z-50 transition-all duration-300 ease-in-out"
        >
            {/* Text Tools */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${isText ? 'bg-muted/50' : ''}`}>
                <Button
                    variant={isText ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setMode('text')}
                    className="rounded-full w-8 h-8 p-0"
                    title="Text Mode"
                >
                    <Type className="w-4 h-4" />
                </Button>

                <div className="w-px h-4 bg-card mx-1" />

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTextAction(() => onFormat('bold'))}
                    className={`rounded-full w-8 h-8 p-0 ${!isText ? 'opacity-50' : ''}`}
                    disabled={!isText}
                >
                    <Bold className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTextAction(() => onFormat('italic'))}
                    className={`rounded-full w-8 h-8 p-0 ${!isText ? 'opacity-50' : ''}`}
                    disabled={!isText}
                >
                    <Italic className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTextAction(() => onFormat('underline'))}
                    className={`rounded-full w-8 h-8 p-0 ${!isText ? 'opacity-50' : ''}`}
                    disabled={!isText}
                >
                    <Underline className="w-4 h-4" />
                </Button>
            </div>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Draw Tools */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${!isText ? 'bg-muted/50' : ''}`}>
                <Button
                    variant={!isText && drawTool === 'pen' ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => handleDrawAction('pen')}
                    className="rounded-full w-8 h-8 p-0"
                    title="Pen"
                >
                    <Pencil className="w-4 h-4" />
                </Button>
                <Button
                    variant={!isText && drawTool === 'eraser' ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => handleDrawAction('eraser')}
                    className="rounded-full w-8 h-8 p-0"
                    title="Eraser"
                >
                    <Eraser className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
