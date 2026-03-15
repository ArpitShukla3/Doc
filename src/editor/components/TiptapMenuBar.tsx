import type { Editor } from '@tiptap/react';
import { Button } from '@components/ui/elements/button';
import {
    Bold, Italic, Underline, Strikethrough, Code, Highlighter,
    Heading1, Heading2, Heading3, Pilcrow,
    List, ListOrdered, ListChecks,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Quote, Minus, ImagePlus, TableIcon, Undo2, Redo2,
    SquareCode, AtSign,
    Plus, Trash2, ArrowUpFromLine, ArrowDownFromLine,
} from 'lucide-react';
import { useRef } from 'react';

interface TiptapMenuBarProps {
    editor: Editor | null;
}

export default function TiptapMenuBar({ editor }: TiptapMenuBarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!editor) return null;

    const handleImageUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const url = reader.result as string;
            editor.chain().focus().setImage({ src: url }).run();
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const insertTable = () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    };

    const isInTable = editor.isActive('table');

    // Button helper
    const Btn = ({
        action, active = false, icon: Icon, title, disabled = false,
    }: {
        action: () => void; active?: boolean; icon: any; title: string; disabled?: boolean;
    }) => (
        <Button
            variant={active ? 'secondary' : 'ghost'}
            size="sm"
            onClick={action}
            className="rounded-md w-8 h-8 p-0"
            title={title}
            disabled={disabled}
        >
            <Icon className="w-4 h-4" />
        </Button>
    );

    const Divider = () => <div className="w-px h-5 bg-border mx-0.5" />;

    return (
        <div className="flex items-center gap-0.5 p-1.5 border-b bg-card/80 backdrop-blur-sm flex-wrap">
            {/* Undo / Redo */}
            <Btn action={() => editor.chain().focus().undo().run()} icon={Undo2} title="Undo" disabled={!editor.can().undo()} />
            <Btn action={() => editor.chain().focus().redo().run()} icon={Redo2} title="Redo" disabled={!editor.can().redo()} />

            <Divider />

            {/* Text Formatting */}
            <Btn action={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} icon={Bold} title="Bold (Ctrl+B)" />
            <Btn action={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} icon={Italic} title="Italic (Ctrl+I)" />
            <Btn action={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} icon={Underline} title="Underline (Ctrl+U)" />
            <Btn action={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} icon={Strikethrough} title="Strikethrough" />
            <Btn action={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} icon={Code} title="Inline Code" />
            <Btn action={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} icon={Highlighter} title="Highlight" />

            <Divider />

            {/* Block Types */}
            <Btn action={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph') && !editor.isActive('heading')} icon={Pilcrow} title="Paragraph" />
            <Btn action={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} icon={Heading1} title="Heading 1" />
            <Btn action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} icon={Heading2} title="Heading 2" />
            <Btn action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} icon={Heading3} title="Heading 3" />

            <Divider />

            {/* Lists */}
            <Btn action={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} icon={List} title="Bullet List" />
            <Btn action={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} icon={ListOrdered} title="Ordered List" />
            <Btn action={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} icon={ListChecks} title="Task List" />

            <Divider />

            {/* Alignment */}
            <Btn action={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} title="Align Left" />
            <Btn action={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} title="Align Center" />
            <Btn action={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} icon={AlignRight} title="Align Right" />
            <Btn action={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} icon={AlignJustify} title="Align Justify" />

            <Divider />

            {/* Insert */}
            <Btn action={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} icon={Quote} title="Blockquote" />
            <Btn action={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} icon={SquareCode} title="Code Block" />
            <Btn action={() => editor.chain().focus().setHorizontalRule().run()} icon={Minus} title="Horizontal Rule" />
            <Btn action={handleImageUpload} icon={ImagePlus} title="Insert Image" />
            <Btn action={insertTable} icon={TableIcon} title="Insert Table" />
            <Btn action={() => editor.chain().focus().insertContent('@')} icon={AtSign} title="Mention" />

            {/* Table controls – only visible when inside a table */}
            {isInTable && (
                <>
                    <Divider />
                    <Btn action={() => editor.chain().focus().addColumnAfter().run()} icon={Plus} title="Add Column" />
                    <Btn action={() => editor.chain().focus().addRowAfter().run()} icon={ArrowDownFromLine} title="Add Row Below" />
                    <Btn action={() => editor.chain().focus().addRowBefore().run()} icon={ArrowUpFromLine} title="Add Row Above" />
                    <Btn action={() => editor.chain().focus().deleteColumn().run()} icon={Trash2} title="Delete Column" />
                    <Btn action={() => editor.chain().focus().deleteRow().run()} icon={Trash2} title="Delete Row" />
                    <Btn action={() => editor.chain().focus().deleteTable().run()} icon={Trash2} title="Delete Table" />
                </>
            )}

            {/* Hidden file input for image upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}
