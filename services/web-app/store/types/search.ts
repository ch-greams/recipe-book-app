import type { ProductShort } from "@common/typings";


export interface SearchPageStore {
    isLoaded: boolean;
    errorMessage?: Option<string>;

    searchInput: string;
    products: ProductShort[];
}
