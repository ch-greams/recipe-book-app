import React from "react";
import * as constants from "@cypress/constants";

import { Color } from "@common/colors";
import { isSome } from "@common/types";
import type { ProductShort } from "@common/typings";
import Utils from "@common/utils";
import { IconSize } from "@icons/icon-params";
import RbaIconLoading from "@icons/rba-icon-loading";
import RbaIconSearch from "@icons/rba-icon-search";

import { useDelayedSearchInput } from "./hooks";
import RbaSearchInputOption from "./rba-search-input-option";

import styles from "./rba-search-input.module.scss";


export enum SearchInputWidthSize {
    Medium = "widthSize_Medium",
    Full = "widthSize_Full",
}

export enum SearchInputHeightSize {
    Small = "heightSize_Small",
    Medium = "heightSize_Medium",
}

export type OnSelectFunc = (product: ProductShort) => void;

interface Props {
    width: SearchInputWidthSize;
    height?: SearchInputHeightSize;
    placeholder?: string;
    isLoading: boolean;
    value: string;
    items: ProductShort[];
    onChange: (value: string) => void;
    onSelect?: OnSelectFunc;
}

const getOnSelect = (onSelect: OnSelectFunc, searchInputClear: () => void): OnSelectFunc => {
    return (productId) => {
        onSelect(productId);
        searchInputClear();
    };
};

const RbaSearchInput: React.FC<Props> = ({
    width,
    height = SearchInputHeightSize.Medium,
    placeholder = "Search...",
    isLoading = false,
    value = "",
    items = [],
    onChange,
    onSelect,
}) => {

    const DEFAULT_DELAY = 700;
    const { searchInput, searchInputHandler, searchInputClear } = useDelayedSearchInput(onChange, value, DEFAULT_DELAY);

    const classNames = Utils.classNames({
        [styles.search]: true,
        [styles[width]]: true,
        [styles[height]]: true,
    });

    return (
        <div data-cy={constants.CY_SEARCH} className={classNames}>

            <div className={styles.searchInput}>

                <div className={styles.icon}>
                    {(
                        ( !Utils.isEmptyString(searchInput) && isLoading )
                            ? <RbaIconLoading size={IconSize.Large} color={Color.White} />
                            : <RbaIconSearch size={IconSize.Large} color={Color.White} />
                    )}
                </div>

                <input
                    data-cy={constants.CY_SEARCH_INPUT}
                    className={styles.input}
                    type={"text"}
                    placeholder={placeholder}
                    value={searchInput}
                    onChange={searchInputHandler}
                />
            </div>

            {( !Utils.isEmptyString(searchInput) && (
                <div className={styles.searchList}>
                    {items.map((product) => (
                        <RbaSearchInputOption
                            key={product.id}
                            product={product}
                            onSelect={isSome(onSelect) ? getOnSelect(onSelect, searchInputClear) : null}
                        />
                    ))}
                </div>
            ) )}

        </div>
    );
};

RbaSearchInput.displayName = "RbaSearchInput";

export default RbaSearchInput;
