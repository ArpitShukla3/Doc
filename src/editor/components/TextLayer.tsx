import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import type { EditorMode } from '../types';
import type { Block, TextBlock, CodeBlock } from '../types/blocks';
import { generateId, cn } from '../utils';
import { GripVertical } from 'lucide-react';
import { TextTag } from './blocks/TextTag';
import { CodeTag } from './blocks/CodeTag';

export interface TextLayerHandle {
    format: (format: string, value?: any) => void;
    insertEmbed: (type: string, value?: any) => void;
}

export interface ActiveFormats {
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    headingType: string;
    alignment: string;
}

interface TextLayerProps {
    mode: EditorMode;
    onSelectionChange?: (formats: ActiveFormats) => void;
}

// Map BlockType to Component
const RENDERERS = {
    'text-tag': TextTag,
    'code-tag': CodeTag,
};

const TextLayer = forwardRef<TextLayerHandle, TextLayerProps>(({ mode, onSelectionChange }, ref) => {
    // Initial state: One empty text block
    const [blocks, setBlocks] = useState<Block[]>([
        {
            id: generateId(),
            type: 'text-tag',
            content: '',
            properties: {
                headingType: 'normal',
                isBold: false,
                isItalic: false,
                isUnderline: false,
                alignment: 'center'
            }
        }
    ]);
    const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);

    // Map of block ID to DOM element refs
    const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);

    // Notify parent when focused block changes properties
    useEffect(() => {
        if (!focusedBlockId) {
            onSelectionChange?.({
                isBold: false,
                isItalic: false,
                isUnderline: false,
                headingType: 'normal',
                alignment: 'left'
            });
            return;
        }

        const block = blocks.find(b => b.id === focusedBlockId);
        if (block && block.type === 'text-tag') {
            onSelectionChange?.({
                isBold: block.properties.isBold,
                isItalic: block.properties.isItalic,
                isUnderline: block.properties.isUnderline,
                headingType: block.properties.headingType,
                alignment: block.properties.alignment
            });
        } else {
            // Default for code block or others
            onSelectionChange?.({
                isBold: false,
                isItalic: false,
                isUnderline: false,
                headingType: 'normal',
                alignment: 'left'
            });
        }
    }, [focusedBlockId, blocks, onSelectionChange]);

    const setRef = (id: string, el: HTMLDivElement | null) => {
        if (el) {
            blockRefs.current.set(id, el);
        } else {
            blockRefs.current.delete(id);
        }
    };

    // Helpers
    const updateBlock = (id: string, updates: Partial<Block>) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } as Block : b));
    };

    const focusBlock = (id: string, offset: 'start' | 'end' | number = 'end') => {
        setFocusedBlockId(id);
        requestAnimationFrame(() => {
            const el = blockRefs.current.get(id);
            if (el) {
                el.focus();
                const selection = window.getSelection();
                const range = document.createRange();

                if (offset === 'start') {
                    range.setStart(el, 0);
                    range.collapse(true);
                } else if (offset === 'end') {
                    range.selectNodeContents(el);
                    range.collapse(false);
                } else {
                    if (el.firstChild) {
                        range.setStart(el.firstChild, Math.min(offset, el.innerText.length));
                        range.collapse(true);
                    } else {
                        range.setStart(el, 0);
                        range.collapse(true);
                    }
                }

                selection?.removeAllRanges();
                selection?.addRange(range);
            }
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
        const index = blocks.findIndex(b => b.id === id);
        if (index === -1) return;
        const currentBlock = blocks[index];

        if (e.key === 'Enter') {
            if (currentBlock.type === 'code-tag') {
                e.preventDefault();
                document.execCommand('insertLineBreak');
                return;
            } else {
                e.preventDefault();
                // Text Block Logic
                const selection = window.getSelection();
                let splitIndex = currentBlock.content.length; // Default to end

                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    // Calculate offset
                    // Note: this is simplified.
                    const preCaretRange = range.cloneRange();
                    const el = blockRefs.current.get(id);
                    if (el) {
                        preCaretRange.selectNodeContents(el);
                        preCaretRange.setEnd(range.endContainer, range.endOffset);
                        splitIndex = preCaretRange.toString().length;
                    }
                }

                // If at end, new empty block. If middle, split content.
                const contentBefore = currentBlock.content.slice(0, splitIndex);
                const contentAfter = currentBlock.content.slice(splitIndex);

                const newBlock: TextBlock = {
                    id: generateId(),
                    type: 'text-tag',
                    content: contentAfter,
                    properties: { ...currentBlock.properties } // Inherit formatting
                };

                // Update current block to have contentOnly before
                updateBlock(id, { content: contentBefore });

                // Insert new block
                setBlocks(prev => {
                    const newBlocks = [...prev];
                    newBlocks.splice(index + 1, 0, newBlock);
                    return newBlocks;
                });

                // Focus new block
                focusBlock(newBlock.id, 'start');
            }
        } else if (e.key === 'Backspace') {
            // Logic:
            // 1. If empty and not last -> Delete.
            // 2. If at start of block -> Merge? Rule says "Text-tags never auto-merge".
            // Rule: "Backspace on empty non-final block: Removes the block, Focus moves to previous block"
            // Rule: "Backspace on final empty text-tag: Does nothing"

            if (currentBlock.content === '' && currentBlock.type === 'text-tag') {
                const isFinal = index === blocks.length - 1;
                if (!isFinal) {
                    e.preventDefault();
                    // Remove block
                    setBlocks(prev => prev.filter(b => b.id !== id));
                    // Focus previous
                    if (index > 0) {
                        focusBlock(blocks[index - 1].id, 'end');
                    }
                }
            } else {
                // Check if at start?
                const selection = window.getSelection();
                if (selection && selection.anchorOffset === 0 && selection.isCollapsed) {
                    // If at start of block, maybe focus previous block?
                    if (index > 0) {
                        // e.preventDefault();
                        // focusBlock(blocks[index - 1].id, 'end');
                        // But don't merge content.
                    }
                }
            }
        } else if (e.key === 'ArrowUp') {
            if (index > 0) {
                e.preventDefault();
                focusBlock(blocks[index - 1].id, 'end'); // Or try to preserve visual X coordinate?
            }
        } else if (e.key === 'ArrowDown') {
            if (index < blocks.length - 1) {
                e.preventDefault();
                focusBlock(blocks[index + 1].id, 'start');
            }
        }
    };

    // Drag and Drop Handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedBlockIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        // HTML5 dnd requires setting some data
        e.dataTransfer.setData('text/plain', index.toString());
        // Optional: set custom drag image
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (draggedBlockIndex === null) return;
        if (draggedBlockIndex === dropIndex) return;

        setBlocks(prev => {
            const newBlocks = [...prev];
            const [draggedItem] = newBlocks.splice(draggedBlockIndex, 1);
            newBlocks.splice(dropIndex, 0, draggedItem);
            return newBlocks;
        });
        setDraggedBlockIndex(null);
    };

    useImperativeHandle(ref, () => ({
        format: (format: string, value: any = true) => {
            if (!focusedBlockId) return;

            // Apply formatting to FiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiihihihihihihihihihihihihijhihhhjlkOCUSED block
            // This needs to be sophisticated:
            // 1. If TextBlock, update properties.
            // 2. If CodeBlock, ignore specific text formatting?

            setBlocks(prev => prev.map(b => {
                if (b.id !== focusedBlockId) return b;
                if (b.type === 'text-tag') {
                    const updates: any = {};
                    if (format === 'bold') updates.isBold = !b.properties.isBold;
                    if (format === 'italic') updates.isItalic = !b.properties.isItalic;
                    if (format === 'underline') updates.isUnderline = !b.properties.isUnderline;
                    if (['h1', 'h2', 'h3', 'normal'].includes(format)) updates.headingType = format;
                    if (['left', 'center', 'right'].includes(format)) updates.alignment = format;
                    if (format === 'code') {
                        // ...
                    }

                    return {
                        ...b,
                        properties: { ...b.properties, ...updates }
                    };
                }
                return b;
            }));
        },
        insertEmbed: (type: string, value: any = '') => {
            // For now, primarily handling 'code-block-copy' -> Insert Code Block
            if (type === 'code-block-copy') {
                const newBlock: CodeBlock = {
                    id: generateId(),
                    type: 'code-tag',
                    content: value || '',
                };

                // Insert below focused block or at end
                setBlocks(prev => {
                    if (!focusedBlockId) {
                        // Insert before the last empty block if possible, or just append
                        // Rule: "Insert code-tag above the final empty text-tag" if no focus
                        const lastBlock = prev[prev.length - 1];
                        if (lastBlock && lastBlock.type === 'text-tag' && lastBlock.content === '') {
                            return [...prev.slice(0, -1), newBlock, lastBlock];
                        }
                        return [...prev, newBlock];
                    }

                    const index = prev.findIndex(b => b.id === focusedBlockId);
                    if (index === -1) return prev;

                    const newBlocks = [...prev];
                    newBlocks.splice(index + 1, 0, newBlock);
                    return newBlocks;
                });

                // Focus newly created block
                setTimeout(() => focusBlock(newBlock.id, 'start'), 0);
            }
        }
    }));

    return (
        <div className={cn("relative w-full min-h-full p-8 pb-32", mode !== 'text' && "pointer-events-none select-none")}>
            {blocks.map((block, index) => {
                const BlockComponent = RENDERERS[block.type] as any;
                return (
                    <div
                        key={block.id}
                        className={cn(
                            "relative group/block flex items-start -ml-8 pl-8 transition-opacity",
                            draggedBlockIndex === index && "opacity-50"
                        )}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                    >
                        {/* Drag Handle - visible on hover */}
                        <div className="absolute left-0 top-1 text-muted-foreground/50 opacity-0 group-hover/block:opacity-100 cursor-grab p-1">
                            <GripVertical className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <BlockComponent
                                block={block}
                                onUpdate={updateBlock}
                                onFocus={setFocusedBlockId}
                                onKeyDown={handleKeyDown}
                                forwardedRef={(el: any) => setRef(block.id, el as HTMLDivElement)}
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    );
});

export default TextLayer;
