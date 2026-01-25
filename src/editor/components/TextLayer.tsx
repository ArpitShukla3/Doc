import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import type { EditorMode } from '../types';

export interface TextLayerHandle {
    format: (format: string, value?: any) => void;
}

interface TextLayerProps {
    mode: EditorMode;
}

const TextLayer = forwardRef<TextLayerHandle, TextLayerProps>(({ mode }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillInstance = useRef<Quill | null>(null);

    useEffect(() => {
        if (editorRef.current && !quillInstance.current) {
            quillInstance.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: false // We control mode externally
                },
                // placeholder: 'Start writing...'
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

    useImperativeHandle(ref, () => ({
        format: (format: string, value: any = true) => {
            if (quillInstance.current) {
                // Determine current selection or formatting
                // Simple toggle logic for bools
                const currentFormat = quillInstance.current.getFormat();
                if (typeof value === 'boolean' && currentFormat[format]) {
                    quillInstance.current.format(format, false);
                } else {
                    quillInstance.current.format(format, value);
                }
            }
        }
    }));

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
});

export default TextLayer;
