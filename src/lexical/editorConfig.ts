import type { InitialConfigType } from '@lexical/react/LexicalComposer';
const theme = {
    paragraph: 'mb-2',
    text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
    },
};

const onError = (error: Error) => {
    console.error(error);
};

export const editorConfig: InitialConfigType = {
    namespace: 'MyEditor',
    theme,
    onError,
};
