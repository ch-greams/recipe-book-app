import React, { useState } from "react";

import type { TimeUnit } from "@common/units";
import {
    convertFahrenheitToCelsius, convertToSeconds, DEFAULT_TEMPERATURE_UNIT, DEFAULT_TIME_UNIT, TemperatureUnit,
} from "@common/units";
import RbaInstruction from "@views/recipe/components/rba-instruction";
import { useAppDispatch } from "@store";
import * as actions from "@store/actions/recipe";
import type { RecipeIngredient, RecipeInstruction } from "@store/types/recipe";

import RbaInstructionLineEdit from "../rba-instruction-line-edit";


interface Props {
    isReadOnly: boolean;
    instructions: RecipeInstruction[];
    ingredients: RecipeIngredient[];
}



const DEFAULT_INSTRUCTION: RecipeInstruction = {
    id: -1,

    isOpen: false,
    isMarked: false,

    stepNumber: 0,
    description: "",

    durationValue: 0,
    durationUnit: DEFAULT_TIME_UNIT,

    temperatureValue: 0,
    temperatureUnit: DEFAULT_TEMPERATURE_UNIT,

    durationValueInput: "",
    temperatureValueInput: "",

    ingredients: [],
};

const RbaInstructionsBlock: React.FC<Props> = ({ isReadOnly = false, ingredients, instructions = [] }) => {

    const dispatch = useAppDispatch();

    const [ newInstruction, setNewInstruction ] = useState<RecipeInstruction>(DEFAULT_INSTRUCTION);

    return (
        <div>
            {instructions.map( (instruction, index) => (
                <RbaInstruction
                    key={`instruction_${index}`}
                    isReadOnly={isReadOnly}
                    ingredients={ingredients}
                    instruction={instruction}
                    index={index}
                />
            ) )}

            {( !isReadOnly && (
                <RbaInstructionLineEdit
                    key={"instruction_new"}
                    isNew={true}
                    instruction={newInstruction}
                    onButtonClick={() => {
                        dispatch(actions.createInstruction(newInstruction));
                        setNewInstruction(DEFAULT_INSTRUCTION);
                    }}
                    updateInstructionStepNumber={(value) => {
                        setNewInstruction({ ...newInstruction, stepNumber: Number(value) });
                    }}
                    updateInstructionDescription={(description) => {
                        setNewInstruction({ ...newInstruction, description });
                    }}
                    updateInstructionTemperatureCount={(temperatureValueInput) => {
                        setNewInstruction({
                            ...newInstruction,
                            temperatureValueInput,
                            temperatureValue: (
                                newInstruction.temperatureUnit === TemperatureUnit.F
                                    ? convertFahrenheitToCelsius(Number(temperatureValueInput))
                                    : Number(temperatureValueInput)
                            ),
                        });
                    }}
                    updateInstructionTemperatureUnit={(option) => {
                        const temperatureUnit = option.value as TemperatureUnit;

                        setNewInstruction({
                            ...newInstruction,
                            temperatureValue: (
                                temperatureUnit === TemperatureUnit.F
                                    ? convertFahrenheitToCelsius(Number(newInstruction.temperatureValueInput))
                                    : Number(newInstruction.temperatureValueInput)
                            ),
                            temperatureUnit,
                        });
                    }}
                    updateInstructionTimeCount={(durationValueInput) => {
                        setNewInstruction({
                            ...newInstruction,
                            durationValueInput: durationValueInput,
                            durationValue: convertToSeconds(Number(durationValueInput), newInstruction.durationUnit),
                        });
                    }}
                    updateInstructionTimeUnit={(option) => {
                        const durationUnit = option.value as TimeUnit;

                        setNewInstruction({
                            ...newInstruction,
                            durationValue: convertToSeconds(Number(newInstruction.durationValueInput), durationUnit),
                            durationUnit: durationUnit,
                        });
                    }}
                />
            ) )}

        </div>
    );
};


RbaInstructionsBlock.displayName = "RbaInstructionsBlock";

export default RbaInstructionsBlock;
