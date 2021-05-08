import React from "react";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";

import type { Option } from "@common/typings";
import Utils from "@common/utils";

import styles from "./PageTitleBlock.scss";



interface Props {
    name: string;
    brand: string;
    subtitle: string;
    description?: string;
    withDescription?: boolean;
    confirmTitle: () => void;
    updateName: (value: string) => AnyAction;
    updateBrand: (value: string) => AnyAction;
    updateSubtitle: (value: string) => AnyAction;
    updateDescription?: Option<(value: string) => AnyAction>;

}

const formatInput = (value: Option<string>, uppercase: boolean = true): string => {
    return uppercase ? Utils.unwrap(value, "").toUpperCase() : Utils.unwrap(value, "");
};

const PageTitleBlockInput: React.FC<Props> = ({
    name, brand, subtitle, description, withDescription, confirmTitle,
    updateName, updateBrand, updateSubtitle, updateDescription,
}) => {

    const dispatch = useDispatch();

    const descriptionBlock = (
        <div className={styles.descriptionBlock}>
            <textarea
                className={styles.descriptionBlockInput}
                name={"description"} id={"description"} rows={6}
                placeholder={"Description"} value={(description || "")}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
                    Utils.keepCaretInPlace(window, event);
                    dispatch(updateDescription(formatInput(event.target.value, false)));
                }}
            />
        </div>
    );

    return (

        <div className={styles.titleBlock}>

            <div className={styles.nameBlock}>

                <input
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
                    type={"text"}
                    className={styles.subtitleInput}
                    placeholder={"SUBTITLE"}
                    value={subtitle.toUpperCase()}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                        Utils.keepCaretInPlace(window, event);
                        dispatch(updateSubtitle(formatInput(event.target.value)));
                    }}
                />

                <div className={styles.confirmButton} onClick={confirmTitle}>
                    {"CONFIRM"}
                </div>
            </div>

            {withDescription && descriptionBlock}
        </div>
    );
};

PageTitleBlockInput.displayName = "PageTitleBlockInput";

export default PageTitleBlockInput;
