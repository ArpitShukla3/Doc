import { useRef, useState, useEffect } from 'react';
import type { EditorMode, Stroke, Point, DrawTool, AllToolSettings } from '../types';

interface DrawLayerProps {
    mode: EditorMode;
    tool: DrawTool;
    toolSettings: AllToolSettings;
    onExpand?: () => void;
    onCheckResize?: (maxY: number) => void;
}

export default function DrawLayer({ mode, tool, toolSettings, onExpand, onCheckResize }: DrawLayerProps) {
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
    // Force re-render for animation
    const [, setTick] = useState(0);
    const svgRef = useRef<SVGSVGElement>(null);
    const isDrawing = useRef(false);
    const rafRef = useRef<number | null>(null);

    const [cursorPos, setCursorPos] = useState<Point | null>(null);

    // Fade Logic

    // Fade Logic
    useEffect(() => {
        // If we are NOT in highlighter mode (either text mode, or draw mode but pen/eraser)
        // Then start fading any existing highlighter strokes that haven't started fading yet
        const isHighlighterActive = mode === 'draw' && tool === 'highlighter';

        if (!isHighlighterActive) {
            setStrokes(prev => prev.map(stroke => {
                if (stroke.tool === 'highlighter' && !stroke.fadeStart) {
                    return { ...stroke, fadeStart: Date.now() };
                }
                return stroke;
            }));
        }
    }, [mode, tool]);

    // Animation Loop
    useEffect(() => {
        const animate = () => {
            const now = Date.now();
            let needsUpdate = false;
            let hasFadingStrokes = false;

            // Check if we have any strokes that are currently fading
            // We use a functional update to check state without dependency, 
            // but for reading we can just check if we have any fading strokes in a ref or derive from render?
            // Actually, we can just look at the last rendered strokes. 
            // But better: checks if there are any strokes with fadeStart that are not fully faded.

            // To properly drive animation, we need to re-render if there are fading strokes.
            setStrokes(prevStrokes => {
                const activeFadingStrokes = prevStrokes.filter(s =>
                    s.tool === 'highlighter' &&
                    s.fadeStart &&
                    (now - s.fadeStart < 1000)
                );

                if (activeFadingStrokes.length > 0) {
                    hasFadingStrokes = true;
                    needsUpdate = true;
                }

                // Garage collection: remove strokes that have fully faded > 1s ago
                // const textMode = mode === 'text'; // Clean up when in text mode or after fade
                // Actually, clean up only if fully faded.
                const nextStrokes = prevStrokes.filter(s => {
                    if (s.tool === 'highlighter' && s.fadeStart) {
                        return (now - s.fadeStart) < 1000;
                    }
                    return true;
                });

                if (nextStrokes.length !== prevStrokes.length) {
                    return nextStrokes;
                }
                return prevStrokes;
            });

            if (needsUpdate || hasFadingStrokes) {
                setTick(t => t + 1); // Force render
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        // Start loop if we have potential faders
        // We trigger this when strokes change or mode changes
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [strokes.length, mode, tool]); // Re-start loop when strokes change count or mode flips

    const getPoint = (e: React.PointerEvent): Point => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const rect = svgRef.current.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        if (mode !== 'draw') return;

        if (tool === 'eraser') {
            isDrawing.current = true;
            eraseAt(e);
            (e.target as Element).setPointerCapture(e.pointerId);
            return;
        }

        isDrawing.current = true;
        const point = getPoint(e);

        const settings = tool === 'pen' ? toolSettings.pen : toolSettings.highlighter;

        setCurrentStroke({
            points: [point],
            color: settings.color,
            width: settings.width,
            tool: tool as 'pen' | 'highlighter'
        });

        (e.target as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (mode === 'draw') {
            const point = getPoint(e);
            setCursorPos(point);

            // Infinite canvas expansion
            if (isDrawing.current && onExpand && svgRef.current) {
                const { height } = svgRef.current.getBoundingClientRect();
                if (point.y > height * 0.5) {
                    onExpand();
                }
            }
        }

        if (!isDrawing.current || mode !== 'draw') return;

        if (tool === 'eraser') {
            eraseAt(e);
            return;
        }

        if (!currentStroke) return;
        const point = getPoint(e);
        setCurrentStroke(prev => {
            if (!prev) return null;
            return {
                ...prev,
                points: [...prev.points, point]
            };
        });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        const wasDrawing = isDrawing.current;
        isDrawing.current = false;
        (e.target as Element).releasePointerCapture(e.pointerId);

        if (!wasDrawing) return;

        if (currentStroke && currentStroke.points.length > 1) {
            if (tool === 'pen' || tool === 'highlighter') {
                setStrokes(prev => [...prev, currentStroke]);
            }
        }
        setCurrentStroke(null);

        // Check for resize if we just finished using the eraser
        if (tool === 'eraser' && onCheckResize) {
            // We need to calculate the bounding box of all strokes
            // Since setStrokes in eraseAt is async, we should use the current state 'strokes' 
            // BUT eraseAt happened during move, so 'strokes' might still be updating?
            // Actually, handlePointerMove calls eraseAt which calls setStrokes.
            // React state updates might not be flushed yet in handlePointerUp if it happens in the same event tick?
            // Usually fine.

            // However, to be safe, we can calculate based on 'strokes'
            // We need to find the maximum Y of all points in all strokes.
            let maxY = 0;
            strokes.forEach(stroke => {
                stroke.points.forEach(p => {
                    if (p.y > maxY) maxY = p.y;
                });
            });
            onCheckResize(maxY);
        }
    };

    const handlePointerLeave = () => {
        setCursorPos(null);
        if (isDrawing.current) {
            isDrawing.current = false;
            if (currentStroke) setCurrentStroke(null);
        }
    };

    const eraseAt = (e: React.PointerEvent) => {
        const point = getPoint(e);
        const threshold = 10;

        setStrokes(prev => prev.filter(stroke => {
            return !stroke.points.some(p => Math.hypot(p.x - point.x, p.y - point.y) < threshold);
        }));
    };

    const strokeToPath = (points: Point[]) => {
        if (points.length === 0) return '';
        const d = points.reduce((acc, point, index) => {
            return acc + `${index === 0 ? 'M' : 'L'} ${point.x},${point.y} `;
        }, '');
        return d;
    };

    const getStrokeOpacity = (stroke: Stroke) => {
        if (stroke.tool === 'highlighter') {
            if (stroke.fadeStart) {
                const elapsed = Date.now() - stroke.fadeStart;
                const progress = Math.min(elapsed / 1000, 1);
                return Math.max(0, 0.5 * (1 - progress)); // Fade from 0.5 to 0
            }
            return 0.5; // Default highlighter opacity
        }
        return 1.0;
    };

    const getCursorSize = () => {
        if (tool === 'eraser') return 20; // Fixed size for eraser
        if (tool === 'pen') return toolSettings.pen.width;
        if (tool === 'highlighter') return toolSettings.highlighter.width;
        return 5;
    };

    const getCursorColor = () => {
        if (tool === 'pen') return toolSettings.pen.color;
        if (tool === 'highlighter') return toolSettings.highlighter.color;
        return '#000000';
    };

    return (
        <div
            className={`absolute inset-0 z-10 ${mode === 'draw' ? 'cursor-none' : 'pointer-events-none'}`}
        >
            <svg
                ref={svgRef}
                className="w-full h-full"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
            >
                {strokes.map((stroke, index) => (
                    <path
                        key={index}
                        d={strokeToPath(stroke.points)}
                        stroke={stroke.color}
                        strokeWidth={stroke.width}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={getStrokeOpacity(stroke)}
                    />
                ))}
                {currentStroke && (
                    <path
                        d={strokeToPath(currentStroke.points)}
                        stroke={currentStroke.color}
                        strokeWidth={currentStroke.width}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={currentStroke.tool === 'highlighter' ? 0.5 : 1}
                    />
                )}
            </svg>
            {mode === 'draw' && cursorPos && (
                <div
                    className="pointer-events-none absolute rounded-full border border-black dark:border-white z-50"
                    style={{
                        left: cursorPos.x,
                        top: cursorPos.y,
                        width: getCursorSize(),
                        height: getCursorSize(),
                        transform: 'translate(-50%, -50%)',
                        borderColor: getCursorColor(), // Optional: use exact tool color
                        borderWidth: '1px' // Keep border thin
                    }}
                />
            )}
        </div>
    );
}
