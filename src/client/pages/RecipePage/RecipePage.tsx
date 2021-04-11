import React, { Component } from "react";
import { connect } from "react-redux";
import { RecipePageStore, UpdateCustomUnitsAction } from "@client/store/recipe/types";
import {
    updateName, updateBrand, updateSubtitle, updateDescription, removeDirection,
    removeSubDirection, toggleDirectionOpen, toggleDirectionMark, toggleSubDirectionMark,
    updateSubDirectionNote, updateSubDirectionIngredientAmount, updateSubDirectionIngredientUnit,
    createSubDirectionIngredient, createSubDirection, updateNewSubDirectionType,
    updateDirectionStepNumber, updateDirectionName, updateDirectionTemperatureCount,
    updateDirectionTemperatureUnit, updateDirectionTimeCount, updateDirectionTimeUnit,
    updateNewDirectionStepNumber, updateNewDirectionName, updateNewDirectionTemperatureCount,
    updateNewDirectionTemperatureUnit, updateNewDirectionTimeCount, updateNewDirectionTimeUnit,
    createDirection, removeIngredient, removeAltIngredient, replaceIngredientWithAlternative,
    toggleIngredientOpen, toggleIngredientMark, updateAltIngredientAmount, updateAltIngredientUnit,
    updateIngredientAmount, updateIngredientUnit, updateAltNutritionFacts, addAltIngredient, addIngredient,
    updateServingSizeAmount, updateServingSizeUnit, updateType, updateCustomUnits, requestRecipeItem,
} from "@client/store/recipe/actions";
import { AppState } from "@client/store";
import PageTitleBlock from "@client/components/PageTitleBlock/PageTitleBlock";
import PageDetailedNutritionFactsBlock from "@client/components/PageDetailedNutritionFactsBlock/PageDetailedNutritionFactsBlock";
import SelectInput from "@client/components/SelectInput/SelectInput";
import { CustomUnitInput, Units, VolumeUnit, WeightUnit } from "@common/units";
import NutritionFactsBlock from "@client/components/NutritionFactsBlock/NutritionFactsBlock";
import Utils from "@common/utils";
import { NutritionFactType } from "@common/nutritionFacts";
import ServingSizesBlock from "@client/components/ServingSizesBlock/ServingSizesBlock";
import IngredientsBlock from "@client/components/IngredientsBlock/IngredientsBlock";
import DirectionsBlock from "@client/components/DirectionsBlock/DirectionsBlock";
import styles from "./RecipePage.scss";
import { requestIngredients } from "@client/store/search/actions";
import { SearchPageStore } from "@client/store/search/types";
import { RouteComponentProps } from "react-router-dom";
import Loader from "@client/components/Loader/Loader";
import type { Dictionary } from "@common/typings";



interface StateToProps {
    recipeItem: RecipePageStore;
    search: SearchPageStore;
}

interface DispatchToProps {
    updateName: typeof updateName;
    updateBrand: typeof updateBrand;
    updateSubtitle: typeof updateSubtitle;
    updateDescription: typeof updateDescription;
    updateType: typeof updateType;
    updateServingSizeAmount: typeof updateServingSizeAmount;
    updateServingSizeUnit: typeof updateServingSizeUnit;
    updateCustomUnits: typeof updateCustomUnits;

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
    updateAltNutritionFacts: typeof updateAltNutritionFacts;
    addIngredient: typeof addIngredient;
    addAltIngredient: typeof addAltIngredient;
    requestRecipeItem: typeof requestRecipeItem;
}

interface RecipePageProps extends StateToProps, DispatchToProps, RouteComponentProps<{ recipeId: string }> { }


class RecipePage extends Component<RecipePageProps> {
    public static readonly displayName = "RecipePage";

    public componentDidMount(): void {

        this.props.requestRecipeItem(this.props.match.params.recipeId);

        this.props.requestIngredients();
    }

    // NOTE: Handlers

    private handleTypeEdit = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.updateType(event.target.value);
    };

    private handleServingSizeAmountEdit = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.updateServingSizeAmount(event.target.value);
    };

    private handleServingSizeUnitEdit = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        this.props.updateServingSizeUnit(event.target.value as WeightUnit | VolumeUnit);
    };

    // NOTE: General Information

    private getParametersBlock = (
        recipeItem: RecipePageStore,
        updateCustomUnits: (customUnits: CustomUnitInput[]) => UpdateCustomUnitsAction,
    ): JSX.Element => {

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
                        onChange={this.handleTypeEdit}
                    />

                </div>

                <div className={styles.separator} />

                <div className={styles.servingSizeLine}>
                    
                    <div className={styles.servingSizeLineLabel}>
                        {"SERVING SIZE"}
                    </div>
                    
                    <input
                        type={"text"}
                        value={recipeItem.servingSizeInput}
                        className={styles.servingSizeLineInput}
                        onChange={this.handleServingSizeAmountEdit}
                    />

                    <SelectInput
                        options={Object.values(Units)}
                        value={recipeItem.servingSizeUnit}
                        onChange={this.handleServingSizeUnitEdit}
                    />

                </div>

                <div className={styles.separator} />

                <ServingSizesBlock
                    customUnitInputs={recipeItem.customUnitInputs}
                    updateCustomUnits={updateCustomUnits}
                />

            </div>
        );
    };

    private getGeneralInfoBlock = (
        nutritionFacts: Dictionary<NutritionFactType, number>,
        nutritionFactInputs: Dictionary<NutritionFactType, string>,
    ): JSX.Element => {

        const { recipeItem, updateCustomUnits } = this.props;

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

        return (
            <div className={styles.mainBlock}>

                {this.getParametersBlock(recipeItem, updateCustomUnits)}

                <div className={styles.featuredNutritionFacts}>

                    <NutritionFactsBlock
                        isReadOnly={true}
                        title={"NUTRITION FACTS"}
                        nutritionFacts={Utils.getNutritionFacts(featuredNutritionFacts, nutritionFacts, nutritionFactInputs)}
                    />
                </div>
            </div>
        );
    };

    public render(): JSX.Element {

        const {
            location,
            recipeItem: {
                isLoaded,
                name,
                brand,
                subtitle,
                description,
                ingredients,
                newDirection,
                directions,
                references,
                nutritionFacts,
            },
            search,
            updateName,
            updateBrand,
            updateSubtitle,
            updateDescription,
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
            updateAltNutritionFacts,
            addIngredient,
            addAltIngredient,
        } = this.props;

        const searchParams = new URLSearchParams(location.search);
        const isEdit = ( searchParams.get("edit") === "true" );

        if (!isLoaded) {
            return <Loader />;
        }

        const nutritionFactInputs = Utils.convertNutritionFactValuesIntoInputs(nutritionFacts);

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

                    {this.getGeneralInfoBlock(nutritionFacts, nutritionFactInputs)}

                    <div className={styles.recipePageBlockTitle}>
                        {"INGREDIENTS"}
                    </div>

                    <IngredientsBlock
                        isReadOnly={!isEdit}
                        ingredients={ingredients}
                        references={references}
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
                        updateAltNutritionFacts={updateAltNutritionFacts}
                        addIngredient={addIngredient}
                        addAltIngredient={addAltIngredient}
                    />

                    <div className={styles.recipePageBlockTitle}>
                        {"DIRECTIONS"}
                    </div>

                    <DirectionsBlock
                        isReadOnly={!isEdit}
                        newDirection={newDirection}
                        directions={directions}
                        ingredients={ingredients}
                        references={references}

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
                        nutritionFacts={nutritionFacts}
                        nutritionFactInputs={nutritionFactInputs}
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
    updateType,
    updateCustomUnits,
    updateServingSizeAmount,
    updateServingSizeUnit,

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
    updateAltNutritionFacts,
    addIngredient,
    addAltIngredient,

    requestRecipeItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipePage);
