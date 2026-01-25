import { useState, useRef } from 'react';
import type { EditorMode, DrawTool, AllToolSettings } from './types';

import FloatingMenubar from './components/FloatingMenubar';
import TextLayer from './components/TextLayer';
import type { TextLayerHandle } from './components/TextLayer';
import DrawLayer from './components/DrawLayer';
import { EDITOR_CONTAINER_ID } from './constants';

export default function EditorRoot() {
    const [mode, setMode] = useState<EditorMode>('text');
    const [tool, setTool] = useState<DrawTool>('pen');
    const [toolSettings, setToolSettings] = useState<AllToolSettings>({
        pen: { color: '#000000', width: 2 },
        highlighter: { color: '#FFFF00', width: 10 }
    });
    const textLayerRef = useRef<TextLayerHandle>(null);

    const handleFormat = (format: string) => {
        if (textLayerRef.current) {
            textLayerRef.current.format(format);
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
            />

            <div className="relative flex-1 w-full bg-card overflow-y-auto mt-15">
                <TextLayer ref={textLayerRef} mode={mode} />
                <DrawLayer mode={mode} tool={tool} toolSettings={toolSettings} />
            </div>
        </div>
    );
}
