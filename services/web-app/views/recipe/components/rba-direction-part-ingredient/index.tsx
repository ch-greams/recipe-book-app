import React from "react";
import * as constants from "@cypress/constants";

import { classNames, Color } from "@common/style";
import { Unit } from "@common/units";
import type { RbaInputChangeCallback } from "@views/shared/rba-input";
import { InputNormalizer } from "@views/shared/rba-input";
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

    const updateDirectionPartStepNumber: RbaInputChangeCallback = (value) => {
        dispatch(actions.updateDirectionPartStepNumber({
            directionIndex,
            directionPartId: directionPart.id,
            stepNumber: Number(value),
        }));
    };
    const updateDirectionPartIngredientAmount: RbaInputChangeCallback = (value) => {
        dispatch(actions.updateDirectionPartIngredientAmount({
            directionIndex,
            directionPartId: directionPart.id,
            inputValue: value,
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
                            normalizer={InputNormalizer.Decimal}
                            onChange={updateDirectionPartIngredientAmount}
                        />

                        <RbaSelect
                            data-cy={constants.CY_SELECT_INPUT}
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
