import React from "react";
import { CY_PAGE_SAVE_BUTTON } from "@cypress/constants";

import Utils from "@common/utils";

import styles from "./rba-button.module.scss";


export enum ButtonWidthSize {
    Medium = "widthSize_Medium",
    Full = "widthSize_Full",
}

interface Props {
    label: string;
    width: ButtonWidthSize;
    onClick: () => void;
}

const RbaButton: React.FC<Props> = ({ label, width, onClick }) => {

    const classNames = Utils.classNames({
        [styles.rbaButton]: true,
        [styles[width]]: true,
    });

    return (
        <button
            data-cy={CY_PAGE_SAVE_BUTTON}
            type={"button"}
            className={classNames}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

RbaButton.displayName = "RbaButton";

export default RbaButton;
