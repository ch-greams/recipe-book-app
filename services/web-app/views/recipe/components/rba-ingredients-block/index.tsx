import React from "react";
import * as constants from "@cypress/constants";

import { Color } from "@common/colors";
import Utils from "@common/utils";
import RbaIngredient from "@views/recipe/components/rba-ingredient";
import RbaSearchInput, { SearchInputWidthSize } from "@views/shared/rba-search-input";
import { useAppDispatch } from "@store";
import { addIngredient } from "@store/actions/recipe";
import { searchClear, searchProducts } from "@store/actions/search";
import type { RecipeIngredient } from "@store/types/recipe";
import type { SearchStore } from "@store/types/search";
import { IconSize } from "@icons/icon-params";
import RbaIconLoading from "@icons/rba-icon-loading";

import styles from "./rba-ingredients-block.module.scss";


interface Props {
    isReadOnly: boolean;
    isLoaded: boolean;
    ingredients: RecipeIngredient[];
    search: SearchStore;
}



const RbaIngredientsBlock: React.FC<Props> = ({ search, ingredients, isLoaded, isReadOnly = false }) => {

    const dispatch = useAppDispatch();

    return (
        <div
            data-cy={constants.CY_INGREDIENTS_BLOCK}
            className={styles.ingredientsBlock}
        >

            {( !isLoaded && (
                <div className={styles.loadingOverlay}>
                    <RbaIconLoading size={IconSize.ExtraLarge} color={Color.White} />
                </div>
            ) )}

            <div className={Utils.classNames({ [styles.ingredientsLoading]: !isLoaded })}>
                {ingredients.map( (ingredient) => (
                    <RbaIngredient
                        key={`ingredient_${ingredient.id}`}
                        search={search}
                        isReadOnly={isReadOnly}
                        ingredient={ingredient}
                    />
                ) )}

                {( !isReadOnly && (
                    <RbaSearchInput
                        width={SearchInputWidthSize.Full}
                        placeholder={"Add an ingredient..."}
                        isLoading={!search.isLoaded}
                        value={search.searchInput}
                        items={search.products}
                        onChange={(value) => { dispatch(searchProducts(value)); }}
                        onSelect={(product) => {
                            dispatch(addIngredient(product));
                            dispatch(searchClear());
                        }}
                    />
                ) )}
            </div>

        </div>
    );
};

RbaIngredientsBlock.displayName = "RbaIngredientsBlock";


export default RbaIngredientsBlock;
