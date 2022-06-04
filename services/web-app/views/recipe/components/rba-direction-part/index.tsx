import React from "react";
import { useDispatch } from "react-redux";
import * as constants from "@cypress/constants";

import { Color } from "@common/colors";
import type { VolumeUnit, WeightUnit } from "@common/units";
import { Units } from "@common/units";
import RbaIconWrapper from "@views/shared/rba-icon-wrapper";
import RbaSelect, { SelectHeightSize,SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { SelectOption } from "@views/shared/rba-select/rba-select-option";
import * as actions from "@store/recipe/actions";
import type { RecipeSubDirectionIngredient } from "@store/recipe/types";
import RemoveIcon from "@icons/close-sharp.svg";

import styles from "./rba-direction-part.module.scss";


interface Props {
    isReadOnly: boolean;
    directionPart: RecipeSubDirectionIngredient;
    directionIndex: number;
    stepNumber: number;
}


const RbaDirectionPart: React.FC<Props> = ({ isReadOnly, directionPart, directionIndex, stepNumber }) => {

    const dispatch = useDispatch();

    const checkbox = (
        <div
            data-cy={constants.CY_DIRECTION_PART_CHECKBOX}
            className={styles.directionPartCheckbox}
            onClick={() => dispatch(actions.toggleSubDirectionMark(directionIndex, stepNumber))}
        >
            {( directionPart.isMarked ? <div className={styles.directionPartCheckboxMark} /> : null )}
        </div>
    );

    const removeButton = (
        <div
            data-cy={constants.CY_DIRECTION_PART_REMOVE_BUTTON}
            className={styles.directionPartButton}
            onClick={() => dispatch(actions.removeSubDirection(directionIndex, stepNumber))}
        >
            <RbaIconWrapper isFullWidth={true} width={24} height={24} color={Color.White}>
                <RemoveIcon />
            </RbaIconWrapper>
        </div>
    );

    const ingredientAmountText = (
        <div className={styles.directionPartAmountText}>
            {directionPart.ingredientAmount}
        </div>
    );

    const ingredientAmountInput = (
        <input
            type={"text"}
            className={styles.directionPartAmountInput}
            placeholder={"#"}
            value={directionPart.ingredientAmountInput}
            onChange={(event) => {
                dispatch(actions.updateSubDirectionIngredientAmount(directionIndex, stepNumber, event.target.value));
            }}
        />
    );

    return (

        <div
            data-cy={constants.CY_DIRECTION_PART}
            className={styles.directionPart}
        >

            {( isReadOnly ? checkbox : removeButton )}

            <div className={styles.directionPartInfo}>

                <div style={( directionPart.isMarked ? { opacity: 0.25 } : undefined )}>

                    <div
                        data-cy={constants.CY_DIRECTION_PART_NAME}
                        className={styles.directionPartName}
                    >
                        {directionPart.ingredientName.toUpperCase()}
                    </div>

                </div>

                <div>

                    <div className={styles.directionPartMeasure}>

                        {( isReadOnly ? ingredientAmountText : ingredientAmountInput )}

                        <RbaSelect
                            theme={SelectTheme.Alternative}
                            center={true}
                            width={SelectWidthSize.Medium}
                            height={SelectHeightSize.Medium}
                            options={Object.values(Units).map((unit) => ({ value: unit }))}
                            value={directionPart.ingredientUnit}
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

RbaDirectionPart.displayName = "RbaDirectionPart";

export default RbaDirectionPart;
