import TextBlock from "./TextBlock";
import CodeBlock from "./CodeBlock";
import useMock from "@stores/globalStore";
export default function TextCustom() {
  const { mock } = useMock();

  return (
    <div className="break-words mx-2 overflow-hidden max-w-4xl mx-auto p-4">
      {mock.map((block) =>
        block.isCode ? (
          <CodeBlock key={block.id} block={block} />
        ) : (
          <TextBlock key={block.id} block={block} />
        )
      )}
    </div>
  );
}
