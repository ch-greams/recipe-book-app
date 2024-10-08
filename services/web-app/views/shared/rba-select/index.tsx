import React from "react";
import { CY_SELECT_INPUT_CURRENT_OPTION, CY_SELECT_INPUT_OPTION_LIST } from "@cypress/constants";

import { classNames } from "@common/style";
import { unwrapOr } from "@common/types";
import type { OnClickCallback } from "@common/typings";

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
    "data-cy"?: string;
    disabled?: boolean;
    theme: SelectTheme;
    center?: boolean;
    width: SelectWidthSize;
    height: SelectHeightSize;
    options: SelectOption[];
    value?: string;
    onChange: RbaSelectChangeCallback;
}

export type RbaSelectChangeCallback = (option: SelectOption) => void;

export const getOptionLabel = (option: SelectOption): string => {
    return unwrapOr(option.label, String(option.value));
};


// TODO: Use button elements for all clickables related to this component (no need for select/option this way)
export const RbaSelect: React.FC<Props> = ({
    disabled = false,
    theme,
    center = false,
    width,
    height,
    options,
    value,
    onChange,
    ...props
}) => {

    const { isListVisible, showList, hideList } = useToggleList();

    const onSelect = (option: SelectOption): void => {
        onChange(option);
        hideList();
    };

    const onClick: OnClickCallback = (event) => {
        if (!isListVisible) {
            event.stopPropagation();
        }
        showList();
    };

    return (
        <div
            data-cy={props["data-cy"]}
            className={classNames({
                [styles.select]: true,
                [styles.alignCenter]: center,
                [styles.disabled]: disabled,
                [styles[theme]]: true,
                [styles[width]]: true,
                [styles[height]]: true,
            })}
        >
            <div
                data-cy={CY_SELECT_INPUT_CURRENT_OPTION}
                className={styles.selectOption}
                onClick={( disabled ? undefined : onClick )}
            >
                {value}
            </div>
            {( isListVisible && (
                <div data-cy={CY_SELECT_INPUT_OPTION_LIST} className={styles.selectList}>
                    {(options.map((option) => (<RbaSelectOption key={option.value} option={option} onSelect={onSelect} />)))}
                </div>
            ) )}
        </div>
    );
};

RbaSelect.displayName = "RbaSelect";

export default RbaSelect;
