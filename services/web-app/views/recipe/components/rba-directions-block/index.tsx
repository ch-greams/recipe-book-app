import React from "react";
import { useDispatch } from "react-redux";

import type { InputChangeCallback } from "@common/typings";
import type { TemperatureUnit, TimeUnit } from "@common/units";
import RbaDirection from "@views/recipe/components/rba-direction";
import type { RbaSelectChangeCallback } from "@views/shared/rba-select";
import * as actions from "@store/recipe/actions";
import type {
    RecipeDirection,
    RecipeIngredient,
} from "@store/recipe/types";

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

    const dispatch = useDispatch();

    const createDirection = (): void => { dispatch(actions.createDirection(newDirection)); };

    const updateDirectionStepNumber: InputChangeCallback = (event) => {
        dispatch(actions.updateNewDirectionStepNumber(Number(event.target.value)));
    };
    const updateDirectionName: InputChangeCallback = (event) => {
        dispatch(actions.updateNewDirectionName(event.target.value));
    };
    const updateDirectionTemperatureCount: InputChangeCallback = (event) => {
        dispatch(actions.updateNewDirectionTemperatureCount(event.target.value));
    };
    const updateDirectionTemperatureUnit: RbaSelectChangeCallback = (option) => {
        dispatch(actions.updateNewDirectionTemperatureUnit(option.value as TemperatureUnit));
    };
    const updateDirectionTimeCount: InputChangeCallback = (event) => {
        dispatch(actions.updateNewDirectionTimeCount(event.target.value));
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
