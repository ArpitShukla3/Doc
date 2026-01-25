export type EditorMode = 'text' | 'draw';
export type DrawTool = 'pen' | 'eraser';

export interface Point {
    x: number;
    y: number;
}

export type Stroke = Point[];
