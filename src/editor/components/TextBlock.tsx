import type { TextBlockType } from "@myTypes/globalTypes";
export enum Heading {
    H1 = "h1",
    H2 = "h2",
    H3 = "h3",
}
type Props = {
    block: TextBlockType;
    onChange: (id: string, updates: Partial<TextBlockType>) => void;
};

function getHeadingClass(heading?: Heading) {
    switch (heading) {
        case Heading.H1:
            return "text-4xl font-bold my-6";
        case Heading.H2:
            return "text-3xl font-semibold my-4";
        case Heading.H3:
            return "text-2xl font-semibold my-2";
        default:
            return "";
    }
}

export default function TextBlock({ block, onChange }: Props) {
    return (
        <div
            className={`
        ${getHeadingClass(block.heading)}
        ${block.isItalic ? "italic" : ""}
      `}
        >
            <textarea
                value={block.text}
                onChange={(e) =>
                    onChange(block.id, { text: e.target.value })
                }
                placeholder="Type '/' for commands..."
                className="w-full resize-none outline-none bg-transparent"
            />
        </div>
    );
}
