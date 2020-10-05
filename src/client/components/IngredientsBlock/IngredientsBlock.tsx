import React, { Component } from "react";
import { Units, UnitVolume, UnitWeight } from "../../../common/units";
import SelectInput, { SelectInputType } from "../SelectInput/SelectInput";
import LinkIcon from "../../icons/link-sharp.svg";
import AltIcon from "../../icons/repeat-sharp.svg";
import AddIcon from "../../icons/add-sharp.svg";
import RemoveIcon from "../../icons/remove-sharp.svg";
import IconWrapper from "../../icons/IconWrapper";
import styles from "./IngredientsBlock.scss";
import { Ingredient } from "../../store/recipe/types";
import { NutritionFactType } from "../../../common/nutritionFacts";
import { Dictionary } from "../../../common/typings";



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

    private getIngredientInfoLine(name: string, amount: number, unit: UnitWeight | UnitVolume, isAlt: boolean = false): JSX.Element {

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
            <div key={name} className={(isAlt ? styles.altIngredientInfoLine : styles.ingredientInfoLine)}>

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

    private getIngredientLine(ingredient: Ingredient, index: number): JSX.Element {

        const checkbox = (<div className={styles.lineCheckbox}></div>);

        const isNew = false;

        const addButton = (
            <div className={styles.ingredientLineButton}>
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
                    <AddIcon />
                </IconWrapper>
            </div>
        );

        const removeButton = (
            <div className={styles.ingredientLineButton}>
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
                    <RemoveIcon />
                </IconWrapper>
            </div>
        );

        const infoButton = (
            <div className={styles.ingredientLineButton}>
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
                    <LinkIcon />
                </IconWrapper>
            </div>
        );

        const alternativeButton = (
            <div className={styles.ingredientLineButton}>
                <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
                    <AltIcon />
                </IconWrapper>
            </div>
        );

        return (

            <div key={`ingredient_${index}`} className={styles.ingredientLine}>

                {( this.props.isReadOnly ? checkbox : ( isNew ? addButton : removeButton ) )}

                <div className={styles.ingredientInfoLines}>

                    {this.getIngredientInfoLine(ingredient.foodItem.name, ingredient.amount, ingredient.unit)}

                    {ingredient.isOpen && this.getIngredientInfoLineNutritionFacts(ingredient.foodItem.nutritionFacts)}

                    {ingredient.alternatives && ingredient.alternatives.map(
                        (alt) => this.getIngredientInfoLine(alt.id, alt.amount, alt.unit, true)
                    )}

                </div>

                {infoButton}

                {alternativeButton}

            </div>
        );
    }


    public render(): JSX.Element {

        const { ingredients } = this.props;

        return (
            <div className={styles.ingredientsBlock}>

                {ingredients.map( (ingredient, index) => this.getIngredientLine(ingredient, index) )}

            </div>
        );
    }
}
