import { useRef } from 'react';
import { DraggableBlockPlugin_EXPERIMENTAL } from '@lexical/react/LexicalDraggableBlockPlugin';
import { GripVertical } from 'lucide-react';

const DRAGGABLE_BLOCK_MENU_CLASSNAME = 'draggable-block-menu';

function DraggableBlockMenu() {
    return (
        <div className={`${DRAGGABLE_BLOCK_MENU_CLASSNAME} cursor-grab p-1 hover:bg-gray-100 rounded shadow-sm bg-white border border-gray-200`}>
            <GripVertical className="h-4 w-4 text-gray-500" />
        </div>
    );
}

function DraggableBlockTargetLine() {
    return (
        <div className="pointer-events-none absolute top-0 left-0 h-1 w-full bg-primary opacity-0 transition-opacity duration-200" />
    );
}

export default function DraggableBlockWrapper({
    anchorElem,
}: {
    anchorElem: HTMLElement;
}) {
    const menuRef = useRef<HTMLDivElement>(null);
    const targetLineRef = useRef<HTMLDivElement>(null);

    return (
        <DraggableBlockPlugin_EXPERIMENTAL
            anchorElem={anchorElem}
            menuRef={menuRef}
            targetLineRef={targetLineRef}
            menuComponent={
                <div ref={menuRef} className="absolute left-0 top-0 will-change-transform z-50">
                    <DraggableBlockMenu />
                </div>
            }
            targetLineComponent={
                <div ref={targetLineRef} className="pointer-events-none absolute left-0 top-0 will-change-transform">
                    <DraggableBlockTargetLine />
                </div>
            }
            isOnMenu={(element: HTMLElement) => {
                return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
            }}
        />
    );
}
