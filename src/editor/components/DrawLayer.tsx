import { useRef, useState } from 'react';
import type { EditorMode, Stroke, Point } from '../types';

interface DrawLayerProps {
    mode: EditorMode;
}

export default function DrawLayer({ mode }: DrawLayerProps) {
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const isDrawing = useRef(false);

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
        isDrawing.current = true;
        const point = getPoint(e);
        setCurrentStroke([point]);

        // Capture pointer to ensure we get events even if we leave the element
        (e.target as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDrawing.current || mode !== 'draw' || !currentStroke) return;
        const point = getPoint(e);
        setCurrentStroke(prev => [...(prev || []), point]);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDrawing.current) return;
        isDrawing.current = false;

        if (currentStroke && currentStroke.length > 1) {
            setStrokes(prev => [...prev, currentStroke]);
        }
        setCurrentStroke(null);
        (e.target as Element).releasePointerCapture(e.pointerId);
    };

    // Helper to convert stroke points to SVG path data
    const strokeToPath = (stroke: Stroke) => {
        if (stroke.length === 0) return '';
        const d = stroke.reduce((acc, point, index) => {
            return acc + `${index === 0 ? 'M' : 'L'} ${point.x},${point.y} `;
        }, '');
        return d;
    };

    return (
        <div
            className={`absolute inset-0 z-10 ${mode === 'draw' ? 'cursor-crosshair' : 'pointer-events-none'}`}
        >
            <svg
                ref={svgRef}
                className="w-full h-full"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                {strokes.map((stroke, index) => (
                    <path
                        key={index}
                        d={strokeToPath(stroke)}
                        stroke="#000"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                ))}
                {currentStroke && (
                    <path
                        d={strokeToPath(currentStroke)}
                        stroke="#000"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.6"
                    />
                )}
            </svg>
        </div>
    );
}
