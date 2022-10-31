import React from "react";
import * as constants from "@cypress/constants";

import type { InputChangeCallback } from "@common/typings";
import type { TemperatureUnit, TimeUnit } from "@common/units";
import RbaDirectionLineEdit from "@views/recipe/components/rba-direction-line-edit";
import RbaDirectionLineRead from "@views/recipe/components/rba-direction-line-read";
import RbaDirectionPartComment from "@views/recipe/components/rba-direction-part-comment";
import RbaDirectionPartIngredient from "@views/recipe/components/rba-direction-part-ingredient";
import RbaDirectionPartNew from "@views/recipe/components/rba-direction-part-new";
import type { RbaSelectChangeCallback } from "@views/shared/rba-select";
import { useAppDispatch } from "@store";
import * as actions from "@store/recipe/actions";
import type {
    RecipeDirection,
    RecipeDirectionPartComment,
    RecipeDirectionPartIngredient,
    RecipeIngredient,
} from "@store/recipe/types";
import {
    DirectionPartType,
} from "@store/recipe/types";

import styles from "./rba-direction.module.scss";



interface Props {
    isReadOnly: boolean;
    ingredients: RecipeIngredient[];
    direction: RecipeDirection;
    index: number;
}

const RbaDirection: React.FC<Props> = ({ isReadOnly, ingredients, direction, index }) => {

    const dispatch = useAppDispatch();

    const getDirectionPartElement = (
        directionPart: RecipeDirectionPartComment | RecipeDirectionPartIngredient,
    ): JSX.Element => (
        directionPart.type === DirectionPartType.Ingredient
            ? (
                <RbaDirectionPartIngredient
                    key={`directionPart_${directionPart.id}`}
                    isReadOnly={isReadOnly}
                    directionPart={directionPart as RecipeDirectionPartIngredient}
                    directionIndex={index}
                />
            )
            : (
                <RbaDirectionPartComment
                    key={`directionPart_${directionPart.id}`}
                    isReadOnly={isReadOnly}
                    directionPart={directionPart as RecipeDirectionPartComment}
                    directionIndex={index}
                />
            )
    );

    const getDirectionLine = (): JSX.Element => {
        if (isReadOnly) {

            const toggleDirection = (): void => { dispatch(actions.toggleDirectionOpen(index)); };
            const toggleDirectionMark = (): void => { dispatch(actions.toggleDirectionMark(index)); };

            const updateDirectionTemperatureUnit: RbaSelectChangeCallback = (option) => {
                dispatch(actions.updateDirectionTemperatureUnit({ directionIndex: index, unit: option.value as TemperatureUnit }));
            };
            const updateDirectionTimeUnit: RbaSelectChangeCallback = (option) => {
                dispatch(actions.updateDirectionTimeUnit({ directionIndex: index, unit: option.value as TimeUnit }));
            };

            return (
                <RbaDirectionLineRead
                    direction={direction}
                    onClick={toggleDirection}
                    onClickMark={toggleDirectionMark}
                    updateDirectionTemperatureUnit={updateDirectionTemperatureUnit}
                    updateDirectionTimeUnit={updateDirectionTimeUnit}
                />
            );
        } else {
            const removeDirection = (): void => { dispatch(actions.removeDirection(index)); };

            const updateDirectionStepNumber: InputChangeCallback = (event) => {
                dispatch(actions.updateDirectionStepNumber({ directionIndex: index, stepNumber: Number(event.target.value) }));
            };
            const updateDirectionName: InputChangeCallback = (event) => {
                dispatch(actions.updateDirectionName({ directionIndex: index, name: event.target.value }));
            };
            const updateDirectionTemperatureCount: InputChangeCallback = (event) => {
                dispatch(actions.updateDirectionTemperatureCount({ directionIndex: index, inputValue: event.target.value }));
            };
            const updateDirectionTemperatureUnit: RbaSelectChangeCallback = (option) => {
                dispatch(actions.updateDirectionTemperatureUnit({ directionIndex: index, unit: option.value as TemperatureUnit }));
            };
            const updateDirectionTimeCount: InputChangeCallback = (event) => {
                dispatch(actions.updateDirectionTimeCount({ directionIndex: index, inputValue: event.target.value }));
            };
            const updateDirectionTimeUnit: RbaSelectChangeCallback = (option) => {
                dispatch(actions.updateDirectionTimeUnit({ directionIndex: index, unit: option.value as TimeUnit }));
            };

            return (
                <RbaDirectionLineEdit
                    direction={direction}
                    onButtonClick={removeDirection}
                    updateDirectionStepNumber={updateDirectionStepNumber}
                    updateDirectionName={updateDirectionName}
                    updateDirectionTemperatureCount={updateDirectionTemperatureCount}
                    updateDirectionTemperatureUnit={updateDirectionTemperatureUnit}
                    updateDirectionTimeCount={updateDirectionTimeCount}
                    updateDirectionTimeUnit={updateDirectionTimeUnit}
                />
            );
        }
    };

    return (
        <div
            data-cy={constants.CY_DIRECTION}
            className={styles.direction}
        >
            {getDirectionLine()}

            <div className={styles.directionParts}>

                {( ( direction.isOpen || !isReadOnly ) && direction.steps.map(getDirectionPartElement) )}

                {( !isReadOnly && (
                    <RbaDirectionPartNew
                        key={"directionPart_new"}
                        directionIndex={index}
                        ingredients={ingredients}
                    />
                ) )}
            </div>
        </div>
    );
};

RbaDirection.displayName = "RbaDirection";

export default RbaDirection;
