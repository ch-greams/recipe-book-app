import React from "react";

import Utils from "@common/utils";
import SearchIcon from "@icons/search-sharp.svg";

import styles from "./rba-search-input.module.scss";


export enum SearchInputWidthSize {
    Medium = "widthSize_Medium",
    Full = "widthSize_Full",
}

interface Props {
    width: SearchInputWidthSize;
}

const RbaSearchInput: React.FC<Props> = ({ width }) => {

    const classNames = Utils.classNames({
        [styles.searchInput]: true,
        [styles[width]]: true,
    });

    return (
        <div className={classNames}>

            <SearchIcon
                className={styles.icon}
                width={"28"}
                height={"28"}
                fill={Utils.COLOR_WHITE}
                stroke={Utils.COLOR_WHITE}
            />

            <input
                className={styles.input}
                type={"text"}
                placeholder={"Search..."}
            />

        </div>
    );
};

RbaSearchInput.displayName = "RbaSearchInput";

export default RbaSearchInput;
