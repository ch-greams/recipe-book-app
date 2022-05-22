import React from "react";
import * as constants from "@cypress/constants";

import Utils from "@common/utils";

import { useToggleList } from "./hooks";
import type { SelectOption } from "./rba-select-option";
import RbaSelectOption from "./rba-select-option";

import styles from "./rba-select.module.scss";


// NOTE: Values correspond to the class names
export enum SelectTheme {
    Primary = "theme_Primary",
    Alternative = "theme_Alternative",
}

export enum SelectWidthSize {
    Medium = "widthSize_Medium",
    Full = "widthSize_Full",
}

export enum SelectHeightSize {
    Small = "heightSize_Small",
    Medium = "heightSize_Medium",
    Large = "heightSize_Large",
}

interface Props {
    theme: SelectTheme;
    center?: boolean;
    width: SelectWidthSize;
    height: SelectHeightSize;
    options: SelectOption[];
    value?: string;
    onChange: (option: SelectOption) => void;
}


export const getOptionLabel = (option: SelectOption): string => {
    return Utils.unwrapOr(option.label, String(option.value));
};


// TODO: Use button elements for all clickables related to this component (no need for select/option this way)
export const RbaSelect: React.FC<Props> = ({ theme, center = false, width, height, options, value, onChange }) => {

    const { isListVisible, showList, hideList } = useToggleList();

    const onSelect = (option: SelectOption): void => {
        onChange(option);
        hideList();
    };

    const classNames = Utils.classNames({
        [styles.select]: true,
        [styles.alignCenter]: center,
        [styles[theme]]: true,
        [styles[width]]: true,
        [styles[height]]: true,
    });

    return (
        <div
            data-cy={constants.CY_SELECT_INPUT}
            className={classNames}
        >
            <div className={styles.selectOption} onClick={showList}>
                {value}
            </div>
            {( isListVisible && (
                <div className={styles.selectList}>
                    {(options.map((option) => (<RbaSelectOption key={option.value} option={option} onSelect={onSelect} />)))}
                </div>
            ) )}
        </div>
    );
};

RbaSelect.displayName = "RbaSelect";

export default RbaSelect;
