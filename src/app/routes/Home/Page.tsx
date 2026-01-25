import Editor from '@mylexical/Editor.tsx'
export default function Page() {
    return (
        <div className="w-full flex justify-center">
            <div className="mt-20 w-2/3 
                        flex flex-row bg-card
                        rounded-md">
                <Editor />
            </div>
        </div>
    );
}   