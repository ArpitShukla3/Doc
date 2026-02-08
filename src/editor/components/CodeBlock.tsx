import { runCode } from "@apis/apis";
import { Button } from "@components/ui/elements/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@components/ui/elements/resizable";
import type { TextBlockType } from "@myTypes/globalTypes";
import useMock from "@stores/globalStore";

export default function CodeBlock(idx: string) {
    const mock = useMock((state) => state.mock);
    const setMock = useMock((state) => state.setMock);
    return (
        <div className="break-words mx-2 overflow-hidden max-w-4xl mx-auto p-4">
            {mock.map((block: TextBlockType, key: number) => {
                return (
                    <div key={key} className={`${getCodeContainerClass(block)} transition-all duration-200`}>

                        {/* Header for Code Blocks */}
                        {block.isCode && (
                            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
                                <span className="text-xs font-mono text-muted-foreground">C++ Snippet</span>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => handleRunCode(block)}
                                >
                                    Run Code
                                </Button>
                            </div>
                        )}

                        <div className={`${!block.isCode ? getHeadingClass(block.heading) : "p-4 bg-muted/30"} ${getItalics(block)} relative`}>
                            <textarea
                                ref={(el) => (textAreaRefs.current[key] = el)}
                                rows={1}
                                onInput={(e) => {
                                    handleInput(key, e.currentTarget.value)
                                    autoResize(e)
                                }}
                                value={block.text}
                                placeholder={block.isCode ? "Write your code here..." : "Type '/' for commands..."}
                                className={`
                                block
                                w-full
                                resize-none
                                break-words
                                outline-none
                                bg-transparent
                                overflow-hidden
                                ${block.isCode ? "font-mono text-sm leading-relaxed" : ""}
                            `}
                            />
                        </div>

                        {block.isCode && (
                            <>
                                {/* <Separator /> */}
                                <div className="border-t">
                                    <ResizablePanelGroup
                                        orientation="horizontal"
                                        className="min-h-[150px] w-full rounded-none"
                                    >
                                        <ResizablePanel defaultSize={50} minSize={30}>
                                            <div className="flex flex-col h-full">
                                                <div className="px-4 py-2 border-b bg-muted/10">
                                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Input</h3>
                                                </div>
                                                <div className="p-4 bg-background flex-1">
                                                    <pre className="text-sm font-mono whitespace-pre-wrap text-muted-foreground">{block.input || "No Input"}</pre>
                                                </div>
                                            </div>
                                        </ResizablePanel>
                                        <ResizableHandle withHandle />
                                        <ResizablePanel defaultSize={50} minSize={30}>
                                            <div className="flex flex-col h-full">
                                                <div className="px-4 py-2 border-b bg-muted/10">
                                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Output</h3>
                                                </div>
                                                <div className="p-4 bg-background flex-1">
                                                    <pre className="text-sm font-mono whitespace-pre-wrap">{block.output || "No Output"}</pre>
                                                </div>
                                            </div>
                                        </ResizablePanel>
                                    </ResizablePanelGroup>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
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