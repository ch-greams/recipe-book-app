import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import type { Dictionary, IngredientItem } from "@common/typings";
import { WeightUnit } from "@common/units";
import Utils from "@common/utils";
import { RoutePath } from "@client/components/Root";
import RemoveIcon from "@client/icons/close-sharp.svg";
import IconWrapper from "@client/icons/IconWrapper";
import LinkIcon from "@client/icons/link-sharp.svg";
import SearchIcon from "@client/icons/search-sharp.svg";
import * as actions from "@client/store/recipe/actions";
import type { RecipeIngredientDefault } from "@client/store/recipe/types";
import type { SearchPageStore } from "@client/store/search/types";

import AltIngredientLine from "./AltIngredientLine";
import IngredientInfoLine from "./IngredientInfoLine";
import IngredientInfoLineNutritionFacts from "./IngredientInfoLineNutritionFacts";

import styles from "./IngredientsBlock.scss";



interface IngredientLineProps {
    search: SearchPageStore;
    isReadOnly: boolean;
    references: Dictionary<string, IngredientItem>;
    ingredient?: RecipeIngredientDefault;
    isNew?: boolean;
}



const DEFAULT_INGREDIENT: RecipeIngredientDefault = {

    isOpen: false,
    isMarked: false,

    id: "new",

    amount: 100,
    amountInput: "100",
    unit: WeightUnit.g,

    altNutritionFacts: {},

    alternatives: [],
};

const IngredientLine: React.FC<IngredientLineProps> = ({
    search, isReadOnly, references, ingredient = DEFAULT_INGREDIENT, isNew = false,
}) => {

    const dispatch = useDispatch();

    const removeIngredient = (id: string): void => {
        dispatch(actions.removeIngredient(id));
    };


    const toggleIngredientMark = (id: string): void => {
        dispatch(actions.toggleIngredientMark(id));
    };

    const addIngredient = (): void => {
        const item = search.ingredients[Math.floor(Math.random() * search.ingredients.length)];
        dispatch(actions.addIngredient(item));
    };

    const ingredientItem = references[ingredient.id];

    const checkbox = (
        <div
            className={styles.lineCheckbox}
            onClick={() => toggleIngredientMark(ingredient.id)}
        >
            {( ingredient.isMarked ? <div className={styles.lineCheckboxMark} /> : null )}                
        </div>
    );

    const removeButton = (
        <div
            className={styles.ingredientLineButton}
            onClick={() => removeIngredient(ingredient.id)}
        >
            <IconWrapper isFullWidth={true} width={24} height={24} color={"#00bfa5"}>
                <RemoveIcon />
            </IconWrapper>
        </div>
    );

    const searchButton = (
        <div
            className={styles.ingredientLineButton}
            onClick={addIngredient}
        >
            <IconWrapper isFullWidth={true} width={24} height={24} color={"#00bfa5"}>
                <SearchIcon />
            </IconWrapper>
        </div>
    );

    const linkButton = (
        <Link
            to={Utils.getItemPath(RoutePath.Food, ingredient.id)}
            className={styles.ingredientLineButton}
            style={( isNew ? { opacity: "0.5" } : undefined )}
        >
            <IconWrapper isFullWidth={true} width={24} height={24} color={"#00bfa5"}>
                <LinkIcon />
            </IconWrapper>
        </Link>
    );

    const showAlternativeIngredients: boolean = ingredient.isOpen && Utils.arrayIsNotEmpty(ingredient.alternatives);
    const showNewAlternativeIngredient: boolean = ingredient.isOpen && !isNew && !isReadOnly;
    const showSeparator: boolean = showAlternativeIngredients || showNewAlternativeIngredient;

    return (

        <div key={`ingredient_${ingredient.id}`} className={styles.ingredientLine}>

            {( isReadOnly ? checkbox : ( isNew ? searchButton : removeButton ) )}

            <div className={styles.ingredientInfoLines}>

                <IngredientInfoLine
                    isReadOnly={isReadOnly}
                    references={references}
                    ingredient={ingredient}
                    isNew={isNew}
                />

                {(
                    ingredient.isOpen && (
                        <IngredientInfoLineNutritionFacts
                            nutritionFacts={ingredientItem.nutritionFacts}
                            altNutritionFacts={ingredient.altNutritionFacts}
                        />
                    )
                )}

                {( showSeparator && (<div className={styles.separator}></div>) )}

                {(
                    showAlternativeIngredients &&
                    ingredient.alternatives.map((alt) => (
                        <AltIngredientLine
                            key={`alt_ingredient_${alt.id}`}
                            search={search}
                            isReadOnly={isReadOnly}
                            references={references}
                            parentId={ingredient.id}
                            altIngredient={alt}
                        />
                    ))
                )}

                {( showNewAlternativeIngredient && (
                    <AltIngredientLine
                        key={"alt_ingredient_new"}
                        search={search}
                        isReadOnly={isReadOnly}
                        references={references}
                        parentId={ingredient.id}
                        isNew={true}
                    />
                ) )}

            </div>

            {linkButton}

        </div>
    );
};

IngredientLine.displayName = "IngredientLine";


export default IngredientLine;
