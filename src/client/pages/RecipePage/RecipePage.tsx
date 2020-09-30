import React, { Component } from "react";
import { connect } from "react-redux";
import { RecipeItem } from "../../store/recipe/types";
import { updateName, updateBrand, updateSubtitle } from "../../store/recipe/actions";
import { AppState } from "../../store";
import PageTitleBlock from "../../components/PageTitleBlock/PageTitleBlock";
import styles from "./RecipePage.scss";
import PageDetailedNutritionFactsBlock from "../../components/PageDetailedNutritionFactsBlock/PageDetailedNutritionFactsBlock";
import SelectInput, { SelectInputType } from "../../components/SelectInput/SelectInput";
import { UnitTemperature, UnitVolume, UnitWeight } from "../../../common/units";
import InfoIcon from "../../icons/information-sharp.svg";
import AltIcon from "../../icons/repeat-sharp.svg";
import IconWrapper from "../../icons/IconWrapper";



interface RecipePageStateToProps {
    recipeItem: RecipeItem;
}

interface RecipePageDispatchToProps {
    updateName: typeof updateName;
    updateBrand: typeof updateBrand;
    updateSubtitle: typeof updateSubtitle;
}

interface RecipePageProps extends RecipePageStateToProps, RecipePageDispatchToProps { }


class RecipePage extends Component<RecipePageProps> {

    // NOTE: Ingredients

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
                    <IconWrapper width={"24px"} height={"24px"} color={"#00bfa5"}>
                        <InfoIcon />
                    </IconWrapper>
                </div>

                <div className={styles.ingredientLineButton}>
                    <IconWrapper width={"24px"} height={"24px"} color={"#00bfa5"}>
                        <AltIcon />
                    </IconWrapper>
                </div>

            </div>
        );
    }

    private getIngredientsBlock(): JSX.Element {

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

    // NOTE: Directions

    private getSubDirectionLine(name: string, amount: string): JSX.Element {
        return (

            <div key={name} className={styles.subDirectionLine}>

                <div className={styles.lineCheckbox}></div>

                <div className={styles.subDirectionInfoLine}>

                    <div className={styles.directionInfoLineTitle}>

                        <div className={styles.directionInfoLineName}>
                            {name.toUpperCase()}
                        </div>

                    </div>

                    <div className={styles.directionInfoLineMeasure}>

                        <div className={styles.directionInfoLineAmount}>
                            {amount}
                        </div>
                        
                        <SelectInput
                            type={SelectInputType.AltIngredientUnit}
                            options={Object.keys(UnitWeight)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private getDirectionInfoLine(step: number, name: string, amount: string): JSX.Element {

        return (
            <div key={name} className={styles.directionInfoLine}>

                <div className={styles.directionInfoLineTitle}>

                    <div className={styles.directionInfoLineIndex}>
                        {`${step}.`}
                    </div>

                    <div className={styles.directionInfoLineName}>
                        {name.toUpperCase()}
                    </div>

                </div>

                <div className={styles.directionInfoLineMeasure}>

                    <div className={styles.directionInfoLineAmount}>
                        {amount}
                    </div>
                    
                    <SelectInput
                        type={SelectInputType.IngredientUnit}
                        options={Object.keys(UnitTemperature)}
                    />
                </div>
            </div>
        );
    }

    private getDirectionLine(step: number, name: string, subSteps: { name: string; amount: string; }[] = []): JSX.Element {

        return (
            <div key={name} className={styles.directionLine}>

                <div className={styles.lineCheckbox}></div>

                <div className={styles.directionInfoLines}>

                    {this.getDirectionInfoLine(step, name, "180")}

                    {subSteps.map((subStep) => this.getSubDirectionLine(subStep.name, subStep.amount))}

                </div>

                <div className={styles.directionLineButton}>
                    <IconWrapper width={"24px"} height={"24px"} color={"#00bfa5"}>
                        <InfoIcon />
                    </IconWrapper>
                </div>

            </div>
        );
    }

    private getDirectionsBlock(): JSX.Element {

        const FIRST_STEP_NUMBER = 1;

        const directions = [
            { name: "Preheat Oven" },
            { name: "Stir", subSteps: [
                { name: "Milk", amount: "100" },
                { name: "Flour", amount: "240" },
                { name: "Egg", amount: "120" },                
            ] },
            { name: "Bake" },
        ];

        return (
            <div className={styles.directionsBlock}>
                {directions.map((direction, index) => this.getDirectionLine(
                    index + FIRST_STEP_NUMBER,
                    direction.name,
                    direction.subSteps,
                ))}
            </div>
        );
    }

    public render(): JSX.Element {

        const {
            recipeItem: {
                name,
                brand,
                subtitle,
            },
            updateName,
            updateBrand,
            updateSubtitle,
        } = this.props;

        return (
            <div className={styles.recipePage}>

                <div className={styles.recipePageElements}>

                    <PageTitleBlock
                        name={name}
                        brand={brand}
                        subtitle={subtitle}
                        updateName={updateName}
                        updateBrand={updateBrand}
                        updateSubtitle={updateSubtitle}
                    />

                    <div className={styles.recipePageBlockTitle}>
                        {"INGREDIENTS"}
                    </div>

                    {this.getIngredientsBlock()}

                    <div className={styles.recipePageBlockTitle}>
                        {"DIRECTIONS"}
                    </div>

                    {this.getDirectionsBlock()}

                    <div className={styles.recipePageBlockTitle}>
                        {"DETAILED NUTRITION INFORMATION"}
                    </div>

                    <PageDetailedNutritionFactsBlock
                        nutritionFactValues={{}}
                        nutritionFactInputs={{}}
                    />

                </div>
                
            </div>
        );
    }
}


const mapStateToProps = (state: AppState): RecipePageStateToProps => ({
    recipeItem: state.recipePage,
});

const mapDispatchToProps: RecipePageDispatchToProps = {
    updateName,
    updateBrand,
    updateSubtitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipePage);
