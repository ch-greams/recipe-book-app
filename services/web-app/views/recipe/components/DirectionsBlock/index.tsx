import React from "react";

import type { Dictionary, IngredientItem } from "@common/typings";
import {
    RecipeDirection,
    RecipeIngredientDefault,
} from "@store/recipe/types";

import DirectionLine from "./DirectionLine";
import NewDirectionLine from "./NewDirectionLine";

import styles from "./DirectionsBlock.module.scss";


interface Props {
    isReadOnly: boolean;
    newDirection: RecipeDirection;
    directions: RecipeDirection[];
    ingredients: RecipeIngredientDefault[];
    references: Dictionary<string, IngredientItem>;
}


const DirectionsBlock: React.FC<Props> = ({
    isReadOnly = false, ingredients, references, directions = [], newDirection,
}) => {

    return (
        <div className={styles.directionsBlock}>

            {directions.map( (direction, index) => (
                <DirectionLine
                    key={`direction_${index}`}
                    isReadOnly={isReadOnly}
                    ingredients={ingredients}
                    references={references}
                    direction={direction}
                    index={index}
                />
            ) )}

            {( !isReadOnly && (
                <NewDirectionLine
                    key={"direction_new"}
                    isReadOnly={isReadOnly}
                    direction={newDirection}
                />
            ) )}

        </div>
    );
};


DirectionsBlock.displayName = "DirectionsBlock";

export default DirectionsBlock;
