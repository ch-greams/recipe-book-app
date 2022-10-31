import type { ProductShort } from "@common/typings";


export interface SearchStore {
    isLoaded: boolean;
    errorMessage?: Option<string>;

    searchInput: string;
    products: ProductShort[];
}
