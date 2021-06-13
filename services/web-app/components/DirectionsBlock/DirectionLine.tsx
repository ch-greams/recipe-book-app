import React from "react";
import { useDispatch } from "react-redux";

import type { Dictionary, IngredientItem } from "@common/typings";
import RemoveIcon from "@client/icons/close-sharp.svg";
import IconWrapper from "@client/icons/IconWrapper";
import * as actions from "@client/store/recipe/actions";
import {
    RecipeDirection,
    RecipeIngredientDefault,
    RecipeSubDirectionIngredient,
    SubDirectionType,
} from "@client/store/recipe/types";

import DirectionInfoLine from "./DirectionInfoLine";
import NewSubDirectionLine from "./NewSubDirectionLine";
import SubDirectionLine from "./SubDirectionLine";
import SubDirectionNoteLine from "./SubDirectionNoteLine";

import styles from "./DirectionsBlock.module.scss";



interface Props {
    isReadOnly: boolean;
    ingredients: RecipeIngredientDefault[];
    references: Dictionary<string, IngredientItem>;
    direction: RecipeDirection;
    index: number;
}

const DirectionLine: React.FC<Props> = ({ isReadOnly, ingredients, references, direction, index }) => {

    const dispatch = useDispatch();

    const removeDirection = (directionIndex: number): void => {

        dispatch(actions.removeDirection(directionIndex));
    };

    const toggleDirectionMark = (directionIndex: number): void => {

        dispatch(actions.toggleDirectionMark(directionIndex));
    };

    const checkbox = (
        <div
            className={styles.lineCheckbox}
            onClick={() => toggleDirectionMark(index)}
        >
            {( direction.isMarked ? <div className={styles.lineCheckboxMark} /> : null )}                
        </div>
    );

    const removeButton = (
        <div
            className={styles.directionLineButton}
            onClick={() => removeDirection(index)}
        >
            <IconWrapper isFullWidth={true} width={24} height={24} color={"#00bfa5"}>
                <RemoveIcon />
            </IconWrapper>
        </div>
    );

    return (
        <div className={styles.directionLine}>

            {( isReadOnly ? checkbox : removeButton )}

            <div className={styles.directionInfoLines}>

                <DirectionInfoLine
                    isReadOnly={isReadOnly}
                    index={index}
                    direction={direction}
                />

                {(
                    ( direction.isOpen || !isReadOnly ) &&
                    direction.steps.map((step, stepIndex) => (
                        step.type === SubDirectionType.Ingredient
                            ? (
                                <SubDirectionLine
                                    key={`subDirectionLine_${stepIndex}`}
                                    isReadOnly={isReadOnly}
                                    subDirection={step as RecipeSubDirectionIngredient}
                                    directionIndex={index}
                                    subDirectionIndex={stepIndex}
                                />
                            )
                            : (
                                <SubDirectionNoteLine
                                    key={`subDirectionNoteLine_${stepIndex}`} 
                                    isReadOnly={isReadOnly}
                                    step={step}
                                    directionIndex={index}
                                    stepIndex={stepIndex}
                                />
                            )
                    ))
                )}

                {( !isReadOnly && (
                    <NewSubDirectionLine
                        key={"subDirectionLine_new"}
                        references={references}
                        directionIndex={index}
                        direction={direction}
                        ingredients={ingredients}
                    />
                ) )}

            </div>
        </div>
    );
};

DirectionLine.displayName = "DirectionLine";

export default DirectionLine;
