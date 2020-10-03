import React, { Component } from "react";
import { UnitVolume } from "../../../common/units";
import SelectInput, { SelectInputType } from "../SelectInput/SelectInput";
import InfoIcon from "../../icons/information-sharp.svg";
import AltIcon from "../../icons/repeat-sharp.svg";
import IconWrapper from "../../icons/IconWrapper";
import styles from "./IngredientsBlock.scss";


interface Props {
    isReadOnly: boolean;
}


export default class IngredientsBlock extends Component<Props> {

    public static defaultProps = {
        isReadOnly: false,
    };


    private getIngredientInfoLineNutritionFacts(): JSX.Element {

        return (
            <div className={styles.ingredientInfoLineNutritionFacts}>
                <div className={styles.ingredientInfoLineNutritionFact}>

                    <div className={styles.ingredientInfoLineNutritionFactAmount}>
                        {"158.2"}
                    </div>
                    <div className={styles.ingredientInfoLineNutritionFactType}>
                        {"CARBOHYDRATE"}
                    </div>

                </div>
                <div className={styles.ingredientInfoLineNutritionFact}>

                    <div className={styles.ingredientInfoLineNutritionFactAmount}>
                        {"8.1"}
                    </div>
                    <div className={styles.ingredientInfoLineNutritionFactType}>
                        {"FAT"}
                    </div>

                </div>
                <div className={styles.ingredientInfoLineNutritionFact}>

                    <div className={styles.ingredientInfoLineNutritionFactAmount}>
                        {"47.3"}
                    </div>
                    <div className={styles.ingredientInfoLineNutritionFactType}>
                        {"PROTEIN"}
                    </div>

                </div>
                <div className={styles.ingredientInfoLineNutritionFact}>

                    <div className={styles.ingredientInfoLineNutritionFactAmount}>
                        {"573"}
                    </div>
                    <div className={styles.ingredientInfoLineNutritionFactType}>
                        {"ENERGY / KCAL"}
                    </div>

                </div>
            </div>
        );
    }

    private getIngredientInfoLine(name: string, amount: string, isAlt: boolean = false): JSX.Element {

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

    private getIngredientLine(name: string, amount: string, isOpen: boolean, alternatives: { name: string; amount: string; }[] = []): JSX.Element {

        return (

            <div className={styles.ingredientLine}>

                <div className={styles.lineCheckbox}></div>

                <div className={styles.ingredientInfoLines}>

                    {this.getIngredientInfoLine(name, amount)}

                    {isOpen && this.getIngredientInfoLineNutritionFacts()}

                    {alternatives.map((alt) => this.getIngredientInfoLine(alt.name, alt.amount, true))}

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

        return (
            <div className={styles.ingredientsBlock}>

                {this.getIngredientLine("Milk", "120", false, [
                    { name: "Oat Milk", amount: "120" },
                    { name: "Almond Milk", amount: "120" },
                ])}

                {this.getIngredientLine("Flour", "250", true, [
                    { name: "Rye Flour", amount: "220" },
                ])}

                {this.getIngredientLine("Eggs", "2", true)}

            </div>
        );
    }
}
