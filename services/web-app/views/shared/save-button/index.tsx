import React from "react";
import { useDispatch } from "react-redux";
import type { AnyAction } from "redux";

import styles from "./save-button.module.scss";


interface Props {
    saveAction: () => AnyAction;
}

const SaveButton: React.FC<Props> = ({ saveAction }) => {

    const dispatch = useDispatch();

    return (
        <div className={styles.saveButton} onClick={() => dispatch(saveAction())}>
            {"SAVE"}
        </div>
    );
};

SaveButton.displayName = "SaveButton";

export default SaveButton;
