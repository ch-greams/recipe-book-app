import React from "react";
import { CY_BUTTON } from "@cypress/constants";

import Utils from "@common/utils";

import styles from "./rba-button.module.scss";


export enum ButtonWidthSize {
    Medium = "widthSize_Medium",
    Full = "widthSize_Full",
}

interface Props {
    label: string;
    disabled?: boolean;
    width: ButtonWidthSize;
    onClick: () => void;
}

const RbaButton: React.FC<Props> = ({ label, disabled = false, width, onClick }) => {

    const classNames = Utils.classNames({
        [styles.rbaButton]: true,
        [styles.disabled]: disabled,
        [styles[width]]: true,
    });

    return (
        <button
            data-cy={CY_BUTTON}
            type={"button"}
            disabled={disabled}
            className={classNames}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

RbaButton.displayName = "RbaButton";

export default RbaButton;
