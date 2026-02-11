import { useRef, useEffect } from "react";
import useMock from "@stores/globalStore";
import { Heading,Language,type TextBlockType } from "@myTypes/globalTypes";

type Props = {
  block: TextBlockType;
};

function getHeadingClass(heading?: Heading) {
  switch (heading) {
    case Heading.H1:
      return "text-4xl font-extrabold lg:text-5xl my-6";
    case Heading.H2:
      return "text-3xl font-semibold my-4 border-b pb-2";
    case Heading.H3:
      return "text-2xl font-semibold my-2";
    default:
      return "";
  }
}

export default function TextBlock({ block }: Props) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const { mock, updateBlock, addBlock, deleteBlock } =
    useMock();

  function handleInput(val: string) {
    let data: Partial<TextBlockType> = { text: val };
    console.log("i have been workign")
    if (val.startsWith("/code")) {
      data = {
        isCode: true,
        codeLanguage:Language.default,
        text: val.replace("/code", "").trim(),
      };
    } else if (val.startsWith("/h1")) {
      data = {
        heading: Heading.H1,
        text: val.replace("/h1", "").trim(),
      };
    } else if (val.startsWith("/h2")) {
      data = {
        heading: Heading.H2,
        text: val.replace("/h2", "").trim(),
      };
    } else if (val.startsWith("/h3")) {
      data = {
        heading: Heading.H3,
        text: val.replace("/h3", "").trim(),
      };
    } else if (val.startsWith("/italic")) {
      data = {
        isItalic: true,
        text: val.replace("/italic", "").trim(),
      };
    }

    updateBlock(block.id, data);

    const isLast =
      mock[mock.length - 1].id === block.id;

    if (val.trim() === "" && !isLast) {
      deleteBlock(block.id);
    }

    if (isLast && val.trim() !== "") {
      addBlock();
    }
  }

  function autoResize() {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height =
      ref.current.scrollHeight + "px";
  }

  useEffect(autoResize, [block.text]);

  return (
    <div
      className={`${getHeadingClass(
        block.heading
      )} ${block.isItalic ? "italic" : ""}`}
    >
      <textarea
        ref={ref}
        rows={1}
        value={block.text}
        onChange={(e) =>
          handleInput(e.target.value)
        }
        placeholder="Type '/' for commands..."
        className="block w-full resize-none outline-none bg-transparent overflow-hidden"
      />
    </div>
  );
}
