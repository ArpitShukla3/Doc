import { useState, useRef, useEffect } from 'react';
import type { EditorMode, DrawTool, AllToolSettings } from '../types';
import type { ActiveFormats } from './TextLayer';
import { Button } from '@components/ui/elements/button';
import { Bold, Italic, Underline, Pencil, Eraser, Type, ChevronDown, Check, Highlighter, Code, SquareCode } from 'lucide-react';

interface FloatingMenubarProps {
    mode: EditorMode;
    drawTool: DrawTool;
    setMode: (mode: EditorMode) => void;
    setDrawTool: (tool: DrawTool) => void;
    toolSettings: AllToolSettings;
    setToolSettings: (settings: AllToolSettings) => void;
    onFormat: (format: string) => void;
    onInsertEmbed: (type: string, value?: any) => void;
    activeFormats?: ActiveFormats;
}

export default function FloatingMenubar({
    mode,
    drawTool,
    setMode,
    setDrawTool,
    toolSettings,
    setToolSettings,
    onFormat,
    onInsertEmbed,
    activeFormats
}: FloatingMenubarProps) {
    const isText = mode === 'text';
    const [showSettings, setShowSettings] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFA500', '#FFFF00', '#FF00FF', '#00FFFF'];
    const widths = [2, 4, 6, 8, 10, 12, 16, 20];

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowSettings(false);
            }
        };

        if (showSettings) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSettings]);

    const handleTextAction = (action: () => void) => {
        if (!isText) {
            setMode('text');
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

    const updateSettings = (partialSettings: { color?: string; width?: number }) => {
        if (drawTool === 'eraser') return;

        const toolType = drawTool as 'pen' | 'highlighter';
        setToolSettings({
            ...toolSettings,
            [toolType]: {
                ...toolSettings[toolType],
                ...partialSettings
            }
        });
    };

    const currentSettings = drawTool === 'highlighter' ? toolSettings.highlighter : toolSettings.pen;

    return (
        <div
            className="absolute top-24 left-1/2 transform -translate-x-1/2 h-10 flex items-center gap-1 p-1 rounded-full bg-card border shadow-lg z-50 transition-all duration-300 ease-in-out fixed"
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

                <div className="w-px h-4 bg-gray-200 mx-1" />

                <Button
                    variant={activeFormats?.isBold ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => handleTextAction(() => onFormat('bold'))}
                    className={`rounded-full w-8 h-8 p-0 ${!isText ? 'opacity-50' : ''}`}
                    disabled={!isText}
                >
                    <Bold className="w-4 h-4" />
                </Button>
                <Button
                    variant={activeFormats?.isItalic ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => handleTextAction(() => onFormat('italic'))}
                    className={`rounded-full w-8 h-8 p-0 ${!isText ? 'opacity-50' : ''}`}
                    disabled={!isText}
                >
                    <Italic className="w-4 h-4" />
                </Button>
                <Button
                    variant={activeFormats?.isUnderline ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => handleTextAction(() => onFormat('underline'))}
                    className={`rounded-full w-8 h-8 p-0 ${!isText ? 'opacity-50' : ''}`}
                    disabled={!isText}
                >
                    <Underline className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTextAction(() => onFormat('code'))}
                    className={`rounded-full w-8 h-8 p-0 ${!isText ? 'opacity-50' : ''}`}
                    disabled={!isText}
                >
                    <Code className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTextAction(() => onInsertEmbed('code-block-copy', ' '))} // Insert with space to ensure content
                    className={`rounded-full w-8 h-8 p-0 ${!isText ? 'opacity-50' : ''}`}
                    disabled={!isText}
                    title="Code Block"
                >
                    <SquareCode className="w-4 h-4" />
                </Button>
            </div>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Draw Tools */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${!isText ? 'bg-muted/50' : ''}`}>
                {/* Pen Tool */}
                <div className="relative">
                    <div className="flex items-center gap-0.5">
                        <Button
                            variant={!isText && drawTool === 'pen' ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => handleDrawAction('pen')}
                            className="rounded-full w-8 h-8 p-0"
                            title="Pen"
                        >
                            <Pencil className="w-4 h-4" style={{ color: !isText && drawTool === 'pen' ? toolSettings.pen.color : undefined }} />
                        </Button>
                        {!isText && drawTool === 'pen' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowSettings(!showSettings)}
                                className="rounded-full w-4 h-8 p-0 hover:bg-muted"
                                title="Pen Settings"
                            >
                                <ChevronDown className="w-3 h-3" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Highlighter Tool */}
                <div className="relative">
                    <div className="flex items-center gap-0.5">
                        <Button
                            variant={!isText && drawTool === 'highlighter' ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => handleDrawAction('highlighter')}
                            className="rounded-full w-8 h-8 p-0"
                            title="Highlighter"
                        >
                            <Highlighter className="w-4 h-4" style={{ color: !isText && drawTool === 'highlighter' ? toolSettings.highlighter.color : undefined }} />
                        </Button>
                        {!isText && drawTool === 'highlighter' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowSettings(!showSettings)}
                                className="rounded-full w-4 h-8 p-0 hover:bg-muted"
                                title="Highlighter Settings"
                            >
                                <ChevronDown className="w-3 h-3" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Shared Settings Popup */}
                {showSettings && !isText && (drawTool === 'pen' || drawTool === 'highlighter') && (
                    <div
                        ref={settingsRef}
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-3 bg-sidebar border rounded-lg shadow-xl min-w-[200px] flex flex-col gap-3 z-50 animate-in fade-in slide-in-from-top-2"
                    >
                        {/* Color Picker */}
                        <div className="grid grid-cols-4 gap-2">
                            {colors.map(color => (
                                <button
                                    key={color}
                                    className="w-8 h-8 rounded-full border border-gray-200 hover:scale-110 transition-transform flex items-center justify-center"
                                    style={{ backgroundColor: color }}
                                    onClick={() => updateSettings({ color })}
                                >
                                    {currentSettings.color === color && <Check className={`w-4 h-4 ${['#FFFF00', '#00FFFF', '#FFFFFF'].includes(color) ? 'text-black' : 'text-white'} drop-shadow-sm`} />}
                                </button>
                            ))}
                        </div>

                        {/* Width Picker */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-2">
                            {widths.map(width => (
                                <button
                                    key={width}
                                    className={`w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center ${currentSettings.width === width ? 'bg-muted ring-1 ring-muted' : ''}`}
                                    onClick={() => updateSettings({ width })}
                                >
                                    <div
                                        className="rounded-full bg-secondary-foreground/80"
                                        style={{ width: Math.min(width, 24), height: Math.min(width, 24) }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

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
