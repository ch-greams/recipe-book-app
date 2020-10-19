import React, { Component } from "react";
import { connect } from "react-redux";
import { RecipePageStore } from "../../store/recipe/types";
import {
    updateName, updateBrand, updateSubtitle, updateDescription, updateIngredients, removeDirection,
    removeSubDirection, toggleDirectionOpen, toggleDirectionMark, toggleSubDirectionMark,
    updateSubDirectionNote, updateSubDirectionIngredientAmount, updateSubDirectionIngredientUnit,
    createSubDirectionIngredient, createSubDirection, updateNewSubDirectionType,
    updateDirectionStepNumber, updateDirectionName, updateDirectionTemperatureCount,
    updateDirectionTemperatureUnit, updateDirectionTimeCount, updateDirectionTimeUnit,
    updateNewDirectionStepNumber, updateNewDirectionName, updateNewDirectionTemperatureCount,
    updateNewDirectionTemperatureUnit, updateNewDirectionTimeCount, updateNewDirectionTimeUnit,
    createDirection, removeIngredient, removeAltIngredient, replaceIngredientWithAlternative,
    toggleIngredientOpen, toggleIngredientMark, updateAltIngredientAmount, updateAltIngredientUnit,
    updateIngredientAmount, updateIngredientUnit,
} from "../../store/recipe/actions";
import { AppState } from "../../store";
import PageTitleBlock from "../../components/PageTitleBlock/PageTitleBlock";
import PageDetailedNutritionFactsBlock from "../../components/PageDetailedNutritionFactsBlock/PageDetailedNutritionFactsBlock";
import SelectInput from "../../components/SelectInput/SelectInput";
import { CustomUnitInput, UnitWeight } from "../../../common/units";
import NutritionFactsBlock from "../../components/NutritionFactsBlock/NutritionFactsBlock";
import Utils from "../../../common/utils";
import { NutritionFactType } from "../../../common/nutritionFacts";
import { UpdateCustomUnitsAction } from "../../store/food/types";
import ServingSizesBlock from "../../components/ServingSizesBlock/ServingSizesBlock";
import IngredientsBlock from "../../components/IngredientsBlock/IngredientsBlock";
import DirectionsBlock from "../../components/DirectionsBlock/DirectionsBlock";
import styles from "./RecipePage.scss";
import { requestIngredients } from "../../store/search/actions";
import { SearchPageStore } from "../../store/search/types";
import { RouteComponentProps } from "react-router-dom";



interface StateToProps {
    recipeItem: RecipePageStore;
    search: SearchPageStore;
}

interface DispatchToProps {
    updateName: typeof updateName;
    updateBrand: typeof updateBrand;
    updateSubtitle: typeof updateSubtitle;
    updateDescription: typeof updateDescription;
    updateIngredients: typeof updateIngredients;
    requestIngredients: typeof requestIngredients;
    removeDirection: typeof removeDirection;
    removeSubDirection: typeof removeSubDirection;
    toggleDirectionOpen: typeof toggleDirectionOpen;
    toggleDirectionMark: typeof toggleDirectionMark;
    toggleSubDirectionMark: typeof toggleSubDirectionMark;
    updateSubDirectionNote: typeof updateSubDirectionNote;
    updateSubDirectionIngredientAmount: typeof updateSubDirectionIngredientAmount;
    updateSubDirectionIngredientUnit: typeof updateSubDirectionIngredientUnit;
    createSubDirectionIngredient: typeof createSubDirectionIngredient;
    createSubDirection: typeof createSubDirection;
    updateNewSubDirectionType: typeof updateNewSubDirectionType;
    updateDirectionStepNumber: typeof updateDirectionStepNumber;
    updateDirectionName: typeof updateDirectionName;
    updateDirectionTemperatureCount: typeof updateDirectionTemperatureCount;
    updateDirectionTemperatureUnit: typeof updateDirectionTemperatureUnit;
    updateDirectionTimeCount: typeof updateDirectionTimeCount;
    updateDirectionTimeUnit: typeof updateDirectionTimeUnit;
    updateNewDirectionStepNumber: typeof updateNewDirectionStepNumber;
    updateNewDirectionName: typeof updateNewDirectionName;
    updateNewDirectionTemperatureCount: typeof updateNewDirectionTemperatureCount;
    updateNewDirectionTemperatureUnit: typeof updateNewDirectionTemperatureUnit;
    updateNewDirectionTimeCount: typeof updateNewDirectionTimeCount;
    updateNewDirectionTimeUnit: typeof updateNewDirectionTimeUnit;
    createDirection: typeof createDirection;

    removeIngredient: typeof removeIngredient;
    removeAltIngredient: typeof removeAltIngredient;
    replaceIngredientWithAlternative: typeof replaceIngredientWithAlternative;
    toggleIngredientOpen: typeof toggleIngredientOpen;
    toggleIngredientMark: typeof toggleIngredientMark;
    updateIngredientAmount: typeof updateIngredientAmount;
    updateIngredientUnit: typeof updateIngredientUnit;
    updateAltIngredientAmount: typeof updateAltIngredientAmount;
    updateAltIngredientUnit: typeof updateAltIngredientUnit;
}

interface RecipePageProps extends StateToProps, DispatchToProps, RouteComponentProps<{ recipeId: string }> { }


class RecipePage extends Component<RecipePageProps> {
    public static readonly displayName = "RecipePage";

    public componentDidMount(): void {

        this.props.requestIngredients();
    }

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

                    <SelectInput
                        options={Object.keys(UnitWeight)}
                        value={recipeItem.unit}
                        onChange={console.log}
                    />

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

        const { recipeItem } = this.props;

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
                        isReadOnly={true}
                        title={"NUTRITION FACTS"}
                        nutritionFacts={Utils.getNutritionFacts(featuredNutritionFacts, {}, {})}
                    />
                </div>
            </div>
        );
    }

    public render(): JSX.Element {

        const {
            location,
            recipeItem: {
                name,
                brand,
                subtitle,
                description,
                ingredients,
                newDirection,
                directions,
            },
            search,
            updateName,
            updateBrand,
            updateSubtitle,
            updateDescription,
            updateIngredients,
            removeDirection,
            removeSubDirection,
            toggleDirectionOpen,
            toggleDirectionMark,
            toggleSubDirectionMark,
            updateSubDirectionNote,
            updateSubDirectionIngredientAmount,
            updateSubDirectionIngredientUnit,
            createSubDirectionIngredient,
            createSubDirection,
            updateNewSubDirectionType,
            updateDirectionStepNumber,
            updateDirectionName,
            updateDirectionTemperatureCount,
            updateDirectionTemperatureUnit,
            updateDirectionTimeCount,
            updateDirectionTimeUnit,
            updateNewDirectionStepNumber,
            updateNewDirectionName,
            updateNewDirectionTemperatureCount,
            updateNewDirectionTemperatureUnit,
            updateNewDirectionTimeCount,
            updateNewDirectionTimeUnit,
            createDirection,

            removeIngredient,
            removeAltIngredient,
            replaceIngredientWithAlternative,
            toggleIngredientOpen,
            toggleIngredientMark,
            updateIngredientAmount,
            updateIngredientUnit,
            updateAltIngredientAmount,
            updateAltIngredientUnit,
        } = this.props;

        const searchParams = new URLSearchParams(location.search);
        const isEdit = ( searchParams.get("edit") === "true" );

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
                        updateDescription={updateDescription}
                    />

                    {this.getGeneralInfoBlock()}

                    <div className={styles.recipePageBlockTitle}>
                        {"INGREDIENTS"}
                    </div>

                    <IngredientsBlock
                        isReadOnly={!isEdit}
                        ingredients={ingredients}
                        updateIngredients={updateIngredients}
                        search={search}

                        removeIngredient={removeIngredient}
                        removeAltIngredient={removeAltIngredient}
                        replaceIngredientWithAlternative={replaceIngredientWithAlternative}
                        toggleIngredientOpen={toggleIngredientOpen}
                        toggleIngredientMark={toggleIngredientMark}
                        updateIngredientAmount={updateIngredientAmount}
                        updateIngredientUnit={updateIngredientUnit}
                        updateAltIngredientAmount={updateAltIngredientAmount}
                        updateAltIngredientUnit={updateAltIngredientUnit}
                    />

                    <div className={styles.recipePageBlockTitle}>
                        {"DIRECTIONS"}
                    </div>

                    <DirectionsBlock
                        isReadOnly={!isEdit}
                        newDirection={newDirection}
                        directions={directions}
                        ingredients={ingredients}
                        removeDirection={removeDirection}
                        removeSubDirection={removeSubDirection}
                        toggleDirectionOpen={toggleDirectionOpen}
                        toggleDirectionMark={toggleDirectionMark}
                        toggleSubDirectionMark={toggleSubDirectionMark}
                        updateSubDirectionNote={updateSubDirectionNote}
                        updateSubDirectionIngredientAmount={updateSubDirectionIngredientAmount}
                        updateSubDirectionIngredientUnit={updateSubDirectionIngredientUnit}
                        createSubDirectionIngredient={createSubDirectionIngredient}
                        createSubDirection={createSubDirection}
                        updateNewSubDirectionType={updateNewSubDirectionType}
                        updateDirectionStepNumber={updateDirectionStepNumber}
                        updateDirectionName={updateDirectionName}
                        updateDirectionTemperatureCount={updateDirectionTemperatureCount}
                        updateDirectionTemperatureUnit={updateDirectionTemperatureUnit}
                        updateDirectionTimeCount={updateDirectionTimeCount}
                        updateDirectionTimeUnit={updateDirectionTimeUnit}
                        updateNewDirectionStepNumber={updateNewDirectionStepNumber}
                        updateNewDirectionName={updateNewDirectionName}
                        updateNewDirectionTemperatureCount={updateNewDirectionTemperatureCount}
                        updateNewDirectionTemperatureUnit={updateNewDirectionTemperatureUnit}
                        updateNewDirectionTimeCount={updateNewDirectionTimeCount}
                        updateNewDirectionTimeUnit={updateNewDirectionTimeUnit}
                        createDirection={createDirection}
                    />

                    <div className={styles.recipePageBlockTitle}>
                        {"DETAILED NUTRITION INFORMATION"}
                    </div>

                    <PageDetailedNutritionFactsBlock
                        isReadOnly={true}
                        nutritionFactValues={{}}
                        nutritionFactInputs={{}}
                    />

                </div>
                
            </div>
        );
    }
}


const mapStateToProps = (state: AppState): StateToProps => ({
    recipeItem: state.recipePage,
    search: state.searchPage,
});

const mapDispatchToProps: DispatchToProps = {
    updateName,
    updateBrand,
    updateSubtitle,
    updateDescription,
    updateIngredients,
    requestIngredients,
    removeDirection,
    removeSubDirection,
    toggleDirectionOpen,
    toggleDirectionMark,
    toggleSubDirectionMark,
    updateSubDirectionNote,
    updateSubDirectionIngredientAmount,
    updateSubDirectionIngredientUnit,
    createSubDirectionIngredient,
    createSubDirection,
    updateNewSubDirectionType,
    updateDirectionStepNumber,
    updateDirectionName,
    updateDirectionTemperatureCount,
    updateDirectionTemperatureUnit,
    updateDirectionTimeCount,
    updateDirectionTimeUnit,
    updateNewDirectionStepNumber,
    updateNewDirectionName,
    updateNewDirectionTemperatureCount,
    updateNewDirectionTemperatureUnit,
    updateNewDirectionTimeCount,
    updateNewDirectionTimeUnit,
    createDirection,

    removeIngredient,
    removeAltIngredient,
    replaceIngredientWithAlternative,
    toggleIngredientOpen,
    toggleIngredientMark,
    updateIngredientAmount,
    updateIngredientUnit,
    updateAltIngredientAmount,
    updateAltIngredientUnit,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipePage);
