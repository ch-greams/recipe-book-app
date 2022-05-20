import React from "react";
import * as constants from "@cypress/constants";

import { getOptionLabel } from ".";

import styles from "./rba-select.module.scss";

export interface SelectOption {
    group?: Option<string>;
    label?: Option<string>;
    value: string;
}

interface Props {
    option: SelectOption;
    onSelect: (option: SelectOption) => void;
}


const RbaSelectOption: React.FC<Props> = ({ option, onSelect }) => (
    <div
        data-cy={constants.CY_SELECT_INPUT_OPTION}
        className={styles.selectOption}
        onClick={() => onSelect(option)}
    >
        {getOptionLabel(option)}
    </div>
);

RbaSelectOption.displayName = "RbaSelectOption";

export default RbaSelectOption;
