import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import type { EditorMode } from '../types';

interface TextLayerProps {
    mode: EditorMode;
}

export default function TextLayer({ mode }: TextLayerProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillInstance = useRef<Quill | null>(null);

    useEffect(() => {
        if (editorRef.current && !quillInstance.current) {
            quillInstance.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: false // We control mode externally
                },
                placeholder: 'Start writing...'
            });
        }
    }, []);

    useEffect(() => {
        if (quillInstance.current) {
            if (mode === 'text') {
                quillInstance.current.enable();
            } else {
                quillInstance.current.disable();
            }
        }
    }, [mode]);

    return (
        <div className="absolute inset-0 z-0">
            <div ref={editorRef} className="h-full border-none" />
            {/* Custom styles to hide toolbar if present by default and make it look clean */}
            <style>{`
                .ql-container.ql-snow {
                    border: none !important;
                    font-size: 16px;
                }
                .ql-editor {
                    padding: 2rem;
                    height: 100%;
                }
             `}</style>
        </div>
    );
}
