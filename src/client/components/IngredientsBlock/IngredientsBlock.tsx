import React, { Component } from "react";
import { Units, UnitVolume, UnitWeight } from "../../../common/units";
import SelectInput, { SelectInputType } from "../SelectInput/SelectInput";
import LinkIcon from "../../icons/link-sharp.svg";
import SearchIcon from "../../icons/search-sharp.svg";
import AltIcon from "../../icons/repeat-sharp.svg";
import RemoveIcon from "../../icons/remove-sharp.svg";
import IconWrapper from "../../icons/IconWrapper";
import styles from "./IngredientsBlock.scss";
import { Ingredient, IngredientReference } from "../../store/recipe/types";
import { NutritionFactType } from "../../../common/nutritionFacts";
import { Dictionary } from "../../../common/typings";
import Utils from "../../../common/utils";



interface Props {
    isReadOnly: boolean;
    ingredients: Ingredient[];
}


export default class IngredientsBlock extends Component<Props> {

    public static defaultProps = {
        isReadOnly: false,
    };


    private getIngredientInfoLineNutritionFacts(nutritionFacts: Dictionary<NutritionFactType, number>): JSX.Element {

        const nutritionFactTypes = [
            NutritionFactType.Carbohydrate,
            NutritionFactType.Fat,
            NutritionFactType.Protein,
            NutritionFactType.Energy,
        ];

        return (
            <div className={styles.ingredientInfoLineNutritionFacts}>

                {nutritionFactTypes.map( (type, index) => (
                    <div key={`nutritionFact_${index}`} className={styles.ingredientInfoLineNutritionFact}>

                        <div className={styles.ingredientInfoLineNutritionFactAmount}>
                            {nutritionFacts[type]}
                        </div>
                        <div className={styles.ingredientInfoLineNutritionFactType}>
                            {type.toUpperCase()}
                        </div>

                    </div>
                ) )}
            </div>
        );
    }

    private getIngredientInfoLine(
        name: string, amount: number, unit: UnitWeight | UnitVolume, isNew: boolean = false, isAlt: boolean = false,
    ): JSX.Element {

        const amountText = (
            <div className={styles.ingredientInfoLineAmountText}>
                {amount}
            </div>
        );

        const amountInput = (
            <input
                type={"text"}
                className={styles.ingredientInfoLineAmountInput}
                value={(amount || "")}
                onChange={console.log}
            />
        );

        return (
            <div key={name} className={Utils.classNames({
                [styles.ingredientInfoLine]: !isAlt,
                [styles.altIngredientInfoLine]: isAlt,
                [styles.newIngredient]: isNew,
            })}>

                <div className={styles.ingredientInfoLineName}>
                    {name.toUpperCase()}
                </div>

                <div className={styles.ingredientInfoLineMeasure}>
                    
                    {( this.props.isReadOnly ? amountText : amountInput )}
                    
                    <SelectInput
                        type={(isAlt ? SelectInputType.AltIngredientUnit : SelectInputType.IngredientUnit)}
                        options={Object.keys(Units)}
                        value={unit}
                    />
                </div>
            </div>
        );
    }

    private getIngredientLine(ingredient: Ingredient, index: number, isNew: boolean = false): JSX.Element {

        const newAlt: IngredientReference = {
            id: "ALTERNATIVE",
            amount: 100,
            unit: UnitWeight.g,
        };

        const checkbox = (<div className={styles.lineCheckbox}></div>);

        const removeButton = (
            <div className={styles.ingredientLineButton}>
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
                    <RemoveIcon />
                </IconWrapper>
            </div>
        );

        const searchButton = (
            <div className={styles.ingredientLineButton}>
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
                    <SearchIcon />
                </IconWrapper>
            </div>
        );

        const linkButton = (
            <div className={styles.ingredientLineButton} style={( isNew ? { opacity: "0.5" } : null )}>
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
                    <LinkIcon />
                </IconWrapper>
            </div>
        );

        const alternativeButton = (
            <div className={styles.ingredientLineButton} style={( isNew ? { opacity: "0.5" } : null )}>
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
                    <AltIcon />
                </IconWrapper>
            </div>
        );

        return (

            <div key={`ingredient_${index}`} className={styles.ingredientLine}>

                {( this.props.isReadOnly ? checkbox : ( isNew ? searchButton : removeButton ) )}

                <div className={styles.ingredientInfoLines}>

                    {this.getIngredientInfoLine(ingredient.foodItem.name, ingredient.amount, ingredient.unit, isNew)}

                    {ingredient.isOpen && this.getIngredientInfoLineNutritionFacts(ingredient.foodItem.nutritionFacts)}

                    {ingredient.alternatives && ingredient.alternatives.map(
                        (alt) => this.getIngredientInfoLine(alt.id, alt.amount, alt.unit, false, true)
                    )}

                    {( isNew && this.getIngredientInfoLine(newAlt.id, newAlt.amount, newAlt.unit, true, true) )}

                </div>

                {linkButton}

                {alternativeButton}

            </div>
        );
    }


    public render(): JSX.Element {

        const { ingredients } = this.props;

        const newIngredient: Ingredient = {

            foodItem: {
                id: "",
                name: "NEW INGREDIENT",
                nutritionFacts: {},
            },

            amount: 100,
            unit: UnitWeight.g,

            alternatives: [],
        };

        return (
            <div className={styles.ingredientsBlock}>

                {ingredients.map( (ingredient, index) => this.getIngredientLine(ingredient, index) )}

                {this.getIngredientLine(newIngredient, ++ingredients.length, true)}

            </div>
        );
    }
}
