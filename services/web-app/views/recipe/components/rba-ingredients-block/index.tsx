import React from "react";
import * as constants from "@cypress/constants";

import { classNames, Color } from "@common/style";
import RbaIngredient from "@views/recipe/components/rba-ingredient";
import RbaSearchInput, { SearchInputWidthSize } from "@views/shared/rba-search-input";
import { useAppDispatch } from "@store";
import { addIngredient } from "@store/actions/recipe";
import { searchClear, searchFoods } from "@store/actions/search";
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

    const [ primaryIngredients, alternativeIngredients ] = ingredients.partition((ingredient) => !ingredient.is_alternative);
    const nextSlotNumber = ingredients.length && Math.max(...primaryIngredients.map((ingredient) => ingredient.slot_number)) + 1;

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

            <div className={classNames({ [styles.ingredientsLoading]: !isLoaded })}>
                {primaryIngredients.map( (ingredient) => (
                    <RbaIngredient
                        key={`ingredient_${ingredient.slot_number}`}
                        search={search}
                        isReadOnly={isReadOnly}
                        ingredient={ingredient}
                        ingredient_alternatives={
                            alternativeIngredients.filter(
                                (alternativeIngredient) => alternativeIngredient.slot_number === ingredient.slot_number,
                            )
                        }
                    />
                ) )}

                {( !isReadOnly && (
                    <RbaSearchInput
                        width={SearchInputWidthSize.Full}
                        placeholder={"Add an ingredient..."}
                        isLoading={!search.isLoaded}
                        value={search.searchInput}
                        items={search.foods}
                        onChange={(value) => { dispatch(searchFoods(value)); }}
                        onSelect={(food) => {
                            dispatch(addIngredient({ food, slotNumber: nextSlotNumber, isAlternative: false }));
                            dispatch(searchClear());
                        }}
                        data-cy={constants.CY_SEARCH}
                    />
                ) )}
            </div>

        </div>
    );
};

RbaIngredientsBlock.displayName = "RbaIngredientsBlock";


export default RbaIngredientsBlock;
