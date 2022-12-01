import React from "react";
import { CY_BUTTON } from "@cypress/constants";

import { classNames } from "@common/style";

import styles from "./rba-button.module.scss";


export enum ButtonTheme {
    Primary = "theme_Primary",
    PrimarySmall = "theme_PrimarySmall",
}

export enum ButtonWidthSize {
    Medium = "widthSize_Medium",
    Full = "widthSize_Full",
}

export enum ButtonHeightSize {
    Medium = "heightSize_Medium",
    Full = "heightSize_Full",
}

interface Props {
    label: string;
    disabled?: boolean;
    width: ButtonWidthSize;
    height?: ButtonHeightSize;
    theme?: ButtonTheme;
    onClick: () => void;
}

const RbaButton: React.FC<Props> = ({
    label,
    disabled = false,
    width,
    height = ButtonHeightSize.Medium,
    onClick,
    theme = ButtonTheme.Primary,
}) => {
    return (
        <button
            data-cy={CY_BUTTON}
            type={"button"}
            disabled={disabled}
            className={classNames({
                [styles.rbaButton]: true,
                [styles.disabled]: disabled,
                [styles[width]]: true,
                [styles[height]]: true,
                [styles[theme]]: true,
            })}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

RbaButton.displayName = "RbaButton";

export default RbaButton;
