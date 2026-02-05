import { useState } from 'react';
import type { CodeBlock } from '../../types/blocks';
import { Copy, Check } from 'lucide-react';

interface CodeTagProps {
    block: CodeBlock;
    onUpdate: (id: string, updates: Partial<CodeBlock>) => void;
    onFocus: (id: string) => void;
    onKeyDown: (e: React.KeyboardEvent, id: string) => void;
    forwardedRef: (el: HTMLDivElement | null) => void;
}

export const CodeTag = ({ block, onUpdate, onFocus, onKeyDown, forwardedRef }: CodeTagProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(block.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-4 rounded-md border bg-muted/50 font-mono text-sm">
            <button
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-10 cursor-pointer select-none flex items-center gap-1"
                onClick={handleCopy}
                contentEditable={false}
            >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
            </button>
            <div
                ref={forwardedRef}
                className="p-4 overflow-x-auto outline-none whitespace-pre-wrap"
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => onUpdate(block.id, { content: e.currentTarget.textContent || '' })}
                onFocus={() => onFocus(block.id)}
                onKeyDown={(e) => onKeyDown(e, block.id)}
            >
                {block.content}
            </div>
        </div>
    );
};
