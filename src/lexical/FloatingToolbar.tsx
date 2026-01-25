import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { Button } from '@components/ui/elements/button';
import { Bold, Italic, Underline } from 'lucide-react';

export default function FloatingToolbar() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));

            const nativeSelection = window.getSelection();
            const rootElement = editor.getRootElement();

            if (
                nativeSelection &&
                !nativeSelection.isCollapsed &&
                rootElement &&
                rootElement.contains(nativeSelection.anchorNode)
            ) {
                const domRange = nativeSelection.getRangeAt(0);
                const rect = domRange.getBoundingClientRect();
                setPosition({
                    top: rect.top - 50,
                    left: rect.left + rect.width / 2,
                });
                return;
            }
        }
        setPosition(null);
    }, [editor]);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateToolbar();
            });
        });
    }, [editor, updateToolbar]);

    // Clean up listeners on mount
    useEffect(() => {
        const handleSelectionChange = () => {
            editor.getEditorState().read(() => {
                updateToolbar();
            });
        };

        document.addEventListener('selectionchange', handleSelectionChange);
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, [editor, updateToolbar]);


    if (!position) return null;

    return createPortal(
        <div
            ref={toolbarRef}
            className="fixed z-50 flex items-center gap-1 rounded-md bg-card p-1 shadow-md border border-border"
            style={{
                top: position.top,
                left: position.left,
                transform: 'translateX(-50%)'
            }}
        >
            <Button
                variant={isBold ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                className="h-8 w-8 p-0"
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                variant={isItalic ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                className="h-8 w-8 p-0"
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                variant={isUnderline ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                className="h-8 w-8 p-0"
            >
                <Underline className="h-4 w-4" />
            </Button>
        </div>,
        document.body
    );
}
