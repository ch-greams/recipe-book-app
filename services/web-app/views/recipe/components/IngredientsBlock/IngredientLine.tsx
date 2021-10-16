import React from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";

import type { IngredientItem } from "@common/typings";
import { WeightUnit } from "@common/units";
import Utils, { RoutePath } from "@common/utils";
import * as actions from "@store/recipe/actions";
import type { RecipeIngredientDefault } from "@store/recipe/types";
import type { SearchPageStore } from "@store/search/types";
import RemoveIcon from "@icons/close-sharp.svg";
import IconWrapper from "@icons/IconWrapper";
import LinkIcon from "@icons/link-sharp.svg";
import SearchIcon from "@icons/search-sharp.svg";

import AltIngredientLine from "./AltIngredientLine";
import IngredientInfoLine from "./IngredientInfoLine";
import IngredientInfoLineNutritionFacts from "./IngredientInfoLineNutritionFacts";

import styles from "./IngredientsBlock.module.scss";



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
        <Link href={Utils.getItemPath(RoutePath.Food, ingredient.id)}>
            <a
                className={styles.ingredientLineButton}
                style={( isNew ? { opacity: "0.5" } : undefined )}
            >
                <IconWrapper isFullWidth={true} width={24} height={24} color={"#00bfa5"}>
                    <LinkIcon />
                </IconWrapper>
            </a>
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
                            nutritionFacts={Utils.unwrapForced(references[ingredient.id], `references["${ingredient.id}"]`).nutritionFacts}
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