import React from "react";
import { CY_TOGGLE } from "@cypress/constants";

import styles from "./rba-toggle.module.scss";


interface Props {
    value: boolean;
    onToggle: (value: boolean) => void;
}


const RbaToggle: React.FC<Props> = ({ value, onToggle }) => {
    return (
        <label data-cy={CY_TOGGLE} className={styles.toggle}>
            <input
                type={"checkbox"}
                checked={value}
                onChange={(event) => onToggle(event.target.checked)}
            />
            <span className={styles.slider} />
        </label>
    );
};

RbaToggle.displayName = "RbaToggle";

export default RbaToggle;
