import React from "react";

import RbaDirectionLine from "@views/recipe/components/rba-direction-line";
import RbaDirectionLineNew from "@views/recipe/components/rba-direction-line-new";
import type {
    RecipeDirection,
    RecipeIngredient,
} from "@store/recipe/types";


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
        <div>
            {directions.map( (direction, index) => (
                <RbaDirectionLine
                    key={`direction_${index}`}
                    isReadOnly={isReadOnly}
                    ingredients={ingredients}
                    direction={direction}
                    index={index}
                />
            ) )}

            {( !isReadOnly && ( <RbaDirectionLineNew key={"direction_new"} direction={newDirection} /> ) )}

        </div>
    );
};


RbaDirectionsBlock.displayName = "RbaDirectionsBlock";

export default RbaDirectionsBlock;
