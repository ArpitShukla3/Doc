import { runCode } from "@apis/apis";
import type { TextBlockType } from "@myTypes/globalTypes";
import useMock from "@stores/globalStore";

export default function CodeBlock() {
    return (
        <div>
            <h1>Code Block</h1>
        </div>
    );
}
async function handleRunCode(block: TextBlockType) {
    if (!block.isCode) return;
    const mock = useMock((state) => state.mock);
    const setMock = useMock((state) => state.setMock);
    try {
        const data = await runCode(block.text, "cpp");
        const updatedData = mock.map(b => {
            if (b === block) {
                return {
                    ...b,
                    output: data,
                };
            }
            return b;
        });
        setMock(updatedData);
    } catch (err) {

        console.log(err);
        const errorMessage = err instanceof Error ? err.message : String(err);

        const updatedData = mock.map(b => {
            if (b === block) {
                return {
                    ...b,
                    output: errorMessage,
                };
            }
            return b;
        });
        setMock(updatedData);
    }
}
function autoResize(e: React.FormEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    el.style.height = "auto";              // reset height
    el.style.height = el.scrollHeight + "px"; // grow
}
function getCodeContainerClass(block: TextBlockType) {
    if (block.isCode) return "rounded-lg border bg-card text-card-foreground shadow-sm my-4 overflow-hidden";
    return "";
}