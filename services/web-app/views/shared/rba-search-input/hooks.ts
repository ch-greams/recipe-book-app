import { useState } from "react";

import { isSome } from "@common/types";
import type { InputChangeCallback } from "@common/typings";


interface DelayedSearchInputHook {
    searchInput: string;
    searchInputHandler: InputChangeCallback;
    searchInputClear: () => void;
}

export function useDelayedSearchInput(onChange: (value: string) => void, value: string, delay: number): DelayedSearchInputHook {

    const [ searchInput, setSearchInput ] = useState(value);
    const [ timer, setTimer ] = useState<NodeJS.Timeout>();
    const [ invokeTime, setInvokeTime ] = useState(Date.now() + delay);

    return {
        searchInput: searchInput,
        searchInputHandler: (event) => {

            const _searchInput = event.target.value;
            const delayedRequest = (): void => { onChange(_searchInput); };

            setSearchInput(_searchInput);

            if (isSome(timer)) {
                clearTimeout(timer);
            }

            const timeNow = Date.now();

            if (invokeTime > timeNow) {
                const timeLeft = invokeTime - timeNow;

                setInvokeTime(timeNow + timeLeft);
                setTimer(setTimeout(delayedRequest, timeLeft));
            }
            else {
                setInvokeTime(timeNow + delay);
                setTimer(setTimeout(delayedRequest, delay));
            }
        },
        searchInputClear: () => {
            setSearchInput("");
        },
    };
}
