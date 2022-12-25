import React from "react";
import * as constants from "@cypress/constants";
import type { AnyAction } from "@reduxjs/toolkit";

import { unwrapOr } from "@common/types";
import { keepCaretInPlace } from "@common/utils";
import { useAppDispatch } from "@store";

import RbaInput, { InputHeightSize, InputTextAlign, InputTheme, InputWidthSize } from "../rba-input";

import styles from "./rba-page-title-block-input.module.scss";



interface Props {
    name: string;
    brand: string;
    description?: string;
    updateName: (value: string) => AnyAction;
    updateBrand: (value: string) => AnyAction;
    updateDescription: (value: string) => AnyAction;
}


const MIN_DESCRIPTION_SIZE: number = 3;

const RbaPageTitleBlockInput: React.FC<Props> = ({
    name, brand, description, updateName, updateBrand, updateDescription,
}) => {
    const dispatch = useAppDispatch();

    const descriptionText = unwrapOr(description, "");
    const descriptionSize = descriptionText.numberOfLines();

    return (

        <div className={styles.titleBlock}>

            <div className={styles.nameBlock}>

                <RbaInput
                    data-cy={constants.CY_PAGE_TITLE_NAME_INPUT}
                    theme={InputTheme.Alternative}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Large}
                    align={InputTextAlign.Left}
                    placeholder={"NAME"}
                    value={name}
                    onChange={(value: string): void => { dispatch(updateName(unwrapOr(value, ""))); }}
                />

                <RbaInput
                    data-cy={constants.CY_PAGE_TITLE_BRAND_INPUT}
                    theme={InputTheme.Alternative}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Large}
                    align={InputTextAlign.Right}
                    placeholder={"BRAND"}
                    value={brand}
                    onChange={(value: string): void => { dispatch(updateBrand(unwrapOr(value, ""))); }}
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
                        keepCaretInPlace(window, event);
                        dispatch(updateDescription(unwrapOr(event.target.value, "")));
                    }}
                />
            </div>
        </div>
    );
};

RbaPageTitleBlockInput.displayName = "RbaPageTitleBlockInput";

export default RbaPageTitleBlockInput;
