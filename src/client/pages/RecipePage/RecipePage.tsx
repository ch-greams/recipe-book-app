import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";

import { NutritionFactType } from "@common/nutritionFacts";
import type { Dictionary } from "@common/typings";
import { Units, VolumeUnit, WeightUnit } from "@common/units";
import Utils from "@common/utils";
import CustomUnitsBlock from "@client/components/CustomUnitsBlock/CustomUnitsBlock";
import DirectionsBlock from "@client/components/DirectionsBlock/DirectionsBlock";
import IngredientsBlock from "@client/components/IngredientsBlock/IngredientsBlock";
import Loader from "@client/components/Loader/Loader";
import NutritionFactsBlock from "@client/components/NutritionFactsBlock/NutritionFactsBlock";
import PageDetailedNutritionFactsBlock from "@client/components/PageDetailedNutritionFactsBlock/PageDetailedNutritionFactsBlock";
import PageTitleBlock from "@client/components/PageTitleBlock/PageTitleBlock";
import SelectInput, { SelectInputType } from "@client/components/SelectInput/SelectInput";
import { AppState } from "@client/store";
import * as actions from "@client/store/recipe/actions";
import { RecipePageStore } from "@client/store/recipe/types";
import { requestIngredients } from "@client/store/search/actions";
import { SearchPageStore } from "@client/store/search/types";

import styles from "./RecipePage.scss";



interface StateToProps {
    recipeItem: RecipePageStore;
    search: SearchPageStore;
}

interface DispatchToProps {
    updateType: typeof actions.updateType;
    updateServingSizeAmount: typeof actions.updateServingSizeAmount;
    updateServingSizeUnit: typeof actions.updateServingSizeUnit;

    requestIngredients: typeof requestIngredients;
    removeDirection: typeof actions.removeDirection;
    removeSubDirection: typeof actions.removeSubDirection;
    toggleDirectionOpen: typeof actions.toggleDirectionOpen;
    toggleDirectionMark: typeof actions.toggleDirectionMark;
    toggleSubDirectionMark: typeof actions.toggleSubDirectionMark;
    updateSubDirectionNote: typeof actions.updateSubDirectionNote;
    updateSubDirectionIngredientAmount: typeof actions.updateSubDirectionIngredientAmount;
    updateSubDirectionIngredientUnit: typeof actions.updateSubDirectionIngredientUnit;
    createSubDirectionIngredient: typeof actions.createSubDirectionIngredient;
    createSubDirection: typeof actions.createSubDirection;
    updateNewSubDirectionType: typeof actions.updateNewSubDirectionType;
    updateDirectionStepNumber: typeof actions.updateDirectionStepNumber;
    updateDirectionName: typeof actions.updateDirectionName;
    updateDirectionTemperatureCount: typeof actions.updateDirectionTemperatureCount;
    updateDirectionTemperatureUnit: typeof actions.updateDirectionTemperatureUnit;
    updateDirectionTimeCount: typeof actions.updateDirectionTimeCount;
    updateDirectionTimeUnit: typeof actions.updateDirectionTimeUnit;
    updateNewDirectionStepNumber: typeof actions.updateNewDirectionStepNumber;
    updateNewDirectionName: typeof actions.updateNewDirectionName;
    updateNewDirectionTemperatureCount: typeof actions.updateNewDirectionTemperatureCount;
    updateNewDirectionTemperatureUnit: typeof actions.updateNewDirectionTemperatureUnit;
    updateNewDirectionTimeCount: typeof actions.updateNewDirectionTimeCount;
    updateNewDirectionTimeUnit: typeof actions.updateNewDirectionTimeUnit;
    createDirection: typeof actions.createDirection;

    requestRecipeItem: typeof actions.fetchRecipeItemRequest;
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

    private getParametersBlock = (): JSX.Element => {

        const { recipeItem } = this.props;

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
                        type={SelectInputType.Other}
                        options={Object.values(Units)}
                        value={recipeItem.servingSizeUnit}
                        onChange={this.handleServingSizeUnitEdit}
                    />

                </div>

                <div className={styles.separator} />

                <CustomUnitsBlock
                    customUnitInputs={recipeItem.customUnitInputs}
                    addCustomUnitRequest={actions.addCustomUnitRequest}
                    removeCustomUnitRequest={actions.removeCustomUnitRequest}
                    updateCustomUnitRequest={actions.updateCustomUnitRequest}
                />

            </div>
        );
    };

    private getGeneralInfoBlock = (
        nutritionFacts: Dictionary<NutritionFactType, number>,
        nutritionFactInputs: Dictionary<NutritionFactType, string>,
    ): JSX.Element => {

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

                {this.getParametersBlock()}

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
                        updateName={actions.updateName}
                        updateBrand={actions.updateBrand}
                        updateSubtitle={actions.updateSubtitle}
                        updateDescription={actions.updateDescription}
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
    updateType: actions.updateType,
    updateServingSizeAmount: actions.updateServingSizeAmount,
    updateServingSizeUnit: actions.updateServingSizeUnit,

    requestIngredients,
    removeDirection: actions.removeDirection,
    removeSubDirection: actions.removeSubDirection,
    toggleDirectionOpen: actions.toggleDirectionOpen,
    toggleDirectionMark: actions.toggleDirectionMark,
    toggleSubDirectionMark: actions.toggleSubDirectionMark,
    updateSubDirectionNote: actions.updateSubDirectionNote,
    updateSubDirectionIngredientAmount: actions.updateSubDirectionIngredientAmount,
    updateSubDirectionIngredientUnit: actions.updateSubDirectionIngredientUnit,
    createSubDirectionIngredient: actions.createSubDirectionIngredient,
    createSubDirection: actions.createSubDirection,
    updateNewSubDirectionType: actions.updateNewSubDirectionType,
    updateDirectionStepNumber: actions.updateDirectionStepNumber,
    updateDirectionName: actions.updateDirectionName,
    updateDirectionTemperatureCount: actions.updateDirectionTemperatureCount,
    updateDirectionTemperatureUnit: actions.updateDirectionTemperatureUnit,
    updateDirectionTimeCount: actions.updateDirectionTimeCount,
    updateDirectionTimeUnit: actions.updateDirectionTimeUnit,
    updateNewDirectionStepNumber: actions.updateNewDirectionStepNumber,
    updateNewDirectionName: actions.updateNewDirectionName,
    updateNewDirectionTemperatureCount: actions.updateNewDirectionTemperatureCount,
    updateNewDirectionTemperatureUnit: actions.updateNewDirectionTemperatureUnit,
    updateNewDirectionTimeCount: actions.updateNewDirectionTimeCount,
    updateNewDirectionTimeUnit: actions.updateNewDirectionTimeUnit,
    createDirection: actions.createDirection,

    requestRecipeItem: actions.fetchRecipeItemRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipePage);
