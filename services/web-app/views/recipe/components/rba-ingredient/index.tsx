import React from "react";
import * as constants from "@cypress/constants";

import type { Unit } from "@common/units";
import RbaIngredientNutrients from "@views/recipe/components/rba-ingredient-nutrients";
import RbaIngredientProduct, {
    IngredientProductSize, IngredientProductTheme,
} from "@views/recipe/components/rba-ingredient-product";
import RbaSearchInput, { SearchInputHeightSize, SearchInputWidthSize } from "@views/shared/rba-search-input";
import { useAppDispatch } from "@store";
import * as actions from "@store/actions/recipe";
import { searchClear, searchProducts } from "@store/actions/search";
import type { RecipeIngredient } from "@store/types/recipe";
import type { SearchStore } from "@store/types/search";

import styles from "./rba-ingredient.module.scss";



interface Props {
    search: SearchStore;
    isReadOnly: boolean;
    ingredient: RecipeIngredient;
    ingredient_alternatives: RecipeIngredient[];
}


const RbaIngredient: React.FC<Props> = ({ search, isReadOnly, ingredient, ingredient_alternatives }) => {

    const dispatch = useAppDispatch();

    const showIngredientAlternatives: boolean = ingredient_alternatives.isNotEmpty();
    const showNewIngredientAlternative: boolean = !isReadOnly;
    const showSeparator: boolean = showIngredientAlternatives || showNewIngredientAlternative;

    const ingredientInfoLines = (
        <div
            data-cy={constants.CY_INGREDIENT_INFO_LINES}
            className={styles.ingredientInfoLines}
        >

            <RbaIngredientNutrients
                nutrients={ingredient.nutrients}
                alternativeNutrients={ingredient.alternativeNutrients}
            />

            {( showSeparator && (<div className={styles.separator}></div>) )}

            {(
                showIngredientAlternatives && ingredient_alternatives.map((ingredient_alternative) => (
                    <RbaIngredientProduct
                        key={`alt_ingredient_${ingredient_alternative.id}`}
                        theme={IngredientProductTheme.Alternative}
                        size={IngredientProductSize.Compact}
                        isReadOnly={isReadOnly}
                        ingredient={ingredient_alternative}
                        onClick={() => {
                            dispatch(actions.replaceIngredientWithAlternative({
                                slotNumber: ingredient_alternative.slot_number,
                                id: ingredient_alternative.id,
                            }));
                        }}
                        onClickRemove={() => {
                            dispatch(actions.removeIngredientAlternative(ingredient_alternative.id));
                        }}
                        onMouseEnter={() => {
                            dispatch(actions.updateAltNutrients({
                                slotNumber: ingredient_alternative.slot_number,
                                nutrients: ingredient_alternative.nutrients,
                            }));
                        }}
                        onMouseLeave={() => {
                            dispatch(actions.updateAltNutrients({
                                slotNumber: ingredient_alternative.slot_number,
                                nutrients: {},
                            }));
                        }}
                        onChangeAmount={(value) => {
                            dispatch(actions.updateIngredientProductAmount({
                                id: ingredient_alternative.id,
                                inputValue: value,
                            }));
                        }}
                        onChangeUnit={(option) => {
                            dispatch(actions.updateIngredientProductUnit({
                                id: ingredient_alternative.id,
                                unit: option.value as Unit,
                            }));
                        }}
                    />
                ))
            )}

            {( showNewIngredientAlternative && (
                <RbaSearchInput
                    width={SearchInputWidthSize.Full}
                    height={SearchInputHeightSize.Small}
                    placeholder={"Add a substitute for this ingredient..."}
                    isLoading={!search.isLoaded}
                    value={search.searchInput}
                    items={search.products}
                    onChange={(value) => { dispatch(searchProducts(value)); }}
                    onSelect={(product) => {
                        dispatch(actions.addIngredient({ product, slotNumber: ingredient.slot_number, isAlternative: true }));
                        dispatch(searchClear());
                    }}
                    data-cy={constants.CY_SEARCH}
                />
            ) )}

        </div>
    );

    return (

        <div
            data-cy={constants.CY_INGREDIENT}
            key={`ingredient_${ingredient.slot_number}`}
            className={styles.ingredient}
        >
            <RbaIngredientProduct
                theme={IngredientProductTheme.Primary}
                size={IngredientProductSize.Default}
                ingredient={ingredient}
                isReadOnly={isReadOnly}
                isMarked={ingredient.isMarked}
                onClick={() => dispatch(actions.toggleIngredientOpen(ingredient.id))}
                onClickRemove={() => dispatch(actions.removeIngredient(ingredient.slot_number))}
                onClickMark={() => dispatch(actions.toggleIngredientMark(ingredient.id))}
                onChangeAmount={(value) => {
                    dispatch(actions.updateIngredientProductAmount({ id: ingredient.id, inputValue: value }));
                }}
                onChangeUnit={(option) => {
                    dispatch(actions.updateIngredientProductUnit({ id: ingredient.id, unit: option.value as Unit }));
                }}
            />

            {ingredient.isOpen && ingredientInfoLines}

        </div>
    );
};

RbaIngredient.displayName = "RbaIngredient";


export default RbaIngredient;
