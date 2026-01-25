export type EditorMode = 'text' | 'draw';
export type DrawTool = 'pen' | 'highlighter' | 'eraser';

export interface Point {
    x: number;
    y: number;
}

export interface ToolSettings {
    color: string;
    width: number;
}

export interface AllToolSettings {
    pen: ToolSettings;
    highlighter: ToolSettings;
}

export interface Stroke {
    points: Point[];
    color: string;
    width: number;
    tool: DrawTool;
    fadeStart?: number;
}
