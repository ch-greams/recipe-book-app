import type { SearchClearAction, SearchProductsFetchRequestedAction } from "./types";
import { SEARCH_CLEAR } from "./types";
import { SEARCH_PRODUCTS_FETCH_REQUEST } from "./types";



export function searchClear(): SearchClearAction {
    return {
        type: SEARCH_CLEAR,
    };
}

export function searchProducts(payload: string): SearchProductsFetchRequestedAction {
    return {
        type: SEARCH_PRODUCTS_FETCH_REQUEST,
        payload: payload,
    };
}
