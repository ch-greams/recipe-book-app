import type { FoodShort } from "@common/typings";


export interface SearchStore {
    isLoaded: boolean;
    errorMessage?: Option<string>;

    searchInput: string;
    products: FoodShort[];
}
