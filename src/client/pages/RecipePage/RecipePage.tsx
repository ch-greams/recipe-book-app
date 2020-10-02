import React, { Component } from "react";
import { connect } from "react-redux";
import { RecipePageStore } from "../../store/recipe/types";
import { updateName, updateBrand, updateSubtitle } from "../../store/recipe/actions";
import { AppState } from "../../store";
import PageTitleBlock from "../../components/PageTitleBlock/PageTitleBlock";
import styles from "./RecipePage.scss";
import PageDetailedNutritionFactsBlock from "../../components/PageDetailedNutritionFactsBlock/PageDetailedNutritionFactsBlock";
import SelectInput, { SelectInputType } from "../../components/SelectInput/SelectInput";
import { CustomUnitInput, UnitTemperature, UnitTime, UnitVolume, UnitWeight } from "../../../common/units";
import InfoIcon from "../../icons/information-sharp.svg";
import InfoBlockIcon from "../../icons/alert-circle-sharp.svg";
import AltIcon from "../../icons/repeat-sharp.svg";
import IconWrapper from "../../icons/IconWrapper";
import NutritionFactsBlock from "../../components/NutritionFactsBlock/NutritionFactsBlock";
import Utils from "../../../common/utils";
import { NutritionFactType } from "../../../common/nutritionFacts";
import { UpdateCustomUnitsAction } from "../../store/food/types";
import ServingSizesBlock from "../../components/ServingSizesBlock/ServingSizesBlock";



interface RecipePageStateToProps {
    recipeItem: RecipePageStore;
}

interface RecipePageDispatchToProps {
    updateName: typeof updateName;
    updateBrand: typeof updateBrand;
    updateSubtitle: typeof updateSubtitle;
}

interface RecipePageProps extends RecipePageStateToProps, RecipePageDispatchToProps { }


class RecipePage extends Component<RecipePageProps> {

    // NOTE: General Information

    private getParametersBlock(
        recipeItem: RecipePageStore,
        updateCustomUnits: (customUnits: CustomUnitInput[]) => UpdateCustomUnitsAction,
    ): JSX.Element {

        return (
            
            <div className={styles.parametersBlock}>

                <div className={styles.typeSelect}>

                    <div className={styles.typeSelectLabel}>
                        {"TYPE"}
                    </div>

                    <input
                        type={"text"}
                        value={recipeItem.type}
                        className={styles.typeSelectInput}
                        onChange={console.log}
                    />

                </div>

                <div className={styles.separator} />

                <div className={styles.servingSizeLine}>
                    
                    <div className={styles.servingSizeLineLabel}>
                        {"SERVING SIZE"}
                    </div>
                    
                    <input
                        type={"text"}
                        value={recipeItem.servingSize}
                        className={styles.servingSizeLineInput}
                        onChange={console.log}
                    />

                    <SelectInput options={Object.keys(UnitWeight)} />

                </div>

                <div className={styles.separator} />

                <ServingSizesBlock
                    customUnitInputs={recipeItem.customUnitInputs}
                    updateCustomUnits={updateCustomUnits}
                />

            </div>
        );
    }

    private getGeneralInfoBlock(): JSX.Element {

        const {
            recipeItem,
        } = this.props;

        const featuredNutritionFacts = [
            NutritionFactType.Energy,
            NutritionFactType.Carbohydrate,
            NutritionFactType.DietaryFiber,
            NutritionFactType.Sugars,
            NutritionFactType.Fat,
            NutritionFactType.Monounsaturated,
            NutritionFactType.Protein,
            NutritionFactType.Sodium,
            NutritionFactType.VitaminA,
            NutritionFactType.VitaminC,
        ];

        const phFunc = (customUnits: CustomUnitInput[]): UpdateCustomUnitsAction => {
            console.log(customUnits);
            return null;
        };

        return (
            <div className={styles.mainBlock}>

                {this.getParametersBlock(recipeItem, phFunc)}

                <div className={styles.featuredNutritionFacts}>

                    <NutritionFactsBlock
                        title={"NUTRITION FACTS"}
                        nutritionFacts={Utils.getNutritionFacts(featuredNutritionFacts, {}, {})}
                    />
                </div>
            </div>
        );
    }

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

    private getSubDirectionNoteLine(description: string): JSX.Element {
        return (

            <div key={name} className={styles.subDirectionLine}>

                <div className={styles.subDirectionNoteInfoLine}>

                    <IconWrapper width={"22px"} height={"22px"} color={"#fff"}>
                        <InfoBlockIcon />
                    </IconWrapper>

                    <div className={styles.directionInfoLineTitle}>

                        <div className={styles.directionInfoLineDescription}>
                            {description}
                        </div>

                    </div>
                </div>
            </div>
        );
    }

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

                    <div className={styles.directionInfoLineAmount}>
                        {amount}
                    </div>

                    <SelectInput
                        type={SelectInputType.IngredientUnit}
                        options={Object.keys(UnitTime)}
                    />
                </div>
            </div>
        );
    }

    private getDirectionLine(
        step: number, name: string, notes: { description: string; }[] = [], subSteps: { name: string; amount: string; }[] = []
    ): JSX.Element {

        return (
            <div key={name} className={styles.directionLine}>

                <div className={styles.lineCheckbox}></div>

                <div className={styles.directionInfoLines}>

                    {this.getDirectionInfoLine(step, name, "180")}

                    {notes.map((note) => this.getSubDirectionNoteLine(note.description))}

                    {subSteps.map((subStep) => this.getSubDirectionLine(subStep.name, subStep.amount))}

                </div>

                <div className={styles.directionLineButton}>
                    <IconWrapper isFullWidth={true} width={"24px"} height={"24px"} color={"#00bfa5"}>
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
            {
                name: "Stir",
                notes: [
                    { description: "Mix quickly and lightly with a fork until moistened, but do not beat." },
                ],
                subSteps: [
                    { name: "Milk", amount: "100" },
                    { name: "Flour", amount: "240" },
                    { name: "Egg", amount: "120" },                
                ]
            },
            {
                name: "Bake",
                notes: [
                    { description: "If you don't burn your house down, then everything will be ok." },
                ],
            },
        ];

        return (
            <div className={styles.directionsBlock}>
                {directions.map((direction, index) => this.getDirectionLine(
                    index + FIRST_STEP_NUMBER,
                    direction.name,
                    direction.notes,
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
                description,
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
                        description={description}
                        withDescription={true}
                        updateName={updateName}
                        updateBrand={updateBrand}
                        updateSubtitle={updateSubtitle}
                    />

                    {this.getGeneralInfoBlock()}

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
