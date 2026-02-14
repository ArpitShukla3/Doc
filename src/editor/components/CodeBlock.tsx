import { runCode } from "@apis/apis";
import { Button } from "@components/ui/elements/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@components/ui/elements/dropdown-menu";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@components/ui/elements/resizable";
import { type TextBlockType, Language } from "@myTypes/globalTypes";
import useMock from "@stores/globalStore";
import { useState } from "react";

type Props = {
    block: TextBlockType;
};
export default function CodeBlock({ block }: Props) {
    const { updateBlock } = useMock();
    function LanguageSelector() {
        const [language, setLanguage] = useState<Language>(block.codeLanguage || Language.default);
        const avialiableLanguages = Object.values(Language);
        function pickLanguage(lang: Language) {
            setLanguage(lang);
            updateBlock(block.id, { codeLanguage: lang });
        }
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" value={language}>{language}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                    </DropdownMenuGroup>
                    {
                        avialiableLanguages.map((lang, key) => {
                            return <div key={key}>
                                <DropdownMenuItem
                                    onClick={() => pickLanguage(lang)}
                                >
                                    {lang}
                                </DropdownMenuItem>
                            </div>
                        })
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
    async function handleRun() {
        try {
            await runCode(block);
        } catch (err) {
            const msg =
                err instanceof Error
                    ? err.message
                    : String(err);

            updateBlock(block.id, {
                output: msg,
            });
        }
    }

    return (
        <div className="rounded-lg border bg-card shadow-sm my-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
                <LanguageSelector />
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleRun}
                >
                    Run Code
                </Button>
            </div>

            {/* Code Editor */}
            <div className="p-4 bg-muted/30">
                <textarea
                    value={block.text}
                    onChange={(e) =>
                        updateBlock(block.id, {
                            text: e.target.value,
                        })
                    }
                    onInput={(e) => {
                        const el = e.currentTarget;
                        el.style.height = "auto";              // reset
                        el.style.height = el.scrollHeight + "px"; // grow
                    }}
                    placeholder="Write your code here..."
                    className="w-full resize-none bg-transparent outline-none font-mono text-sm"
                />
            </div>

            {/* IO Panels */}
            <div className="border-t">
                <ResizablePanelGroup orientation="horizontal">

                    {/* INPUT PANEL */}
                    <ResizablePanel defaultSize={50} minSize={30}>
                        <div className="flex flex-col h-full">

                            {/* Header */}
                            <div className="px-4 py-2 border-b bg-muted/10">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Input
                                </h3>
                            </div>

                            {/* Content */}
                            <div className="p-4 flex-1 ">
                                <textarea
                                    value={block.input || ""}
                                    onChange={(e) =>
                                        updateBlock(block.id, {
                                            input: e.target.value,
                                        })
                                    }
                                    onInput={(e) => {
                                        const el = e.currentTarget;
                                        el.style.height = "auto";              // reset
                                        el.style.height = el.scrollHeight + "px"; // grow
                                    }}
                                    placeholder="Enter stdin..."
                                    className="
                                        w-full
                                        h-full
                                        resize-none
                                        outline-none
                                        font-mono
                                        text-sm
                                        bg-background
                                        border
                                        rounded-md
                                        p-3
                                        overflow-auto
                                        whitespace-pre-wrap
                                        "
                                />
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle />

                    {/* OUTPUT PANEL */}
                    <ResizablePanel defaultSize={50} minSize={30}>
                        <div className="flex flex-col h-full">

                            {/* Header */}
                            <div className="px-4 py-2 border-b bg-muted/10">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Output
                                </h3>
                            </div>

                            {/* Content */}
                            <div className="p-4 flex-1">
                                <div className="
                                    h-full
                                    w-full
                                    bg-background
                                    border
                                    rounded-md
                                    p-3
                                    overflow-auto
                                ">
                                    <pre className="
                                        text-sm
                                        font-mono
                                        whitespace-pre-wrap
                                        wrap-break-word
                                        ">
                                        {block.output || "No Output"}
                                    </pre>
                                </div>
                            </div>

                        </div>
                    </ResizablePanel>

                </ResizablePanelGroup>
            </div>

        </div>
    );
}
