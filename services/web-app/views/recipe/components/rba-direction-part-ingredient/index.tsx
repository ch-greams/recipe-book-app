import React from "react";
import { useDispatch } from "react-redux";
import * as constants from "@cypress/constants";

import { Color } from "@common/colors";
import type { InputChangeCallback } from "@common/typings";
import { Unit } from "@common/units";
import Utils from "@common/utils";
import RbaIconWrapper from "@views/shared/rba-icon-wrapper";
import type { RbaSelectChangeCallback } from "@views/shared/rba-select";
import RbaSelect, { SelectHeightSize,SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { SelectOption } from "@views/shared/rba-select/rba-select-option";
import * as actions from "@store/recipe/actions";
import type { RecipeDirectionPartIngredient } from "@store/recipe/types";
import RemoveIcon from "@icons/close-sharp.svg";

import styles from "./rba-direction-part-ingredient.module.scss";


interface Props {
    isReadOnly: boolean;
    directionPart: RecipeDirectionPartIngredient;
    directionIndex: number;
}


const RbaDirectionPartIngredient: React.FC<Props> = ({ isReadOnly, directionPart, directionIndex }) => {

    const dispatch = useDispatch();

    const toggleDirectionPartMark = (): void => {
        dispatch(actions.toggleDirectionPartMark(directionIndex, directionPart.stepNumber));
    };
    const removeDirectionPart = (): void => {
        dispatch(actions.removeDirectionPart(directionIndex, directionPart.stepNumber));
    };

    const updateDirectionPartStepNumber: InputChangeCallback = (event) => {
        dispatch(actions.updateDirectionPartStepNumber(directionIndex, directionPart.stepNumber, Number(event.target.value)));
    };
    const updateDirectionPartIngredientAmount: InputChangeCallback = (event) => {
        dispatch(actions.updateDirectionPartIngredientAmount(directionIndex, directionPart.stepNumber, event.target.value));
    };
    const updateDirectionPartIngredientUnit: RbaSelectChangeCallback = (option: SelectOption) => {
        dispatch(actions.updateDirectionPartIngredientUnit(
            directionIndex, directionPart.stepNumber, option.value as Unit,
        ));
    };


    const getButton = (): JSX.Element => {
        if (isReadOnly) {
            const checkbox = (
                <div
                    data-cy={constants.CY_DIRECTION_PART_CHECKBOX}
                    className={styles.directionPartCheckbox}
                    onClick={toggleDirectionPartMark}
                >
                    {( directionPart.isMarked ? <div className={styles.directionPartCheckboxMark} /> : null )}
                </div>
            );

            return checkbox;
        }
        else {
            const removeButton = (
                <div
                    data-cy={constants.CY_DIRECTION_PART_REMOVE_BUTTON}
                    className={styles.directionPartButton}
                    onClick={removeDirectionPart}
                >
                    <RbaIconWrapper isFullWidth={true} width={24} height={24} color={Color.White}>
                        <RemoveIcon />
                    </RbaIconWrapper>
                </div>
            );

            return removeButton;
        }
    };

    const getIngredientAmount = (): JSX.Element => {
        if (isReadOnly) {
            const ingredientAmountText = (
                <div className={styles.directionPartAmountText}>
                    {directionPart.ingredientAmount}
                </div>
            );

            return ingredientAmountText;
        }
        else {
            const ingredientAmountInput = (
                <input
                    type={"text"}
                    className={styles.directionPartAmountInput}
                    placeholder={"#"}
                    value={directionPart.ingredientAmountInput}
                    onChange={updateDirectionPartIngredientAmount}
                />
            );

            return ingredientAmountInput;
        }
    };

    const stepNumberInput = (
        <input
            data-cy={constants.CY_DIRECTION_LINE_STEP_INPUT}
            type={"text"}
            className={styles.directionInfoIndexInput}
            value={directionPart.stepNumber}
            placeholder={"#"}
            maxLength={2}
            onChange={updateDirectionPartStepNumber}
        />
    );

    return (

        <div
            data-cy={constants.CY_DIRECTION_PART}
            className={styles.directionPart}
        >

            {getButton()}

            <div className={styles.directionPartInfo}>

                {( !isReadOnly && stepNumberInput )}

                <div
                    data-cy={constants.CY_DIRECTION_PART_NAME}
                    className={Utils.classNames({ [styles.directionPartName]: true, [styles.isMarked]: directionPart.isMarked })}
                >
                    {directionPart.ingredientName.toUpperCase()}
                </div>

                <div>

                    <div className={styles.directionPartMeasure}>

                        {getIngredientAmount()}

                        <RbaSelect
                            theme={SelectTheme.Alternative}
                            center={true}
                            width={SelectWidthSize.Medium}
                            height={SelectHeightSize.Medium}
                            options={Object.values(Unit).map((unit) => ({ value: unit }))}
                            value={directionPart.ingredientUnit}
                            onChange={updateDirectionPartIngredientUnit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

RbaDirectionPartIngredient.displayName = "RbaDirectionPartIngredient";

export default RbaDirectionPartIngredient;
