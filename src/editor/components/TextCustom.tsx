import { runCode } from "@apis/apis";
import { Button } from "@components/ui/elements/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@components/ui/elements/resizable";
import { Separator } from "@components/ui/elements/separator";
import { useEffect, useRef, useState } from "react";

enum Heading {
    H1 = "h1",
    H2 = "h2",
    H3 = "h3"
}

type TextBlock = {
    isCode: boolean,
    heading?: Heading,
    isItalic?: boolean,
    text: string,
    input?: string,
    output?: string
}

function getHeadingClass(heading?: Heading): string {
    switch (heading) {
        case Heading.H1:
            return "text-4xl font-extrabold tracking-tight lg:text-5xl my-6 scroll-m-20";

        case Heading.H2:
            return "text-3xl font-semibold tracking-tight first:mt-0 my-4 scroll-m-20 border-b pb-2";

        case Heading.H3:
            return "text-2xl font-semibold tracking-tight my-2 scroll-m-20";

        default:
            return "";
    }
}

function getItalics(block: TextBlock) {
    if (block.isItalic) return "italic"
    return "";
}

function getCodeContainerClass(block: TextBlock) {
    if (block.isCode) return "rounded-lg border bg-card text-card-foreground shadow-sm my-4 overflow-hidden";
    return "";
}

export default function TextCustom() {
    const textAreaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
    const [mock, setMock] = useState<TextBlock[]>([createEmptyBlock()]);

    function handleInput(idx: number, val: string) {
        let updatedData = [...mock];
        if (val.startsWith("/code")) {
            updatedData[idx] = {
                ...updatedData[idx],
                isCode: true,
                text: val.replace("/code", "").trim()
            };
        }
        else if (val.startsWith("/h1")) {
            updatedData[idx] = {
                ...updatedData[idx],
                heading: Heading.H1,
                text: val.replace("/h1", "").trim()
            };
        }
        else if (val.startsWith("/h2")) {
            updatedData[idx] = {
                ...updatedData[idx],
                heading: Heading.H2,
                text: val.replace("/h2", "").trim()
            };
        }
        else if (val.startsWith("/h3")) {
            updatedData[idx] = {
                ...updatedData[idx],
                heading: Heading.H3,
                text: val.replace("/h3", "").trim()
            };
        }
        else if (val.startsWith("/italic")) {
            updatedData[idx] = {
                ...updatedData[idx],
                isItalic: true,
                text: val.replace("/italic", "").trim()
            };
        }
        else {
            updatedData[idx] = {
                ...updatedData[idx],
                text: val
            };
        }
        const isLast = idx === updatedData.length - 1;

        if (val.trim() === "" && !isLast) {
            updatedData.splice(idx, 1);
        }
        const lastBlock = updatedData[updatedData.length - 1];

        if (!lastBlock || lastBlock.text.trim() !== "") {
            updatedData.push(createEmptyBlock());
        }
        setMock(updatedData);
    }

    function autoResize(e: React.FormEvent<HTMLTextAreaElement>) {
        const el = e.currentTarget;
        el.style.height = "auto";              // reset height
        el.style.height = el.scrollHeight + "px"; // grow
    }

    useEffect(() => {
        textAreaRefs.current.forEach((el) => {
            if (el) {
                el.style.height = "auto";
                el.style.height = el.scrollHeight + "px";
            }
        });
    }, [mock]); // Added dependency on mock to resize when new blocks are added

    function createEmptyBlock(): TextBlock {
        return {
            isCode: false,
            text: ""
        };
    }

    async function handleRunCode(block: TextBlock) {
        if (!block.isCode) return;

        try {
            const data = await runCode(block.text, "cpp");
            const updatedData = mock.map(b => {
                if (b === block) {
                    return {
                        ...b,
                        output: data,
                        error: null,
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


    return (
        <div className="break-words mx-2 overflow-hidden max-w-4xl mx-auto p-4">
            {mock.map((block: TextBlock, key: number) => {
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
                                        direction="horizontal"
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

