import React, { Component } from "react";
import { connect } from "react-redux";
import { FoodPageStore, UpdateCustomUnitsAction } from "../../store/food/types";
import {
    requestFoodItem, updateName, updateBrand, updateSubtitle, updateCustomUnits, updateServingSize,
} from "../../store/food/actions";
import { AppState } from "../../store";
import { CustomUnitInput, Units, VolumeUnit, WeightUnit } from "../../../common/units";
import NutritionFactsBlock from "../../components/NutritionFactsBlock/NutritionFactsBlock";
import PageTitleBlock from "../../components/PageTitleBlock/PageTitleBlock";
import ServingSizesBlock from "../../components/ServingSizesBlock/ServingSizesBlock";
import SelectInput from "../../components/SelectInput/SelectInput";
import styles from "./FoodPage.scss";
import Utils from "../../../common/utils";
import PageDetailedNutritionFactsBlock from "../../components/PageDetailedNutritionFactsBlock/PageDetailedNutritionFactsBlock";
import { RouteComponentProps } from "react-router-dom";
import Loader from "../../components/Loader/Loader";



interface StateToProps {
    foodItem: FoodPageStore;
}

interface DispatchToProps {
    updateName: typeof updateName;
    updateBrand: typeof updateBrand;
    updateSubtitle: typeof updateSubtitle;
    requestFoodItem: typeof requestFoodItem;
    updateCustomUnits: typeof updateCustomUnits;
    updateServingSize: typeof updateServingSize;
}

interface Props extends StateToProps, DispatchToProps, RouteComponentProps<{ foodId: string }> { }


class FoodPage extends Component<Props> {
    public static readonly displayName = "FoodPage";

    public componentDidMount(): void {
        this.props.requestFoodItem(this.props.match.params.foodId);
    }

    private handleServingSizeAmountEdit = (event: React.ChangeEvent<HTMLInputElement>): void => {

        const { foodItem, updateServingSize } = this.props;

        const amount = Utils.decimalNormalizer(event.target.value, foodItem.servingSizeInput);

        updateServingSize(amount);
    };

    private handleServingSizeUnitEdit = (event: React.ChangeEvent<HTMLSelectElement>): void => {

        // NOTE: Unit or CustomUnit
        console.log(event.target.value);
    };

    private getParametersBlock(
        foodItem: FoodPageStore,
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
                        value={foodItem.type}
                        className={styles.typeSelectInput}
                        onChange={console.log}
                    />

                </div>

                <div className={styles.separator} />

                <div className={styles.densityLine}>
                    
                    {/* BULK DENSITY */}

                    <div
                        className={styles.densityLineLabel}
                        title={"Use Bulk Density for foods like rice or beans"}
                    >
                        {"DENSITY"}
                    </div>
                    
                    <input
                        type={"text"}
                        value={foodItem.density}
                        className={styles.densityLineInput}
                        onChange={console.log}
                    />

                    <SelectInput
                        options={Object.keys(WeightUnit)}
                        onChange={console.log}
                        value={foodItem.densityWeight}
                    />

                    {"/"}

                    <SelectInput
                        options={Object.keys(VolumeUnit)}
                        onChange={console.log}
                        value={foodItem.densityVolume}
                    />

                </div>

                <div className={styles.servingSizeLine}>
                    
                    <div className={styles.servingSizeLineLabel}>
                        {"SERVING SIZE"}
                    </div>
                    
                    <input
                        type={"text"}
                        value={foodItem.servingSize}
                        className={styles.servingSizeLineInput}
                        onChange={this.handleServingSizeAmountEdit}
                    />

                    <SelectInput
                        options={[ ...Object.values(Units), ...foodItem.customUnits.map((cu) => cu.name) ]}
                        onChange={this.handleServingSizeUnitEdit}
                    />

                </div>

                <div className={styles.separator} />

                <ServingSizesBlock
                    customUnitInputs={foodItem.customUnitInputs}
                    updateCustomUnits={updateCustomUnits}
                />

            </div>
        );
    }


    public render(): JSX.Element {
        
        const {
            foodItem,
            foodItem: {
                isLoaded,
                name,
                brand,
                subtitle,
                nutritionFactsByServing,
                nutritionFactsByServingInputs,
                featuredNutritionFacts,
            },
            updateName,
            updateBrand,
            updateSubtitle,
            updateCustomUnits,
        } = this.props;

        if (!isLoaded) {
            return <Loader />;
        }

        return (
            <div className={styles.foodPage}>

                <div className={styles.foodPageElements}>

                    {/* Title Block */}

                    <PageTitleBlock
                        name={name}
                        brand={brand}
                        subtitle={subtitle}
                        updateName={updateName}
                        updateBrand={updateBrand}
                        updateSubtitle={updateSubtitle}
                    />

                    {/* Main Block */}

                    <div className={styles.mainBlock}>

                        {this.getParametersBlock(foodItem, updateCustomUnits)}

                        <div className={styles.featuredNutritionFacts}>

                            <NutritionFactsBlock
                                title={"NUTRITION FACTS"}
                                nutritionFacts={Utils.getNutritionFacts(featuredNutritionFacts, nutritionFactsByServing, nutritionFactsByServingInputs)}
                            />
                        </div>

                    </div>

                    {/* Detailed Nutrition Information  */}

                    <div className={styles.pageBlockTitle}>
                        {"DETAILED NUTRITION INFORMATION"}
                    </div>

                    <PageDetailedNutritionFactsBlock
                        nutritionFacts={nutritionFactsByServing}
                        nutritionFactInputs={nutritionFactsByServingInputs}
                    />

                </div>
            </div>
        );
    }
}



const mapStateToProps = (state: AppState): StateToProps => ({
    foodItem: state.foodPage,
});

const mapDispatchToProps: DispatchToProps = {
    updateName,
    updateBrand,
    updateSubtitle,
    requestFoodItem,
    updateCustomUnits,
    updateServingSize,
};

export default connect(mapStateToProps, mapDispatchToProps)(FoodPage);
