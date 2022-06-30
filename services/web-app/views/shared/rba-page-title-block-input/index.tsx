import React from "react";
import { useDispatch } from "react-redux";
import type { AnyAction } from "redux";
import * as constants from "@cypress/constants";

import { unwrapOr } from "@common/types";
import Utils from "@common/utils";

import RbaInput, { InputHeightSize, InputTextAlign, InputTheme, InputWidthSize } from "../rba-input";

import styles from "./rba-page-title-block-input.module.scss";



interface Props {
    name: string;
    brand: string;
    subtitle: string;
    description?: string;
    updateName: (value: string) => AnyAction;
    updateBrand: (value: string) => AnyAction;
    updateSubtitle: (value: string) => AnyAction;
    updateDescription: (value: string) => AnyAction;
}


const formatInput = (value: Option<string>, uppercase: boolean = true): string => {
    return uppercase ? unwrapOr(value, "").toUpperCase() : unwrapOr(value, "");
};

const MIN_DESCRIPTION_SIZE: number = 3;

const RbaPageTitleBlockInput: React.FC<Props> = ({
    name, brand, subtitle, description,
    updateName, updateBrand, updateSubtitle, updateDescription,
}) => {
    const dispatch = useDispatch();

    const descriptionText = unwrapOr(description, "");
    const descriptionSize = Utils.getNumberOfLines(descriptionText);

    return (

        <div className={styles.titleBlock}>

            <div className={styles.nameBlock}>

                <RbaInput
                    // data-cy={constants.CY_PAGE_TITLE_NAME_INPUT}
                    theme={InputTheme.Alternative}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Large}
                    align={InputTextAlign.Left}
                    placeholder={"NAME"}
                    value={name.toUpperCase()}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                        Utils.keepCaretInPlace(window, event);
                        dispatch(updateName(formatInput(event.target.value)));
                    }}
                />

                <RbaInput
                    // data-cy={constants.CY_PAGE_TITLE_BRAND_INPUT}
                    theme={InputTheme.Alternative}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Large}
                    align={InputTextAlign.Right}
                    placeholder={"BRAND"}
                    value={brand.toUpperCase()}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                        Utils.keepCaretInPlace(window, event);
                        dispatch(updateBrand(formatInput(event.target.value)));
                    }}
                />

            </div>

            <div className={styles.subtitleBlock}>
                <RbaInput
                    // data-cy={constants.CY_PAGE_TITLE_SUBTITLE_INPUT}
                    theme={InputTheme.Alternative}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Large}
                    align={InputTextAlign.Left}
                    placeholder={"SUBTITLE"}
                    value={subtitle.toUpperCase()}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                        Utils.keepCaretInPlace(window, event);
                        dispatch(updateSubtitle(formatInput(event.target.value)));
                    }}
                />
            </div>

            <div className={styles.descriptionBlock}>
                <textarea
                    data-cy={constants.CY_PAGE_TITLE_DESCRIPTION_INPUT}
                    className={styles.description}
                    name={"description"} id={"description"}
                    rows={descriptionSize > MIN_DESCRIPTION_SIZE ? descriptionSize : MIN_DESCRIPTION_SIZE}
                    placeholder={"Description"} value={descriptionText}
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
