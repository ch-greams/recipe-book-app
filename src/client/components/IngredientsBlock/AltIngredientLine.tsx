import React from "react";
import { useDispatch } from "react-redux";

import type { Dictionary, IngredientItem } from "@common/typings";
import { Units, VolumeUnit, WeightUnit } from "@common/units";
import Utils from "@common/utils";
import SelectInput, { SelectInputType } from "@client/components/SelectInput/SelectInput";
import RemoveIcon from "@client/icons/close-sharp.svg";
import IconWrapper from "@client/icons/IconWrapper";
import SearchIcon from "@client/icons/search-sharp.svg";
import * as actions from "@client/store/recipe/actions";
import { RecipeIngredient } from "@client/store/recipe/types";
import { SearchPageStore } from "@client/store/search/types";

import styles from "./IngredientsBlock.scss";



interface Props {
    search: SearchPageStore;
    isReadOnly: boolean;
    references: Dictionary<string, IngredientItem>;
    parentId: string;
    altIngredient?: RecipeIngredient;
    isNew?: boolean;
}

const DEFAULT_ALT_INGREDIENT: RecipeIngredient = {
    amount: 100,
    amountInput: "100",
    unit: WeightUnit.g,
    id: "NEW ALTERNATIVE",
};


const AltIngredientLine: React.FC<Props> = ({
    search, isReadOnly, references, parentId, altIngredient = DEFAULT_ALT_INGREDIENT, isNew = false,
}) => {

    const dispatch = useDispatch();

    const addAltIngredient = (id: string): void => {
        const item = search.ingredients[Math.floor(Math.random() * search.ingredients.length)];
        dispatch(actions.addAltIngredient(id, item));
    };

    const altIngredientItem = references[altIngredient.id];

    const removeButton = (
        <div
            className={styles.altIngredientLineButton}
            onClick={() => dispatch(actions.removeAltIngredient(parentId, altIngredient.id))}
        >
            <IconWrapper isFullWidth={true} width={24} height={24} color={"#fff"}>
                <RemoveIcon />
            </IconWrapper>
        </div>
    );

    const searchButton = (
        <div
            className={styles.altIngredientLineButton}
            onClick={() => addAltIngredient(parentId)}
        >
            <IconWrapper isFullWidth={true} width={24} height={24} color={"#fff"}>
                <SearchIcon />
            </IconWrapper>
        </div>
    );

    const amountText = (
        <div className={styles.ingredientInfoLineAmountText}>
            {altIngredient.amount}
        </div>
    );

    const amountInput = (
        <input
            type={"text"}
            className={styles.ingredientInfoLineAmountInput}
            value={(altIngredient.amountInput|| "")}
            onChange={(event) => {
                dispatch(actions.updateAltIngredientAmount(parentId, altIngredient.id, event.target.value));
            }}
        />
    );

    const measureInput = (

        <div className={styles.ingredientInfoLineMeasure}>
                        
            {( isReadOnly ? amountText : amountInput )}
            
            <SelectInput
                type={SelectInputType.AltIngredientUnit}
                options={Object.values(Units).map((unit) => ({ value: unit }))}
                value={altIngredient.unit}
                onChange={(event) => {
                    dispatch(actions.updateAltIngredientUnit(
                        parentId, altIngredient.id, event.target.value as WeightUnit | VolumeUnit
                    ));
                }}
            />
        </div>
    );

    const onClick = (): void => { dispatch(actions.replaceIngredientWithAlternative(parentId, altIngredient.id)); };
    const onMouseEnter = (): void => { dispatch(actions.updateAltNutritionFacts(parentId, altIngredient.id, true)); };
    const onMouseLeave = (): void => { dispatch(actions.updateAltNutritionFacts(parentId, altIngredient.id, false)); };

    return (

        <div className={styles.altIngredientLine}>

            {( !isReadOnly && ( isNew ? searchButton : removeButton ) )}

            <div className={Utils.classNames({
                [styles.altIngredientInfoLine]: true,
                [styles.newIngredient]: isNew,
            })}>

                <div
                    className={styles.ingredientInfoLineName}
                    onClick={isNew ? undefined : onClick}
                    onMouseEnter={isNew ? undefined : onMouseEnter}
                    onMouseLeave={isNew ? undefined : onMouseLeave}
                >
                    {isNew ? "NEW ALTERNATIVE" : altIngredientItem.name.toUpperCase()}
                </div>

                {( !isNew && measureInput )}
            </div>
        </div>
    );
};

AltIngredientLine.displayName = "AltIngredientLine";


export default AltIngredientLine;
