import React from "react";
import * as constants from "@cypress/constants";

import { Color } from "@common/style";
import { Unit } from "@common/units";
import type { RbaInputChangeCallback } from "@views/shared/rba-input";
import { InputNormalizer } from "@views/shared/rba-input";
import RbaInput, { InputHeightSize,InputTextAlign, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import type { RbaSelectChangeCallback } from "@views/shared/rba-select";
import RbaSelect, { SelectHeightSize,SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { SelectOption } from "@views/shared/rba-select/rba-select-option";
import { useAppDispatch } from "@store";
import * as actions from "@store/actions/recipe";
import type { RecipeInstructionIngredient } from "@store/types/recipe";
import { IconSize } from "@icons/icon-params";
import RbaIconRemove from "@icons/rba-icon-remove";

import styles from "./rba-instruction-ingredient.module.scss";


interface Props {
    isReadOnly: boolean;
    instructionIngredient: RecipeInstructionIngredient;
    instructionIndex: number;
}


const RbaInstructionIngredient: React.FC<Props> = ({ isReadOnly, instructionIngredient, instructionIndex }) => {

    const dispatch = useAppDispatch();

    const removeInstructionIngredient = (): void => {
        dispatch(actions.removeInstructionIngredient({
            instructionIndex,
            ingredientSlotNumber: instructionIngredient.ingredientSlotNumber,
        }));
    };

    const updateInstructionIngredientAmount: RbaInputChangeCallback = (value) => {
        dispatch(actions.updateInstructionIngredientAmount({
            instructionIndex,
            ingredientSlotNumber: instructionIngredient.ingredientSlotNumber,
            inputValue: value,
        }));
    };
    const updateInstructionIngredientUnit: RbaSelectChangeCallback = (option: SelectOption) => {
        dispatch(actions.updateInstructionIngredientUnit({
            instructionIndex,
            ingredientSlotNumber: instructionIngredient.ingredientSlotNumber,
            unit: option.value as Unit,
        }));
    };


    return (

        <div
            data-cy={constants.CY_INSTRUCTION_INGREDIENT}
            className={styles.instructionIngredient}
        >

            {(!isReadOnly && (
                <div
                    data-cy={constants.CY_INSTRUCTION_INGREDIENT_REMOVE_BUTTON}
                    className={styles.instructionIngredientButton}
                    onClick={removeInstructionIngredient}
                >
                    <RbaIconRemove size={IconSize.Medium} color={Color.White} />
                </div>
            ))}

            <div className={styles.instructionIngredientInfo}>

                <div
                    data-cy={constants.CY_INSTRUCTION_INGREDIENT_NAME}
                    className={styles.instructionIngredientName}
                >
                    {instructionIngredient.ingredientName}
                </div>

                <div>

                    <div className={styles.instructionIngredientMeasure}>

                        <RbaInput
                            disabled={isReadOnly}
                            align={InputTextAlign.Right}
                            theme={InputTheme.Alternative}
                            width={InputWidthSize.Medium}
                            height={InputHeightSize.Medium}
                            placeholder={"#"}
                            value={instructionIngredient.ingredientAmountInput}
                            normalizer={InputNormalizer.Decimal}
                            onChange={updateInstructionIngredientAmount}
                        />

                        <RbaSelect
                            data-cy={constants.CY_SELECT_INPUT}
                            theme={SelectTheme.Alternative}
                            center={true}
                            width={SelectWidthSize.Medium}
                            height={SelectHeightSize.Medium}
                            options={Object.values(Unit).map((unit) => ({ value: unit }))}
                            value={instructionIngredient.ingredientUnit}
                            onChange={updateInstructionIngredientUnit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

RbaInstructionIngredient.displayName = "RbaInstructionIngredient";

export default RbaInstructionIngredient;
