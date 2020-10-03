import React, { Component } from "react";
import { UnitVolume } from "../../../common/units";
import SelectInput, { SelectInputType } from "../SelectInput/SelectInput";
import InfoIcon from "../../icons/information-sharp.svg";
import AltIcon from "../../icons/repeat-sharp.svg";
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

    private getIngredientInfoLine(name: string, amount: number, isAlt: boolean = false): JSX.Element {

        return (
            <div key={name} className={(isAlt ? styles.altIngredientInfoLine : styles.ingredientInfoLine)}>

                <div className={styles.ingredientInfoLineName}>
                    {name.toUpperCase()}
                </div>

                <div className={styles.ingredientInfoLineMeasure}>
                    
                    <div className={styles.ingredientInfoLineAmount}>
                        {amount}
                    </div>
                    
                    <SelectInput
                        type={(isAlt ? SelectInputType.AltIngredientUnit : SelectInputType.IngredientUnit)}
                        options={Object.keys(UnitVolume)}
                    />
                </div>
            </div>
        );
    }

    private getIngredientLine(ingredient: Ingredient, index: number): JSX.Element {

        return (

            <div key={`ingredient_${index}`} className={styles.ingredientLine}>

                <div className={styles.lineCheckbox}></div>

                <div className={styles.ingredientInfoLines}>

                    {this.getIngredientInfoLine(ingredient.foodItem.name, ingredient.amount)}

                    {ingredient.isOpen && this.getIngredientInfoLineNutritionFacts(ingredient.foodItem.nutritionFacts)}

                    {ingredient.alternatives && ingredient.alternatives.map(
                        (alt) => this.getIngredientInfoLine(alt.id, alt.amount, true)
                    )}

                </div>

                <div className={styles.ingredientLineButton}>
                    <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
                        <InfoIcon />
                    </IconWrapper>
                </div>

                <div className={styles.ingredientLineButton}>
                    <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
                        <AltIcon />
                    </IconWrapper>
                </div>

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
