export type BlockType = 'text-tag' | 'code-tag';

export type HeadingType = 'normal' | 'h1' | 'h2' | 'h3';
export type Alignment = 'left' | 'center' | 'right';

export interface BlockBase {
    id: string;
    type: BlockType;
}

export interface TextBlock extends BlockBase {
    type: 'text-tag';
    content: string;
    properties: {
        headingType: HeadingType;
        isBold: boolean;
        isItalic: boolean;
        isUnderline: boolean;
        alignment: Alignment;
    };
}

export interface CodeBlock extends BlockBase {
    type: 'code-tag';
    content: string;
    language?: string;
}

export type Block = TextBlock | CodeBlock;
