import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { editorConfig } from './editorConfig';
import FloatingToolbar from './FloatingToolbar';
import { useState } from 'react';
import DraggableBlockWrapper from './DraggableBlockWrapper';

export default function Editor() {
    const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);

    const onRef = (_floatingAnchorElem: HTMLDivElement) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    };
    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div
                className="relative h-full w-full mx-auto rounded-lg border border-border bg-card p-4 shadow-sm"
                ref={onRef}
            >
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable className="h-full w-full outline-none prose prose-slate max-w-none" />
                    }
                    placeholder={
                        <div className="pointer-events-none absolute top-4 left-4 text-foreground">
                            Enter some text...
                        </div>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <HistoryPlugin />
                <FloatingToolbar />
                {floatingAnchorElem &&
                    <DraggableBlockWrapper anchorElem={floatingAnchorElem} />}
            </div>
        </LexicalComposer>
    );
}
