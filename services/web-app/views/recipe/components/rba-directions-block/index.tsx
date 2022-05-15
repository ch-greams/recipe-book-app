import React from "react";

import type {
    RecipeDirection,
    RecipeIngredient,
} from "@store/recipe/types";

import RbaDirectionLine from "./rba-direction-line";
import RbaNewDirectionLine from "./rba-new-direction-line";

import styles from "./rba-directions-block.module.scss";


interface Props {
    isReadOnly: boolean;
    newDirection: RecipeDirection;
    directions: RecipeDirection[];
    ingredients: RecipeIngredient[];
}


const RbaDirectionsBlock: React.FC<Props> = ({
    isReadOnly = false, ingredients, directions = [], newDirection,
}) => {

    return (
        <div className={styles.directionsBlock}>

            {directions.map( (direction, index) => (
                <RbaDirectionLine
                    key={`direction_${index}`}
                    isReadOnly={isReadOnly}
                    ingredients={ingredients}
                    direction={direction}
                    index={index}
                />
            ) )}

            {( !isReadOnly && ( <RbaNewDirectionLine key={"direction_new"} direction={newDirection} /> ) )}

        </div>
    );
};


RbaDirectionsBlock.displayName = "RbaDirectionsBlock";

export default RbaDirectionsBlock;
