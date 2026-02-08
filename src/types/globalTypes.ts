export type BearType = {
    id: number;
}
export enum Heading {
    H1 = "h1",
    H2 = "h2",
    H3 = "h3",
}

export type TextBlockType = {
    id: string;
    isCode: boolean;
    heading?: Heading;
    isItalic?: boolean;
    text: string;
    input?: string;
    output?: string;
    error?: string;
};
