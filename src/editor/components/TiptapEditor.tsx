import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Highlight } from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Image } from '@tiptap/extension-image';
import { Mention } from '@tiptap/extension-mention';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Typography } from '@tiptap/extension-typography';
import { common, createLowlight } from 'lowlight';
import { useEffect } from 'react';
import type { Editor } from '@tiptap/react';

import '../tiptap-styles.css';
import { mentionSuggestion } from './mentionSuggestion';

const lowlight = createLowlight(common);

interface TiptapEditorProps {
    onEditorReady?: (editor: Editor) => void;
}

export default function TiptapEditor({ onEditorReady }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // replaced by CodeBlockLowlight
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Highlight.configure({ multicolor: true }),
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
            TaskList,
            TaskItem.configure({ nested: true }),
            Image.configure({ inline: false, allowBase64: true }),
            Mention.configure({
                HTMLAttributes: { class: 'mention' },
                suggestion: mentionSuggestion,
            }),
            CodeBlockLowlight.configure({ lowlight }),
            Placeholder.configure({
                placeholder: 'Start writing, use markdown shortcuts like # ## ### - [ ] ``` > etc...',
            }),
            TextStyle,
            Color,
            Typography,
        ],
        content: '<p></p>',
        editorProps: {
            attributes: {
                class: 'tiptap',
            },
        },
    });

    useEffect(() => {
        if (editor && onEditorReady) {
            onEditorReady(editor);
        }
    }, [editor, onEditorReady]);

    if (!editor) return null;

    return <EditorContent editor={editor} />;
}
