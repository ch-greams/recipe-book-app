import React, { Component } from "react";
import { connect } from "react-redux";
import { RecipePageStore } from "../../store/recipe/types";
import { updateName, updateBrand, updateSubtitle } from "../../store/recipe/actions";
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
            recipeItem, recipeItem: { isReadOnly },
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
                        isReadOnly={isReadOnly}
                        title={"NUTRITION FACTS"}
                        nutritionFacts={Utils.getNutritionFacts(featuredNutritionFacts, {}, {})}
                    />
                </div>
            </div>
        );
    }

    public render(): JSX.Element {

        const {
            recipeItem: {
                isReadOnly,
                name,
                brand,
                subtitle,
                description,
                ingredients,
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

                    <IngredientsBlock
                        isReadOnly={isReadOnly}
                        ingredients={ingredients}
                    />

                    <div className={styles.recipePageBlockTitle}>
                        {"DIRECTIONS"}
                    </div>

                    <DirectionsBlock isReadOnly={isReadOnly} />

                    <div className={styles.recipePageBlockTitle}>
                        {"DETAILED NUTRITION INFORMATION"}
                    </div>

                    <PageDetailedNutritionFactsBlock
                        isReadOnly={isReadOnly}
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
