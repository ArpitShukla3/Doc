import { useState, useRef } from 'react';
import type { EditorMode, DrawTool, AllToolSettings } from './types';

import FloatingMenubar from './components/FloatingMenubar';
import TextLayer from './components/TextLayer';
import type { TextLayerHandle, ActiveFormats } from './components/TextLayer';
import DrawLayer from './components/DrawLayer';
import { EDITOR_CONTAINER_ID } from './constants';
import TextCustom from './components/TextCustom';

export default function EditorRoot() {
    const [mode, setMode] = useState<EditorMode>('text');
    const [tool, setTool] = useState<DrawTool>('pen');
    const [toolSettings, setToolSettings] = useState<AllToolSettings>({
        pen: { color: '#000000', width: 2 },
        highlighter: { color: '#FFFF00', width: 10 }
    });
    const textLayerRef = useRef<TextLayerHandle>(null);
    const [canvasHeight, setCanvasHeight] = useState<number | undefined>(undefined);

    const [activeFormats, setActiveFormats] = useState<ActiveFormats>({
        isBold: false,
        isItalic: false,
        isUnderline: false,
        headingType: 'normal',
        alignment: 'left'
    });

    const handleExpand = () => {
        if (scrollContainerRef.current) {
            const currentHeight = scrollContainerRef.current.clientHeight;
            setCanvasHeight(prev => {
                if (prev === undefined) {
                    return currentHeight * 2;
                }
                return prev * 1.5; // Adjusted expansion rate
            });
        }
    };

    const handleCheckResize = (contentMaxY: number) => {
        if (!scrollContainerRef.current) return;

        const viewportHeight = scrollContainerRef.current.clientHeight;
        const currentCanvasHeight = canvasHeight || viewportHeight;

        // Condition to shrink:
        // 1. Content is much smaller than canvas (e.g. content end is < 50% of canvas)
        // 2. We don't want to shrink below viewport height
        // 3. We want to keep some buffer (e.g. 50% of viewport buffer)

        // Proposed logic:
        // New desired height = contentMaxY + (viewportHeight * 0.5)
        // If (new desired height < currentCanvasHeight * 0.8) -> Shrink

        const buffer = viewportHeight * 0.5;
        const newHeightCandidate = Math.max(viewportHeight, contentMaxY + buffer);

        if (newHeightCandidate < currentCanvasHeight) {
            // Only shrink if the difference is significant to avoid jitter
            if (currentCanvasHeight - newHeightCandidate > viewportHeight * 0.2) {
                setCanvasHeight(newHeightCandidate);
            }
        }
    };

    // We need a ref to the scroll container to measure initial height
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleFormat = (format: string) => {
        if (textLayerRef.current) {
            textLayerRef.current.format(format);
        }
    };

    const handleInsertEmbed = (type: string, value?: any) => {
        if (textLayerRef.current && textLayerRef.current.insertEmbed) {
            textLayerRef.current.insertEmbed(type, value);
        }
    };

    return (
        <div
            id={EDITOR_CONTAINER_ID}
            className="flex flex-col w-full h-full border rounded-lg overflow-hidden bg-card shadow-sm relative"
        >

            <FloatingMenubar
                mode={mode}
                drawTool={tool}
                setMode={setMode}
                setDrawTool={setTool}
                toolSettings={toolSettings}
                setToolSettings={setToolSettings}
                onFormat={handleFormat}
                onInsertEmbed={handleInsertEmbed}
                activeFormats={activeFormats}
            />


            <div
                className="relative flex-1 w-full bg-card overflow-y-auto mt-15"
                ref={scrollContainerRef}
            >
                <div
                    style={{
                        minHeight: '100%',
                        height: canvasHeight ? `${canvasHeight}px` : '100%',
                        position: 'relative'
                    }}
                >
                    {/* <TextLayer
                        ref={textLayerRef}
                        mode={mode}
                        onSelectionChange={setActiveFormats}
                    /> */}
                    <TextCustom/>
                    <DrawLayer
                        mode={mode}
                        tool={tool}
                        toolSettings={toolSettings}
                        onExpand={handleExpand}
                        onCheckResize={handleCheckResize}
                    />
                </div>
            </div>
        </div>
    );
}
