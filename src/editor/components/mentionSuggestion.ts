import { ReactRenderer } from '@tiptap/react';
import tippy, { type Instance as TippyInstance } from 'tippy.js';
import MentionList, { USERS, type MentionListRef } from './MentionList';
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';

export const mentionSuggestion: Omit<SuggestionOptions, 'editor'> = {
    items: ({ query }: { query: string }) => {
        return USERS.filter((item) =>
            item.label.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    },

    render: () => {
        let component: ReactRenderer<MentionListRef> | null = null;
        let popup: TippyInstance[] | null = null;

        return {
            onStart: (props: SuggestionProps) => {
                component = new ReactRenderer(MentionList, {
                    props,
                    editor: props.editor,
                });

                if (!props.clientRect) return;

                popup = tippy('body', {
                    getReferenceClientRect: props.clientRect as () => DOMRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                });
            },

            onUpdate: (props: SuggestionProps) => {
                component?.updateProps(props);
                if (popup && props.clientRect) {
                    popup[0].setProps({
                        getReferenceClientRect: props.clientRect as () => DOMRect,
                    });
                }
            },

            onKeyDown: (props: { event: KeyboardEvent }) => {
                if (props.event.key === 'Escape') {
                    popup?.[0]?.hide();
                    return true;
                }
                return component?.ref?.onKeyDown(props) ?? false;
            },

            onExit: () => {
                popup?.[0]?.destroy();
                component?.destroy();
            },
        };
    },
};
