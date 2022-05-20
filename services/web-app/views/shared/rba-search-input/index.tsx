import React from "react";

import type { ProductShort } from "@common/typings";
import Utils from "@common/utils";
import SearchIcon from "@icons/search-sharp.svg";
import LoadingIcon from "@icons/sync-sharp.svg";

import { useDelayedSearchInput } from "./hooks";
import RbaSearchInputOption from "./rba-search-input-option";

import styles from "./rba-search-input.module.scss";


export enum SearchInputWidthSize {
    Medium = "widthSize_Medium",
    Full = "widthSize_Full",
}

interface Props {
    width: SearchInputWidthSize;
    isLoading: boolean;
    value: string;
    items: ProductShort[];
    onChange: (value: string) => void;
}

const RbaSearchInput: React.FC<Props> = ({ width, isLoading = false, value = "", items = [], onChange }) => {

    const DEFAULT_DELAY = 700;
    const { searchInput, searchInputHandler } = useDelayedSearchInput(onChange, value, DEFAULT_DELAY);

    const classNames = Utils.classNames({
        [styles.search]: true,
        [styles[width]]: true,
    });

    const searchIcon = (
        <div className={styles.icon}>
            <SearchIcon
                width={"28"}
                height={"28"}
                fill={Utils.COLOR_WHITE}
                stroke={Utils.COLOR_WHITE}
            />
        </div>

    );

    const loadingIcon = (
        <div className={[ styles.icon, styles.rotate ].join(" ")}>
            <LoadingIcon
                width={"28"}
                height={"28"}
                fill={Utils.COLOR_WHITE}
                stroke={Utils.COLOR_WHITE}
            />
        </div>
    );

    return (
        <div className={classNames}>

            <div className={styles.searchInput}>

                {( isLoading ? loadingIcon : searchIcon )}

                <input
                    className={styles.input}
                    type={"text"}
                    placeholder={"Search..."}
                    value={searchInput}
                    onChange={searchInputHandler}
                />
            </div>

            {( !Utils.isEmptyString(searchInput) && (
                <div className={styles.searchList}>
                    {items.map((product) => ( <RbaSearchInputOption key={product.id} product={product} /> ))}
                </div>
            ) )}

        </div>
    );
};

RbaSearchInput.displayName = "RbaSearchInput";

export default RbaSearchInput;
