import React from "react";
import { useDispatch } from "react-redux";
import * as constants from "@cypress/constants";

import { COLOR_WHITE } from "@common/colors";
import type { VolumeUnit, WeightUnit } from "@common/units";
import { Units } from "@common/units";
import RbaIconWrapper from "@views/shared/rba-icon-wrapper";
import RbaSelect, { SelectHeightSize,SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { SelectOption } from "@views/shared/rba-select/rba-select-option";
import * as actions from "@store/recipe/actions";
import type { RecipeSubDirectionIngredient } from "@store/recipe/types";
import RemoveIcon from "@icons/close-sharp.svg";

import styles from "./rba-directions-block.module.scss";


interface Props {
    isReadOnly: boolean;
    subDirection: RecipeSubDirectionIngredient;
    directionIndex: number;
    stepNumber: number;
}


const RbaSubDirectionLine: React.FC<Props> = ({ isReadOnly, subDirection, directionIndex, stepNumber }) => {

    const dispatch = useDispatch();

    const checkbox = (
        <div
            data-cy={constants.CY_SUB_DIRECTION_LINE_CHECKBOX}
            className={styles.lineCheckbox}
            onClick={() => dispatch(actions.toggleSubDirectionMark(directionIndex, stepNumber))}
        >
            {( subDirection.isMarked ? <div className={styles.lineCheckboxMark} /> : null )}
        </div>
    );

    const removeButton = (
        <div
            data-cy={constants.CY_SUB_DIRECTION_LINE_REMOVE_BUTTON}
            className={styles.subDirectionLineButton}
            onClick={() => dispatch(actions.removeSubDirection(directionIndex, stepNumber))}
        >
            <RbaIconWrapper isFullWidth={true} width={24} height={24} color={COLOR_WHITE}>
                <RemoveIcon />
            </RbaIconWrapper>
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
            data-cy={constants.CY_SUB_DIRECTION_LINE}
            className={styles.subDirectionLine}
        >

            {( isReadOnly ? checkbox : removeButton )}

            <div className={styles.subDirectionInfoLine}>

                <div
                    className={styles.directionInfoLineTitle}
                    style={( subDirection.isMarked ? { opacity: 0.25 } : undefined )}
                >

                    <div
                        data-cy={constants.CY_SUB_DIRECTION_LINE_NAME}
                        className={styles.directionInfoLineName}
                    >
                        {subDirection.ingredientName.toUpperCase()}
                    </div>

                </div>

                <div className={styles.directionInfoLineMeasures}>

                    <div className={styles.directionInfoLineMeasure}>

                        {( isReadOnly ? ingredientAmountText : ingredientAmountInput )}

                        <RbaSelect
                            theme={SelectTheme.Alternative}
                            center={true}
                            width={SelectWidthSize.Medium}
                            height={SelectHeightSize.Medium}
                            options={Object.values(Units).map((unit) => ({ value: unit }))}
                            value={subDirection.ingredientUnit}
                            onChange={(option: SelectOption) => {
                                dispatch(actions.updateSubDirectionIngredientUnit(
                                    directionIndex, stepNumber, option.value as WeightUnit | VolumeUnit,
                                ));
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

RbaSubDirectionLine.displayName = "RbaSubDirectionLine";

export default RbaSubDirectionLine;
