import React from "react";
import { useDispatch } from "react-redux";
import {
    CY_SUB_DIRECTION_LINE, CY_SUB_DIRECTION_LINE_CHECKBOX,
    CY_SUB_DIRECTION_LINE_NAME, CY_SUB_DIRECTION_LINE_REMOVE_BUTTON,
} from "cypress/constants";

import type { VolumeUnit, WeightUnit } from "@common/units";
import { Units } from "@common/units";
import Utils from "@common/utils";
import type { SelectOption } from "@views/shared/select-input";
import SelectInput, { SelectInputType } from "@views/shared/select-input";
import * as actions from "@store/recipe/actions";
import type { RecipeSubDirectionIngredient } from "@store/recipe/types";
import RemoveIcon from "@icons/close-sharp.svg";
import IconWrapper from "@icons/IconWrapper";

import styles from "./directions-block.module.scss";


interface Props {
    isReadOnly: boolean;
    subDirection: RecipeSubDirectionIngredient;
    directionIndex: number;
    stepNumber: number;
}


const SubDirectionLine: React.FC<Props> = ({ isReadOnly, subDirection, directionIndex, stepNumber }) => {

    const dispatch = useDispatch();

    const checkbox = (
        <div
            data-cy={CY_SUB_DIRECTION_LINE_CHECKBOX}
            className={styles.lineCheckbox}
            onClick={() => dispatch(actions.toggleSubDirectionMark(directionIndex, stepNumber))}
        >
            {( subDirection.isMarked ? <div className={styles.lineCheckboxMark} /> : null )}
        </div>
    );

    const removeButton = (
        <div
            data-cy={CY_SUB_DIRECTION_LINE_REMOVE_BUTTON}
            className={styles.subDirectionLineButton}
            onClick={() => dispatch(actions.removeSubDirection(directionIndex, stepNumber))}
        >
            <IconWrapper isFullWidth={true} width={24} height={24} color={Utils.COLOR_WHITE}>
                <RemoveIcon />
            </IconWrapper>
        </div>
    );

    const ingredientAmountText = (
        <div className={styles.directionInfoLineAmount}>
            {subDirection.ingredientAmount}
        </div>
    );

    const ingredientAmountInput = (
        <input
            type={"text"}
            className={styles.directionInfoLineAmountInput}
            placeholder={"#"}
            value={subDirection.ingredientAmountInput}
            onChange={(event) => {
                dispatch(actions.updateSubDirectionIngredientAmount(directionIndex, stepNumber, event.target.value));
            }}
        />
    );

    return (

        <div
            data-cy={CY_SUB_DIRECTION_LINE}
            className={styles.subDirectionLine}
        >

            {( isReadOnly ? checkbox : removeButton )}

            <div className={styles.subDirectionInfoLine}>

                <div
                    className={styles.directionInfoLineTitle}
                    style={( subDirection.isMarked ? { opacity: 0.25 } : undefined )}
                >

                    <div
                        data-cy={CY_SUB_DIRECTION_LINE_NAME}
                        className={styles.directionInfoLineName}
                    >
                        {subDirection.ingredientName.toUpperCase()}
                    </div>

                </div>

                <div className={styles.directionInfoLineMeasures}>

                    <div className={styles.directionInfoLineMeasure}>

                        {( isReadOnly ? ingredientAmountText : ingredientAmountInput )}

                        <SelectInput
                            type={SelectInputType.AltIngredientUnit}
                            options={Object.values(Units).map((unit) => ({ value: unit }))}
                            value={subDirection.ingredientUnit}
                            onChange={(option: SelectOption<WeightUnit | VolumeUnit>) => {
                                dispatch(actions.updateSubDirectionIngredientUnit(
                                    directionIndex, stepNumber, option.value,
                                ));
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

SubDirectionLine.displayName = "SubDirectionLine";

export default SubDirectionLine;
