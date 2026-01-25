import { useState } from 'react';
import type { EditorMode } from './types';
import Toolbar from './components/Toolbar';
import TextLayer from './components/TextLayer';
import DrawLayer from './components/DrawLayer';
import { EDITOR_CONTAINER_ID } from './constants';

export default function EditorRoot() {
    const [mode, setMode] = useState<EditorMode>('text');

    return (
        <div
            id={EDITOR_CONTAINER_ID}
            className="flex flex-col w-full h-full border rounded-lg overflow-hidden bg-card shadow-sm"
        >
            <Toolbar mode={mode} setMode={setMode} />

            <div className="relative flex-1 w-full bg-card overflow-y-auto">
                <TextLayer mode={mode} />
                <DrawLayer mode={mode} />
            </div>
        </div>
    );
}
