import React from "react";
import { CY_SELECT_INPUT_OPTION } from "@cypress/constants";

import type { RbaSelectChangeCallback } from ".";
import { getOptionLabel } from ".";

import styles from "./rba-select.module.scss";

export interface SelectOption {
    group?: Option<string>;
    label?: Option<string>;
    value: string;
}

interface Props {
    option: SelectOption;
    onSelect: RbaSelectChangeCallback;
}


const RbaSelectOption: React.FC<Props> = ({ option, onSelect }) => (
    <li
        data-cy={CY_SELECT_INPUT_OPTION}
        className={styles.selectOption}
        onClick={() => onSelect(option)}
    >
        {getOptionLabel(option)}
    </li>
);

RbaSelectOption.displayName = "RbaSelectOption";

export default RbaSelectOption;
