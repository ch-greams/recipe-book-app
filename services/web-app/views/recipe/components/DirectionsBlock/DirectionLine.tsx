import React from "react";
import { useDispatch } from "react-redux";
import { CY_DIRECTION_LINE, CY_DIRECTION_LINE_CHECKBOX, CY_DIRECTION_LINE_REMOVE_BUTTON } from "cypress/constants";

import Utils from "@common/utils";
import * as actions from "@store/recipe/actions";
import type {
    RecipeDirection,
    RecipeIngredient,
    RecipeSubDirectionComment,
    RecipeSubDirectionIngredient,
} from "@store/recipe/types";
import {
    SubDirectionType,
} from "@store/recipe/types";
import RemoveIcon from "@icons/close-sharp.svg";
import IconWrapper from "@icons/IconWrapper";

import DirectionInfoLine from "./DirectionInfoLine";
import NewSubDirectionLine from "./NewSubDirectionLine";
import SubDirectionLine from "./SubDirectionLine";
import SubDirectionNoteLine from "./SubDirectionNoteLine";

import styles from "./DirectionsBlock.module.scss";



interface Props {
    isReadOnly: boolean;
    ingredients: RecipeIngredient[];
    direction: RecipeDirection;
    index: number;
}

const DirectionLine: React.FC<Props> = ({ isReadOnly, ingredients, direction, index }) => {

    const dispatch = useDispatch();

    const removeDirection = (directionIndex: number): void => {
        dispatch(actions.removeDirection(directionIndex));
    };

    const toggleDirectionMark = (directionIndex: number): void => {
        dispatch(actions.toggleDirectionMark(directionIndex));
    };

    const checkbox = (
        <div
            data-cy={CY_DIRECTION_LINE_CHECKBOX}
            className={styles.lineCheckbox}
            onClick={() => toggleDirectionMark(index)}
        >
            {( direction.isMarked ? <div className={styles.lineCheckboxMark} /> : null )}
        </div>
    );

    const removeButton = (
        <div
            data-cy={CY_DIRECTION_LINE_REMOVE_BUTTON}
            className={styles.directionLineButton}
            onClick={() => removeDirection(index)}
        >
            <IconWrapper isFullWidth={true} width={24} height={24} color={Utils.COLOR_DEFAULT}>
                <RemoveIcon />
            </IconWrapper>
        </div>
    );

    return (
        <div
            data-cy={CY_DIRECTION_LINE}
            className={styles.directionLine}
        >

            {( isReadOnly ? checkbox : removeButton )}

            <div className={styles.directionInfoLines}>

                <DirectionInfoLine
                    isReadOnly={isReadOnly}
                    index={index}
                    direction={direction}
                />

                {(
                    ( direction.isOpen || !isReadOnly ) &&
                    direction.steps.map((step) => (
                        step.type === SubDirectionType.Ingredient
                            ? (
                                <SubDirectionLine
                                    key={`subDirectionLine_${step.stepNumber}`}
                                    isReadOnly={isReadOnly}
                                    subDirection={step as RecipeSubDirectionIngredient}
                                    directionIndex={index}
                                    stepNumber={step.stepNumber}
                                />
                            )
                            : (
                                <SubDirectionNoteLine
                                    key={`subDirectionNoteLine_${step.stepNumber}`}
                                    isReadOnly={isReadOnly}
                                    step={step as RecipeSubDirectionComment}
                                    directionIndex={index}
                                    stepNumber={step.stepNumber}
                                />
                            )
                    ))
                )}

                {( !isReadOnly && (
                    <NewSubDirectionLine
                        key={"subDirectionLine_new"}
                        directionIndex={index}
                        ingredients={ingredients}
                    />
                ) )}

            </div>
        </div>
    );
};

DirectionLine.displayName = "DirectionLine";

export default DirectionLine;
