import React from "react";
import { useDispatch } from "react-redux";
import * as constants from "@cypress/constants";

import { Color } from "@common/colors";
import RbaIconWrapper from "@views/shared/rba-icon-wrapper";
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

import RbaDirectionInfoLine from "./rba-direction-info-line";
import RbaNewSubDirectionLine from "./rba-new-sub-direction-line";
import RbaSubDirectionLine from "./rba-sub-direction-line";
import RbaSubDirectionNoteLine from "./rba-sub-direction-note-line";

import styles from "./rba-directions-block.module.scss";



interface Props {
    isReadOnly: boolean;
    ingredients: RecipeIngredient[];
    direction: RecipeDirection;
    index: number;
}

const RbaDirectionLine: React.FC<Props> = ({ isReadOnly, ingredients, direction, index }) => {

    const dispatch = useDispatch();

    const removeDirection = (directionIndex: number): void => {
        dispatch(actions.removeDirection(directionIndex));
    };

    const toggleDirectionMark = (directionIndex: number): void => {
        dispatch(actions.toggleDirectionMark(directionIndex));
    };

    const checkbox = (
        <div
            data-cy={constants.CY_DIRECTION_LINE_CHECKBOX}
            className={styles.lineCheckbox}
            onClick={() => toggleDirectionMark(index)}
        >
            {( direction.isMarked ? <div className={styles.lineCheckboxMark} /> : null )}
        </div>
    );

    const removeButton = (
        <div
            data-cy={constants.CY_DIRECTION_LINE_REMOVE_BUTTON}
            className={styles.directionLineButton}
            onClick={() => removeDirection(index)}
        >
            <RbaIconWrapper isFullWidth={true} width={24} height={24} color={Color.Default}>
                <RemoveIcon />
            </RbaIconWrapper>
        </div>
    );

    return (
        <div
            data-cy={constants.CY_DIRECTION_LINE}
            className={styles.directionLine}
        >

            {( isReadOnly ? checkbox : removeButton )}

            <div className={styles.directionInfoLines}>

                <RbaDirectionInfoLine
                    isReadOnly={isReadOnly}
                    index={index}
                    direction={direction}
                />

                {(
                    ( direction.isOpen || !isReadOnly ) &&
                    direction.steps.map((step) => (
                        step.type === SubDirectionType.Ingredient
                            ? (
                                <RbaSubDirectionLine
                                    key={`subDirectionLine_${step.stepNumber}`}
                                    isReadOnly={isReadOnly}
                                    subDirection={step as RecipeSubDirectionIngredient}
                                    directionIndex={index}
                                    stepNumber={step.stepNumber}
                                />
                            )
                            : (
                                <RbaSubDirectionNoteLine
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
                    <RbaNewSubDirectionLine
                        key={"subDirectionLine_new"}
                        directionIndex={index}
                        ingredients={ingredients}
                    />
                ) )}

            </div>
        </div>
    );
};

RbaDirectionLine.displayName = "RbaDirectionLine";

export default RbaDirectionLine;
