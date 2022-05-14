import React from "react";
import { useDispatch } from "react-redux";
import type { AnyAction } from "redux";
import * as constants from "@cypress/constants";

import Utils from "@common/utils";

import styles from "./rba-page-title-block.module.scss";



interface Props {
    name: string;
    brand: string;
    subtitle: string;
    description?: string;
    confirmTitle: () => void;
    updateName: (value: string) => AnyAction;
    updateBrand: (value: string) => AnyAction;
    updateSubtitle: (value: string) => AnyAction;
    updateDescription: (value: string) => AnyAction;

}

const formatInput = (value: Option<string>, uppercase: boolean = true): string => {
    return uppercase ? Utils.unwrap(value, "").toUpperCase() : Utils.unwrap(value, "");
};

const RbaPageTitleBlockInput: React.FC<Props> = ({
    name, brand, subtitle, description, confirmTitle,
    updateName, updateBrand, updateSubtitle, updateDescription,
}) => {

    const dispatch = useDispatch();

    return (

        <div className={styles.titleBlock}>

            <div className={styles.nameBlock}>

                <input
                    data-cy={constants.CY_PAGE_TITLE_NAME_INPUT}
                    type={"text"}
                    className={styles.nameInput}
                    placeholder={"NAME"}
                    value={name.toUpperCase()}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                        Utils.keepCaretInPlace(window, event);
                        dispatch(updateName(formatInput(event.target.value)));
                    }}
                />

                <input
                    data-cy={constants.CY_PAGE_TITLE_BRAND_INPUT}
                    type={"text"}
                    className={styles.brandInput}
                    placeholder={"BRAND"}
                    value={brand.toUpperCase()}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                        Utils.keepCaretInPlace(window, event);
                        dispatch(updateBrand(formatInput(event.target.value)));
                    }}
                />

            </div>

            <div className={styles.subtitleBlock}>

                <input
                    data-cy={constants.CY_PAGE_TITLE_SUBTITLE_INPUT}
                    type={"text"}
                    className={styles.subtitleInput}
                    placeholder={"SUBTITLE"}
                    value={subtitle.toUpperCase()}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                        Utils.keepCaretInPlace(window, event);
                        dispatch(updateSubtitle(formatInput(event.target.value)));
                    }}
                />

                <div
                    data-cy={constants.CY_PAGE_TITLE_CONFIRM_BUTTON}
                    className={styles.confirmButton}
                    onClick={confirmTitle}
                >
                    {"CONFIRM"}
                </div>
            </div>

            <div className={styles.descriptionBlock}>
                <textarea
                    data-cy={constants.CY_PAGE_TITLE_DESCRIPTION_INPUT}
                    className={styles.descriptionBlockInput}
                    name={"description"} id={"description"} rows={6}
                    placeholder={"Description"} value={(description || "")}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
                        Utils.keepCaretInPlace(window, event);
                        dispatch(updateDescription(formatInput(event.target.value, false)));
                    }}
                />
            </div>
        </div>
    );
};

RbaPageTitleBlockInput.displayName = "RbaPageTitleBlockInput";

export default RbaPageTitleBlockInput;