import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";

import { Units, VolumeUnit, WeightUnit } from "@common/units";
import Utils from "@common/utils";
import CustomUnitsBlock from "@client/components/CustomUnitsBlock/CustomUnitsBlock";
import Loader from "@client/components/Loader/Loader";
import NutritionFactsBlock from "@client/components/NutritionFactsBlock/NutritionFactsBlock";
import PageDetailedNutritionFactsBlock from "@client/components/PageDetailedNutritionFactsBlock/PageDetailedNutritionFactsBlock";
import PageTitleBlock from "@client/components/PageTitleBlock/PageTitleBlock";
import SelectInput, { SelectInputType } from "@client/components/SelectInput/SelectInput";
import { AppState } from "@client/store";
import * as actions from "@client/store/food/actions";
import { FoodPageStore } from "@client/store/food/types";

import styles from "./FoodPage.scss";



interface StateToProps {
    foodItem: FoodPageStore;
}

interface DispatchToProps {
    updateName: typeof actions.updateName;
    updateBrand: typeof actions.updateBrand;
    updateSubtitle: typeof actions.updateSubtitle;
    requestFoodItem: typeof actions.fetchFoodItemRequest;
    updateServingSize: typeof actions.updateServingSize;
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

    private getParametersBlock(): JSX.Element {

        const { foodItem } = this.props;

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
                        type={SelectInputType.Other}
                        options={Object.keys(WeightUnit)}
                        onChange={console.log}
                        value={foodItem.densityWeight}
                    />

                    {"/"}

                    <SelectInput
                        type={SelectInputType.Other}
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
                        type={SelectInputType.Other}
                        options={[ ...Object.values(Units), ...foodItem.customUnits.map((cu) => cu.name) ]}
                        onChange={this.handleServingSizeUnitEdit}
                    />

                </div>

                <div className={styles.separator} />

                <CustomUnitsBlock
                    customUnitInputs={foodItem.customUnitInputs}
                    addCustomUnitRequest={actions.addCustomUnitRequest}
                    removeCustomUnitRequest={actions.removeCustomUnitRequest}
                    updateCustomUnitRequest={actions.updateCustomUnitRequest}
                />

            </div>
        );
    }


    public render(): JSX.Element {
        
        const {
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

                        {this.getParametersBlock()}

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
    updateName: actions.updateName,
    updateBrand: actions.updateBrand,
    updateSubtitle: actions.updateSubtitle,
    requestFoodItem: actions.fetchFoodItemRequest,
    updateServingSize: actions.updateServingSize,
};

export default connect(mapStateToProps, mapDispatchToProps)(FoodPage);
