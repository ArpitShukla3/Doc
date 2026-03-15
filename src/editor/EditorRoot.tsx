import { useState, useCallback } from 'react';
import type { Editor } from '@tiptap/react';

import TiptapEditor from './components/TiptapEditor';
import TiptapMenuBar from './components/TiptapMenuBar';
import { EDITOR_CONTAINER_ID } from './constants';

export default function EditorRoot() {
    const [tiptapEditor, setTiptapEditor] = useState<Editor | null>(null);

    const handleEditorReady = useCallback((editor: Editor) => {
        setTiptapEditor(editor);
    }, []);

    return (
        <div
            id={EDITOR_CONTAINER_ID}
            className="flex flex-col w-full h-full border rounded-lg overflow-hidden bg-card shadow-sm"
        >
            {/* Tiptap Toolbar */}
            <TiptapMenuBar editor={tiptapEditor} />

            {/* Editor Content */}
            <div className="flex-1 w-full bg-card overflow-y-auto">
                <TiptapEditor onEditorReady={handleEditorReady} />
            </div>
        </div>
    );
}
