import React from "react";

import type { TemperatureUnit, TimeUnit } from "@common/units";
import RbaDirection from "@views/recipe/components/rba-direction";
import type { RbaInputChangeCallback } from "@views/shared/rba-input";
import type { RbaSelectChangeCallback } from "@views/shared/rba-select";
import { useAppDispatch } from "@store";
import * as actions from "@store/actions/recipe";
import type {
    RecipeDirection,
    RecipeIngredient,
} from "@store/types/recipe";

import RbaDirectionLineEdit from "../rba-direction-line-edit";


interface Props {
    isReadOnly: boolean;
    newDirection: RecipeDirection;
    directions: RecipeDirection[];
    ingredients: RecipeIngredient[];
}


const RbaDirectionsBlock: React.FC<Props> = ({
    isReadOnly = false, ingredients, directions = [], newDirection,
}) => {

    const dispatch = useAppDispatch();

    const createDirection = (): void => { dispatch(actions.createDirection(newDirection)); };

    const updateDirectionStepNumber: RbaInputChangeCallback = (value) => {
        dispatch(actions.updateNewDirectionStepNumber(Number(value)));
    };
    const updateDirectionName: RbaInputChangeCallback = (value) => {
        dispatch(actions.updateNewDirectionName(value));
    };
    const updateDirectionTemperatureCount: RbaInputChangeCallback = (value) => {
        dispatch(actions.updateNewDirectionTemperatureCount(value));
    };
    const updateDirectionTemperatureUnit: RbaSelectChangeCallback = (option) => {
        dispatch(actions.updateNewDirectionTemperatureUnit(option.value as TemperatureUnit));
    };
    const updateDirectionTimeCount: RbaInputChangeCallback = (value) => {
        dispatch(actions.updateNewDirectionTimeCount(value));
    };
    const updateDirectionTimeUnit: RbaSelectChangeCallback = (option) => {
        dispatch(actions.updateNewDirectionTimeUnit(option.value as TimeUnit));
    };

    return (
        <div>
            {directions.map( (direction, index) => (
                <RbaDirection
                    key={`direction_${index}`}
                    isReadOnly={isReadOnly}
                    ingredients={ingredients}
                    direction={direction}
                    index={index}
                />
            ) )}

            {( !isReadOnly && (
                <RbaDirectionLineEdit
                    key={"direction_new"}
                    isNewDirection={true}
                    direction={newDirection}
                    onButtonClick={createDirection}
                    updateDirectionStepNumber={updateDirectionStepNumber}
                    updateDirectionName={updateDirectionName}
                    updateDirectionTemperatureCount={updateDirectionTemperatureCount}
                    updateDirectionTemperatureUnit={updateDirectionTemperatureUnit}
                    updateDirectionTimeCount={updateDirectionTimeCount}
                    updateDirectionTimeUnit={updateDirectionTimeUnit}
                />
            ) )}

        </div>
    );
};


RbaDirectionsBlock.displayName = "RbaDirectionsBlock";

export default RbaDirectionsBlock;
