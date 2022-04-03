import React from "react";

import Utils from "@common/utils";
import SearchIcon from "@icons/search-sharp.svg";

import styles from "./search-input.module.scss";


const SearchInput: React.FC = () => {
    return (
        <div className={styles.searchInput}>

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

SearchInput.displayName = "SearchInput";

export default SearchInput;
