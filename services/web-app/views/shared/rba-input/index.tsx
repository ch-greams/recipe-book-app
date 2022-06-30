import React from "react";

import type { InputChangeCallback } from "@common/typings";
import Utils from "@common/utils";

import styles from "./rba-input.module.scss";


// NOTE: Values correspond to the class names
export enum InputTheme {
    Primary = "theme_Primary",
    Alternative = "theme_Alternative",
}

export enum InputWidthSize {
    Small = "widthSize_Small",
    Medium = "widthSize_Medium",
    Large = "widthSize_Large",
    Full = "widthSize_Full",
}

export enum InputHeightSize {
    Small = "heightSize_Small",
    Medium = "heightSize_Medium",
    Large = "heightSize_Large",
}

export enum InputTextAlign {
    Left = "textAlign_Left",
    Center = "textAlign_Center",
    Right = "textAlign_Right",
}

interface Props {
    value: string;
    disabled?: boolean;
    placeholder?: string;
    align?: InputTextAlign;
    theme: InputTheme;
    width: InputWidthSize;
    height: InputHeightSize;
    onChange: InputChangeCallback;
}

const RbaInput: React.FC<Props> = ({
    value = "",
    placeholder = "",
    align = InputTextAlign.Right,
    theme,
    width,
    height,
    disabled = false,
    onChange,
}) => {

    const classNames = Utils.classNames({
        [styles.rbaInput]: true,
        [styles[align]]: true,
        [styles[theme]]: true,
        [styles[width]]: true,
        [styles[height]]: true,
        [styles.disabled]: disabled,
    });

    return (
        <input
            disabled={disabled}
            placeholder={placeholder}
            type={"text"}
            className={classNames}
            value={value}
            onChange={onChange}
        />
    );
};

RbaInput.displayName = "RbaInput";

export default RbaInput;