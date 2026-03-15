import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

// Sample users for mentions — replace with real data from your API
const USERS = [
    { id: '1', label: 'Alice Johnson' },
    { id: '2', label: 'Bob Smith' },
    { id: '3', label: 'Charlie Brown' },
    { id: '4', label: 'Diana Prince' },
    { id: '5', label: 'Eve Williams' },
];

export interface MentionListRef {
    onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

interface MentionListProps {
    items: typeof USERS;
    command: (item: { id: string; label: string }) => void;
}

const MentionList = forwardRef<MentionListRef, MentionListProps>(({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        setSelectedIndex(0);
    }, [items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') {
                setSelectedIndex((prev) => (prev + items.length - 1) % items.length);
                return true;
            }
            if (event.key === 'ArrowDown') {
                setSelectedIndex((prev) => (prev + 1) % items.length);
                return true;
            }
            if (event.key === 'Enter') {
                const item = items[selectedIndex];
                if (item) command(item);
                return true;
            }
            return false;
        },
    }));

    if (!items.length) {
        return (
            <div className="mention-suggestion">
                <div className="mention-item" style={{ color: 'var(--muted-foreground)' }}>
                    No results
                </div>
            </div>
        );
    }

    return (
        <div className="mention-suggestion">
            {items.map((item, index) => (
                <button
                    key={item.id}
                    className={`mention-item ${index === selectedIndex ? 'is-selected' : ''}`}
                    onClick={() => command(item)}
                >
                    <span style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: 'var(--primary)', color: 'var(--primary-foreground)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', fontWeight: 600, flexShrink: 0,
                    }}>
                        {item.label.slice(0, 2).toUpperCase()}
                    </span>
                    {item.label}
                </button>
            ))}
        </div>
    );
});

MentionList.displayName = 'MentionList';

export { USERS };
export default MentionList;
