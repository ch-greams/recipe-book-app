import React from "react";

import type {
    RecipeDirection,
    RecipeIngredient,
} from "@store/recipe/types";

import DirectionLine from "./direction-line";
import NewDirectionLine from "./new-direction-line";

import styles from "./directions-block.module.scss";


interface Props {
    isReadOnly: boolean;
    newDirection: RecipeDirection;
    directions: RecipeDirection[];
    ingredients: RecipeIngredient[];
}


const DirectionsBlock: React.FC<Props> = ({
    isReadOnly = false, ingredients, directions = [], newDirection,
}) => {

    return (
        <div className={styles.directionsBlock}>

            {directions.map( (direction, index) => (
                <DirectionLine
                    key={`direction_${index}`}
                    isReadOnly={isReadOnly}
                    ingredients={ingredients}
                    direction={direction}
                    index={index}
                />
            ) )}

            {( !isReadOnly && ( <NewDirectionLine key={"direction_new"} direction={newDirection} /> ) )}

        </div>
    );
};


DirectionsBlock.displayName = "DirectionsBlock";

export default DirectionsBlock;
