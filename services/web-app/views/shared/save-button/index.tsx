import React from "react";
import { useDispatch } from "react-redux";
import type { AnyAction } from "redux";
import { CY_PAGE_SAVE_BUTTON } from "cypress/constants";

import styles from "./save-button.module.scss";


interface Props {
    saveAction: () => AnyAction;
}

const SaveButton: React.FC<Props> = ({ saveAction }) => {

    const dispatch = useDispatch();

    return (
        <div
            data-cy={CY_PAGE_SAVE_BUTTON}
            className={styles.saveButton}
            onClick={() => dispatch(saveAction())}
        >
            {"SAVE"}
        </div>
    );
};

SaveButton.displayName = "SaveButton";

export default SaveButton;
