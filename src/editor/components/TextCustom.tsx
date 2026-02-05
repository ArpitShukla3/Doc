import { useEffect, useRef, useState } from "react";

enum Heading {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3"
}
type TextBlock = {
    isCode : boolean,
    heading? : Heading,
    isItalic?:boolean
    text : string

}
function getHeadingClass(heading?: Heading): string {
  switch (heading) {
    case Heading.H1:
      return "text-4xl font-bold my-6";

    case Heading.H2:
      return "text-3xl font-semibold my-4";

    case Heading.H3:
      return "text-2xl font-medium my-2";

    default:
      return "";
  }
}
function getItalics(block: TextBlock){
    if(block.isItalic)return "italic"
}
function getCode(block: TextBlock){
    if(block.isCode)return "bg-secondary text-secondary-foreground font-mono p-2 m-1 rounded-md"
    return "";
}
export default function TextCustom (){
    const textAreaRefs =
    useRef<(HTMLTextAreaElement | null)[]>([]);
    const [mock, setMock]  = useState<TextBlock[]>([
                {
                    isCode : false,
                    text : "Morning Class",
                    heading : Heading.H1
                },
                {
                    isCode : false,
                    text : "Morning Class",
                    heading : Heading.H2
                },
                {
                    isCode : false,
                    text : "Morning Class",
                    heading : Heading.H3
                },
                {
                    isCode : true,
                    text: " Hello I am cpp........................................................................................................................................................................................................................................................................................................................."
                },
                {
                    isCode : false,
                    text: " Hello I am cpp"
                },
                {
                    isCode : true,
                    text: " Hello I am Java"
                },
                {
                    isCode : true,
                    text: " Hello I am Italic",
                    isItalic : true
                },
                createEmptyBlock()
                ])
    function handleInput(
                        idx: number,
                        val: string
                        ) {
        let updatedData = [...mock];
        if (val.startsWith("/code")) {
            updatedData[idx] = {
            ...updatedData[idx],
            isCode: true,
            text: val.replace("/code", "").trim()
            };
        } else {
            updatedData[idx] = {
            ...updatedData[idx],
            text: val
            };
        }
        const isLast =
            idx === updatedData.length - 1;

        if (val.trim() === "" && !isLast) {
            updatedData.splice(idx, 1);
        }
        const lastBlock =
            updatedData[updatedData.length - 1];

        if (
            !lastBlock ||
            lastBlock.text.trim() !== ""
        ) {
            updatedData.push(createEmptyBlock());
        }
        setMock(updatedData);
    }

    function autoResize(
        e: React.FormEvent<HTMLTextAreaElement>
        ) {
        const el = e.currentTarget;

        el.style.height = "auto";              // reset height
        el.style.height = el.scrollHeight + "px"; // grow
        }
      useEffect(() => {
        textAreaRefs.current.forEach((el) => {
        if (el) {
            el.style.height = "auto";
            el.style.height =
            el.scrollHeight + "px";
        }
        });
    }, []);
    function createEmptyBlock(): TextBlock {
    return {
        isCode: false,
        text: ""
    };
    }

    return (
        <div className="break-words mx-2 overflow-hidden">
            {mock.map((block: TextBlock, key: number) => {
            return (
                <div>
                {block.isCode? <div className={getCode(block)}>
                    <button>Run Code</button>
                </div>:<></>}
                <textarea
                key={key}
                ref={(el) =>
                (textAreaRefs.current[key] = el)
                }
                rows={1}
                onInput={(e)=>{
                    handleInput(key,e.currentTarget.value)
                    autoResize(e)
                    }}
                value={block.text}
                className={`
                    block
                    w-full
                    resize-none
                    break-words
                    outline-none
                    overflow-hidden
                    ${getHeadingClass(block.heading)}
                    ${getItalics(block)}
                    ${getCode(block)}
                `}
                />
                </div>
            );
            })}
        </div>
        );

}