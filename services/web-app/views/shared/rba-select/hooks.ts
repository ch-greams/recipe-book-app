import { useEffect, useState } from "react";

interface ToggleListHook {
    isListVisible: boolean;
    showList: () => void;
    hideList: () => void;
}

export function useToggleList(): ToggleListHook {

    const [ isListVisible, toggleList ] = useState(false);

    useEffect(() => {

        const close = (): void => toggleList(false);

        if (isListVisible) {
            window.addEventListener("click", close, { capture: true });
        }

        return () => window.removeEventListener("click", close);
    }, [ isListVisible ]);

    return {
        isListVisible,
        showList: () => toggleList(true),
        hideList: () => toggleList(false),
    };
}
