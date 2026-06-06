import {
    useState,
    type DragEventHandler,
    type MouseEventHandler,
    type TouchEventHandler,
    useRef,
    useEffect
} from 'react';

type Options = {
    fileMask?: string;
    onDrop: (f: File) => void;
}

const extractFilesFromDropEvent = (e: DragEvent): File[] => {
    if (e.dataTransfer?.items) {
        return [...e.dataTransfer.items]
            .filter(item => item?.kind === 'file')
            .map(item => item.getAsFile()!);
    } else {
        return [...e.dataTransfer?.files ?? []];
    }
};

export const useDropZone = (options: Options) => {
    const userOnDrop = options.onDrop;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [isManualSelecting, setIsManualSelecting] = useState(false);
    const onDragEnter: DragEventHandler<HTMLDivElement> = (_) => {
        setIsDraggingOver(true);
    };
    const onDragLeave: DragEventHandler<HTMLDivElement> = (_) => {
        setIsDraggingOver(false);
    };
    const onDragOver: DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const onDrop: DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        const files = extractFilesFromDropEvent(e.nativeEvent);
        if (files.length === 0) {
            return;
        }

        userOnDrop(files[0]);
    };
    const handleManualSelect = async () => {
        if (isManualSelecting || !inputRef.current) {
            return true;
        }
        setIsManualSelecting(true);
        inputRef.current.click();
    };
    const onClick: MouseEventHandler = (e) => {
        e.preventDefault();
        handleManualSelect();
    };
    const onTouchEnd: TouchEventHandler = (e) => {
        e.preventDefault();
        handleManualSelect();
    };

    useEffect(() => {
        if (!inputRef.current) {
            const input = document.createElement('input')!;
            input.type = 'file';
            if (options.fileMask) {
                input.accept = options.fileMask;
            } else {
                input.removeAttribute('accept');
            }
            inputRef.current = input;
            input.addEventListener('change', _ => {
                // you can use this method to get file and perform respective operations
                const files = [...input.files ?? []];
                if (files.length > 0) {
                    userOnDrop(files[0]);
                }
                input.value = '';
                setIsManualSelecting(false);
            });
            input.addEventListener('cancel', _ => {
                setIsManualSelecting(false);
            });
        }
    }, [userOnDrop, options.fileMask]);

    return {
        isDraggingOver,
        onDragOver,
        onDragEnter,
        onDragLeave,
        onDrop,
        onClick,
        onTouchEnd,
    };
};
