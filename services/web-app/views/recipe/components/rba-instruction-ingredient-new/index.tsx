import React, { useState } from "react";
import * as constants from "@cypress/constants";

import { Color } from "@common/style";
import { isSome } from "@common/types";
import { getOptionLabel, SelectHeightSize, SelectWidthSize } from "@views/shared/rba-select";
import RbaSelect, { SelectTheme } from "@views/shared/rba-select";
import type { SelectOption } from "@views/shared/rba-select/rba-select-option";
import { useAppDispatch } from "@store";
import * as actions from "@store/actions/recipe";
import type { RecipeIngredient } from "@store/types/recipe";
import { IconSize } from "@icons/icon-params";
import RbaIconAdd from "@icons/rba-icon-add";

import styles from "./rba-instruction-ingredient-new.module.scss";



interface Props {
    instructionIndex: number;
    ingredients: RecipeIngredient[];
}

const RbaInstructionIngredientNew: React.FC<Props> = ({ instructionIndex, ingredients }) => {

    const dispatch = useAppDispatch();

    const [ curInstructionIngredient, setInstructionIngredient ] = useState<SelectOption>();

    const createInstructionIngredient = (): void => {
        if (isSome(curInstructionIngredient)) {
            dispatch(actions.createInstructionIngredient({
                instructionIndex,
                ingredientSlotNumber: Number(curInstructionIngredient.value),
            }));
        }
    };

    return (

        <div data-cy={constants.CY_INSTRUCTION_INGREDIENT_NEW} className={styles.instructionIngredient}>

            <div
                data-cy={constants.CY_INSTRUCTION_INGREDIENT_NEW_CREATE_BUTTON}
                className={styles.instructionIngredientButton}
                onClick={createInstructionIngredient}
            >
                <RbaIconAdd size={IconSize.Medium} color={Color.White} />
            </div>

            <div className={styles.instructionIngredientInfo}>

                <RbaSelect
                    data-cy={constants.CY_SELECT_INPUT}
                    theme={SelectTheme.Alternative}
                    width={SelectWidthSize.Full}
                    height={SelectHeightSize.Medium}
                    options={ingredients.map((ingredient) => ({
                        label: ingredient.name,
                        value: String(ingredient.slot_number),
                    }))}
                    value={( isSome(curInstructionIngredient) ? getOptionLabel(curInstructionIngredient) : "" )}
                    onChange={setInstructionIngredient}
                />

            </div>
        </div>
    );
};

RbaInstructionIngredientNew.displayName = "RbaInstructionIngredientNew";

export default RbaInstructionIngredientNew;
