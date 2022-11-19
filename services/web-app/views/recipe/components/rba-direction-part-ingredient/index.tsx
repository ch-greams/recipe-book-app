import React from "react";
import * as constants from "@cypress/constants";

import { classNames, Color } from "@common/style";
import type { InputChangeCallback } from "@common/typings";
import { Unit } from "@common/units";
import RbaInput, { InputHeightSize,InputTextAlign, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import type { RbaSelectChangeCallback } from "@views/shared/rba-select";
import RbaSelect, { SelectHeightSize,SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { SelectOption } from "@views/shared/rba-select/rba-select-option";
import { useAppDispatch } from "@store";
import * as actions from "@store/actions/recipe";
import type { RecipeDirectionPartIngredient } from "@store/types/recipe";
import { IconSize } from "@icons/icon-params";
import RbaIconRemove from "@icons/rba-icon-remove";

import styles from "./rba-direction-part-ingredient.module.scss";


interface Props {
    isReadOnly: boolean;
    directionPart: RecipeDirectionPartIngredient;
    directionIndex: number;
}


const RbaDirectionPartIngredient: React.FC<Props> = ({ isReadOnly, directionPart, directionIndex }) => {

    const dispatch = useAppDispatch();

    const toggleDirectionPartMark = (): void => {
        dispatch(actions.toggleDirectionPartMark({ directionIndex, directionPartId: directionPart.id }));
    };
    const removeDirectionPart = (): void => {
        dispatch(actions.removeDirectionPart({ directionIndex, directionPartId: directionPart.id }));
    };

    const updateDirectionPartStepNumber: InputChangeCallback = (event) => {
        dispatch(actions.updateDirectionPartStepNumber({
            directionIndex,
            directionPartId: directionPart.id,
            stepNumber: Number(event.target.value),
        }));
    };
    const updateDirectionPartIngredientAmount: InputChangeCallback = (event) => {
        dispatch(actions.updateDirectionPartIngredientAmount({
            directionIndex,
            directionPartId: directionPart.id,
            inputValue: event.target.value,
        }));
    };
    const updateDirectionPartIngredientUnit: RbaSelectChangeCallback = (option: SelectOption) => {
        dispatch(actions.updateDirectionPartIngredientUnit({
            directionIndex,
            directionPartId: directionPart.id,
            unit: option.value as Unit,
        }));
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
                    <RbaIconRemove size={IconSize.Medium} color={Color.White} />
                </div>
            );

            return removeButton;
        }
    };

    const stepNumberInput = (
        <RbaInput
            data-cy={constants.CY_DIRECTION_LINE_STEP_INPUT}
            disabled={isReadOnly}
            maxLength={2}
            align={InputTextAlign.Center}
            theme={InputTheme.Alternative}
            width={InputWidthSize.Small}
            height={InputHeightSize.Medium}
            placeholder={"#"}
            value={String(directionPart.stepNumber)}
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
                    className={classNames({ [styles.directionPartName]: true, [styles.isMarked]: directionPart.isMarked })}
                >
                    {directionPart.ingredientName}
                </div>

                <div>

                    <div className={styles.directionPartMeasure}>

                        <RbaInput
                            disabled={isReadOnly}
                            align={InputTextAlign.Right}
                            theme={InputTheme.Alternative}
                            width={InputWidthSize.Medium}
                            height={InputHeightSize.Medium}
                            placeholder={"#"}
                            value={directionPart.ingredientAmountInput}
                            onChange={updateDirectionPartIngredientAmount}
                        />

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
