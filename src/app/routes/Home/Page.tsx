import { EditorRoot } from '@editor';

export default function Page() {
    return (
        <div className="w-full flex justify-center mt-20">
            <div className="w-full max-w-4xl">
                <EditorRoot />
            </div>
        </div>
    );
}