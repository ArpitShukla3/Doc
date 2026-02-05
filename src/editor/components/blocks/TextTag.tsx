import type { TextBlock } from '../../types/blocks';
import { cn } from '../../utils';

interface TextTagProps {
    block: TextBlock;
    onUpdate: (id: string, updates: Partial<TextBlock>) => void;
    onFocus: (id: string) => void;
    onKeyDown: (e: React.KeyboardEvent, id: string) => void;
    forwardedRef: (el: HTMLDivElement | null) => void;
}

export const TextTag = ({ block, onUpdate, onFocus, onKeyDown, forwardedRef }: TextTagProps) => {
    return (
        <div
            ref={forwardedRef}
            className={cn(
                "w-full outline-none py-1 px-1",
                block.properties.headingType === 'h1' && "text-4xl font-bold mb-4",
                block.properties.headingType === 'h2' && "text-3xl font-bold mb-3",
                block.properties.headingType === 'h3' && "text-2xl font-bold mb-2",
                block.properties.headingType === 'normal' && "text-base mb-1",
                block.properties.alignment === 'center' && "text-center",
                block.properties.alignment === 'right' && "text-right",
                block.properties.isBold && "font-bold",
                block.properties.isItalic && "italic",
                block.properties.isUnderline && "underline"
            )}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => onUpdate(block.id, { content: e.currentTarget.textContent || '' })}
            onFocus={() => onFocus(block.id)}
            onKeyDown={(e) => onKeyDown(e, block.id)}
        >
            {block.content}
        </div>
    );
};
