import React, { useState } from "react";

import { classNames } from "@common/style";
import { isSome } from "@common/types";
import Utils from "@common/utils";

import { decimalNormalizer, timeNormalizer } from "./normalizers";

import styles from "./rba-input.module.scss";


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

export enum InputNormalizer {
    Decimal,
    Time,
}

export type RbaInputChangeCallback = (value: string) => void;

interface Props {
    "data-cy"?: string;
    value: string;
    disabled?: boolean;
    hidden?: boolean;
    name?: string;
    placeholder?: string;
    align?: InputTextAlign;
    theme: InputTheme;
    width: InputWidthSize;
    height: InputHeightSize;
    maxLength?: number;
    normalizer?: InputNormalizer;
    onChange: RbaInputChangeCallback;
    onBlur?: RbaInputChangeCallback;
}


function withNormalizer(type: Option<InputNormalizer>, value: string, previousValue: string): string {
    switch (type) {
        case InputNormalizer.Decimal:
            return decimalNormalizer(value, previousValue);
        case InputNormalizer.Time:
            return timeNormalizer(value, previousValue);
        default:
            return value;
    }
}

const RbaInput: React.FC<Props> = ({
    value = "",
    placeholder = "",
    align = InputTextAlign.Right,
    theme,
    width,
    height,
    disabled = false,
    hidden = false,
    name,
    maxLength,
    onChange,
    onBlur,
    normalizer,
    ...props
}) => {

    const [ inputValue, setInputValue ] = useState(value);

    if (inputValue !== value) {
        setInputValue(value);
    }

    return (
        <input
            data-cy={props["data-cy"]}
            disabled={disabled}
            placeholder={placeholder}
            type={hidden ? "password" : "text"}
            name={name}
            className={classNames({
                [styles.rbaInput]: true,
                [styles[align]]: true,
                [styles[theme]]: true,
                [styles[width]]: true,
                [styles[height]]: true,
                [styles.disabled]: disabled,
            })}
            value={inputValue}
            maxLength={maxLength}
            onChange={(event) => {
                const newValue = withNormalizer(normalizer, event.target.value, inputValue);
                setInputValue(newValue);

                Utils.keepCaretInPlace(window, event);

                onChange(newValue);
            }}
            onBlur={(event) => {
                if (isSome(onBlur)) {
                    onBlur(event.target.value);
                }
            }}
        />
    );
};

RbaInput.displayName = "RbaInput";

export default RbaInput;
