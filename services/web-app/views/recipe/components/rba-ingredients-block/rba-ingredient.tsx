import React from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import * as constants from "@cypress/constants";

import Utils, { RoutePath } from "@common/utils";
import * as actions from "@store/recipe/actions";
import type { RecipeIngredient } from "@store/recipe/types";
import type { SearchPageStore } from "@store/search/types";
import RemoveIcon from "@icons/close-sharp.svg";
import IconWrapper from "@icons/IconWrapper";
import LinkIcon from "@icons/link-sharp.svg";
import SearchIcon from "@icons/search-sharp.svg";

import RbaIngredientInfo from "./rba-ingredient-info";
import RbaIngredientNutritionFacts from "./rba-ingredient-nutrition-facts";
import RbaIngredientProduct from "./rba-ingredient-product";

import styles from "./rba-ingredients-block.module.scss";



interface Props {
    search: SearchPageStore;
    isReadOnly: boolean;
    ingredient?: RecipeIngredient;
    isNew?: boolean;
}



const DEFAULT_INGREDIENT: RecipeIngredient = {

    isOpen: false,
    isMarked: false,

    id: -1,
    product_id: -1,

    altNutritionFacts: {},

    products: {},
};

const RbaIngredient: React.FC<Props> = ({ search, isReadOnly, ingredient = DEFAULT_INGREDIENT, isNew = false }) => {

    const dispatch = useDispatch();

    const removeIngredient = (id: number): void => { dispatch(actions.removeIngredient(id)); };
    const toggleIngredientMark = (id: number): void => { dispatch(actions.toggleIngredientMark(id)); };

    // FIXME: Replace functionality
    const addIngredient = (): void => {
        const item = search.products[Math.floor(Math.random() * search.products.length)];
        console.log("PLEASE FIX ME:", item);
        // dispatch(actions.addIngredient(item));
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
            data-cy={constants.CY_INGREDIENT_LINE_REMOVE_BUTTON}
            className={styles.ingredientButton}
            onClick={() => removeIngredient(ingredient.id)}
        >
            <IconWrapper isFullWidth={true} width={24} height={24} color={Utils.COLOR_DEFAULT}>
                <RemoveIcon />
            </IconWrapper>
        </div>
    );

    const searchButton = (
        <div
            data-cy={constants.CY_NEW_INGREDIENT_LINE_SEARCH_BUTTON}
            className={styles.ingredientButton}
            onClick={addIngredient}
        >
            <IconWrapper isFullWidth={true} width={24} height={24} color={Utils.COLOR_DEFAULT}>
                <SearchIcon />
            </IconWrapper>
        </div>
    );

    const linkPath = Utils.getItemPath(
        (
            ingredient.products[ingredient.product_id]?.product_type === "food"
                ? RoutePath.Food
                : RoutePath.Recipe
        ),
        ingredient.product_id,
    );

    const showIngredientProducts: boolean = ingredient.isOpen && Utils.arrayIsNotEmpty(Object.keys(ingredient.products));
    const showNewIngredientProduct: boolean = ingredient.isOpen && !isNew && !isReadOnly;
    const showSeparator: boolean = showIngredientProducts || showNewIngredientProduct;

    return (

        <div
            data-cy={( isNew ? constants.CY_NEW_INGREDIENT_LINE : constants.CY_INGREDIENT_LINE )}
            key={`ingredient_${ingredient.id}`}
            className={styles.ingredient}
        >

            {( isReadOnly ? checkbox : ( isNew ? searchButton : removeButton ) )}

            <div className={styles.ingredientInfoLines}>

                <RbaIngredientInfo
                    isReadOnly={isReadOnly}
                    ingredient={ingredient}
                    isNew={isNew}
                />

                {(
                    ingredient.isOpen && (
                        <RbaIngredientNutritionFacts
                            nutritionFacts={Utils.unwrapForced(
                                ingredient.products[ingredient.product_id],
                                `ingredient.products["${ingredient.product_id}"]`,
                            ).nutrition_facts}
                            altNutritionFacts={ingredient.altNutritionFacts}
                        />
                    )
                )}

                {( showSeparator && (<div className={styles.separator}></div>) )}

                {(
                    showIngredientProducts &&
                    Utils.getObjectValues(ingredient.products).map((product) => (
                        <RbaIngredientProduct
                            key={`ingredient_product_${product.product_id}`}
                            search={search}
                            isReadOnly={isReadOnly}
                            parentId={ingredient.id}
                            ingredientProduct={product}
                        />
                    ))
                )}

                {( showNewIngredientProduct && (
                    <RbaIngredientProduct
                        key={"ingredient_product_new"}
                        search={search}
                        isReadOnly={isReadOnly}
                        parentId={ingredient.id}
                        isNew={true}
                    />
                ) )}

            </div>

            <Link href={linkPath}>
                <a
                    className={styles.ingredientButton}
                    style={( isNew ? { opacity: "0.5" } : undefined )}
                >
                    <IconWrapper isFullWidth={true} width={24} height={24} color={Utils.COLOR_DEFAULT}>
                        <LinkIcon />
                    </IconWrapper>
                </a>
            </Link>

        </div>
    );
};

RbaIngredient.displayName = "RbaIngredient";


export default RbaIngredient;
