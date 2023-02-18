import React from "react";
import * as constants from "@cypress/constants";

import type { TemperatureUnit, TimeUnit } from "@common/units";
import RbaInstructionIngredient from "@views/recipe/components/rba-instruction-ingredient";
import RbaInstructionIngredientNew from "@views/recipe/components/rba-instruction-ingredient-new";
import RbaInstructionLineEdit from "@views/recipe/components/rba-instruction-line-edit";
import RbaInstructionLineRead from "@views/recipe/components/rba-instruction-line-read";
import { useAppDispatch } from "@store";
import * as actions from "@store/actions/recipe";
import type { RecipeIngredient, RecipeInstruction } from "@store/types/recipe";

import styles from "./rba-instruction.module.scss";



interface Props {
    isReadOnly: boolean;
    ingredients: RecipeIngredient[];
    instruction: RecipeInstruction;
    index: number;
}

const RbaInstruction: React.FC<Props> = ({ isReadOnly, ingredients, instruction, index }) => {

    const dispatch = useAppDispatch();

    const getInstructionLine = (): JSX.Element => {
        if (isReadOnly) {

            return (
                <RbaInstructionLineRead
                    instruction={instruction}
                    onClick={() => {
                        dispatch(actions.toggleInstructionOpen(index));
                    }}
                    onClickMark={() => {
                        dispatch(actions.toggleInstructionMark(index));
                    }}
                    updateInstructionTemperatureUnit={(option) => {
                        dispatch(actions.updateInstructionTemperatureUnit({
                            instructionIndex: index,
                            unit: option.value as TemperatureUnit,
                        }));
                    }}
                    updateInstructionTimeUnit={(option) => {
                        dispatch(actions.updateInstructionTimeUnit({
                            instructionIndex: index,
                            unit: option.value as TimeUnit,
                        }));
                    }}
                />
            );
        } else {

            return (
                <RbaInstructionLineEdit
                    instruction={instruction}
                    onButtonClick={() => {
                        dispatch(actions.removeInstruction(index));
                    }}
                    updateInstructionStepNumber={(value) => {
                        dispatch(actions.updateInstructionStepNumber({
                            instructionIndex: index,
                            stepNumber: Number(value),
                        }));
                    }}
                    updateInstructionDescription={(value) => {
                        dispatch(actions.updateInstructionDescription({
                            instructionIndex: index,
                            name: value,
                        }));
                    }}
                    updateInstructionTemperatureCount={(value) => {
                        dispatch(actions.updateInstructionTemperatureCount({
                            instructionIndex: index,
                            inputValue: value,
                        }));
                    }}
                    updateInstructionTemperatureUnit={(option) => {
                        dispatch(actions.updateInstructionTemperatureUnit({
                            instructionIndex: index,
                            unit: option.value as TemperatureUnit,
                        }));
                    }}
                    updateInstructionTimeCount={(value) => {
                        dispatch(actions.updateInstructionTimeCount({
                            instructionIndex: index,
                            inputValue: value,
                        }));
                    }}
                    updateInstructionTimeUnit={(option) => {
                        dispatch(actions.updateInstructionTimeUnit({
                            instructionIndex: index,
                            unit: option.value as TimeUnit,
                        }));
                    }}
                />
            );
        }
    };

    return (
        <div data-cy={constants.CY_INSTRUCTION} className={styles.instruction}>

            {getInstructionLine()}

            <div className={styles.instructionIngredients}>

                {( ( instruction.isOpen || !isReadOnly ) && instruction.ingredients.map((instructionIngredient) => (
                    <RbaInstructionIngredient
                        key={`instructionIngredient_${instructionIngredient.ingredientSlotNumber}`}
                        isReadOnly={isReadOnly}
                        instructionIngredient={instructionIngredient}
                        instructionIndex={index}
                    />
                )) )}

                {( !isReadOnly && (
                    <RbaInstructionIngredientNew
                        key={"instructionIngredient_new"}
                        instructionIndex={index}
                        ingredients={ingredients}
                    />
                ) )}
            </div>
        </div>
    );
};

RbaInstruction.displayName = "RbaInstruction";

export default RbaInstruction;
