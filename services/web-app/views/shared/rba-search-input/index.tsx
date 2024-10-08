import React from "react";
import * as constants from "@cypress/constants";

import { classNames, Color } from "@common/style";
import { isSome } from "@common/types";
import type { FoodShort } from "@common/typings";
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

export type OnSelectFunc = (food: FoodShort) => void;

interface Props {
    "data-cy"?: string;
    width: SearchInputWidthSize;
    height?: SearchInputHeightSize;
    placeholder?: string;
    isLoading: boolean;
    value: string;
    items: FoodShort[];
    onChange: (value: string) => void;
    onSelect?: OnSelectFunc;
}

const getOnSelect = (onSelect: OnSelectFunc, searchInputClear: () => void): OnSelectFunc => {
    return (foodId) => {
        onSelect(foodId);
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
    ...props
}) => {

    const DEFAULT_DELAY = 700;
    const { searchInput, searchInputHandler, searchInputClear } = useDelayedSearchInput(onChange, value, DEFAULT_DELAY);

    return (
        <div
            data-cy={props["data-cy"]}
            className={classNames({ [styles.search]: true, [styles[width]]: true, [styles[height]]: true })}
        >

            <div className={styles.searchInput}>

                <div className={styles.icon}>
                    {(
                        ( searchInput.isNotEmpty() && isLoading )
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

            {( searchInput.isNotEmpty() && (
                <div className={styles.searchList}>
                    {items.map((food) => (
                        <RbaSearchInputOption
                            key={food.id}
                            food={food}
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
