import React from "react";
import { CY_PAGE_SAVE_BUTTON } from "@cypress/constants";

import styles from "./rba-button.module.scss";


interface Props {
    /**
     * Button label
     */
    label: string;
    /**
     * Button action
     */
    onClick: () => void;
}

const RbaButton: React.FC<Props> = ({ label, onClick }) => {

    return (
        <button
            data-cy={CY_PAGE_SAVE_BUTTON}
            type={"button"}
            className={styles.rbaButton}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

RbaButton.displayName = "RbaButton";

export default RbaButton;
