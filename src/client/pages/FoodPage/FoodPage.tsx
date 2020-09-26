import React, { Component } from "react";
import { connect } from "react-redux";
import { FoodPageStore } from "../../store/food/types";
import {
    requestFoodItem,
    updateName,
    updateBrand,
    updateDescription,
    updateCustomUnits,
} from "../../store/food/actions";
import { AppState } from "../../store";
import IconAdd from "../../icons/add-sharp.svg";
import { CustomUnitInput, UnitVolume, UnitWeight } from "../../../common/units";
import {
    CARBOHYDRATES_GROUP,
    LIPIDS_GROUP,
    MINERALS_GROUP,
    OTHER_GROUP,
    PROTEINS_GROUP,
    VITAMINS_GROUP,
    NutrientGroupType,
    NutritionFactType,
} from "../../../common/nutrients";
import NUTRITION_FACT_DESCRIPTIONS from "../../../common/mapping/nutritionFactDescriptions";
import Utils from "../../../common/utils";
import { Dictionary } from "../../../common/typings";
import NutritionFactsBlock, { NutritionFact } from "../../components/NutritionFactsBlock/NutritionFactsBlock";
import styles from "./FoodPage.scss";
import PageItemTitleBlock from "../../components/PageItemTitleBlock/PageItemTitleBlock";



interface OwnProps {
    foodId: string;
}

interface StateToProps {
    foodItem: FoodPageStore;
}

interface DispatchToProps {
    updateName: typeof updateName;
    updateBrand: typeof updateBrand;
    updateDescription: typeof updateDescription;
    requestFoodItem: typeof requestFoodItem;
    updateCustomUnits: typeof updateCustomUnits;
}

interface Props extends OwnProps, StateToProps, DispatchToProps { }

export interface State {
    newCustomUnit: CustomUnitInput;
}

class FoodPage extends Component<Props, State> {

    public state: State = {
        newCustomUnit: { name: "", amount: "100", unit: UnitWeight.g },
    };

    public componentDidMount(): void {

        this.props.requestFoodItem(this.props.foodId);
    }

    // NOTE: Input handles

    private createCustomUnits(customUnit: CustomUnitInput): void {

        const isUniqueName = !this.props.foodItem.customUnitInputs.some((cu) => cu.name === customUnit.name);
        const isEmpty = !customUnit.name;

        if (isUniqueName && !isEmpty) {

            this.props.updateCustomUnits([
                ...this.props.foodItem.customUnitInputs,
                customUnit,
            ]);
    
            this.setState({ newCustomUnit: { name: "", amount: "100", unit: UnitWeight.g } });
        }
        else {
            console.log("Custom Unit name is empty or already exist");
        }
    }
    private deleteCustomUnits(name: string): void {
        this.props.updateCustomUnits(this.props.foodItem.customUnitInputs.filter((cu) => cu.name !== name));
    }

    private handleCustomUnitNameEdit(customUnit: CustomUnitInput, isNew: boolean): (event: React.ChangeEvent<HTMLInputElement>) => void {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            if (isNew) {
                this.setState({
                    newCustomUnit: {
                        ...this.state.newCustomUnit,
                        name: event.target.value,
                    }
                });
            }
            else {
                this.props.updateCustomUnits(
                    this.props.foodItem.customUnitInputs.map(
                        (cu) => (cu.name === customUnit.name) ? { ...cu, name: event.target.value } : cu
                    )
                );
            }
        };
    }
    private handleCustomUnitAmountEdit(customUnit: CustomUnitInput, isNew: boolean): (event: React.ChangeEvent<HTMLInputElement>) => void {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            if (isNew) {
                this.setState({
                    newCustomUnit: {
                        ...this.state.newCustomUnit,
                        amount: event.target.value,
                    }
                });
            }
            else {
                this.props.updateCustomUnits(
                    this.props.foodItem.customUnitInputs.map(
                        (cu) => (cu.name === customUnit.name) ? { ...cu, amount: event.target.value } : cu
                    )
                );
            }
        };
    }

    // NOTE: Elements

    // TODO: Add current value for selected
    private getSelect(options: string[]): JSX.Element {

        return (
            <select className={styles.selectInput}>
                {options.map((option) => (
                    <option value={option} key={option}>
                        {option}
                    </option>
                ))}
            </select>
        );
    }

    private getCustomUnitCreateButton(customUnit: CustomUnitInput): JSX.Element {
        return (
            <IconAdd
                width={20} height={20}
                onClick={() => this.createCustomUnits(customUnit)}
            />
        );
    }

    private getCustomUnitDeleteButton(name: string): JSX.Element {
        return (
            <IconAdd
                width={20} height={20}
                style={{ transform: "rotate(0.125turn)" }}
                onClick={() => this.deleteCustomUnits(name)}
            />
        );
    }

    private getCustomUnitLine(key: string, customUnit: CustomUnitInput, isNew: boolean): JSX.Element {

        const customUnitButton = (
            isNew
                ? this.getCustomUnitCreateButton(customUnit)
                : this.getCustomUnitDeleteButton(customUnit.name)
        );

        return (
            <div
                key={key}
                className={styles.customUnitLine}
            >

                <div>

                    <input
                        type={"text"}
                        placeholder={"NAME"}
                        className={styles.customUnitLineName}
                        value={customUnit.name}
                        onChange={this.handleCustomUnitNameEdit(customUnit, isNew).bind(this)}
                    />

                    {"="}

                    <input
                        type={"text"}
                        placeholder={"#"}
                        className={styles.customUnitLineAmount}
                        value={customUnit.amount}
                        onChange={this.handleCustomUnitAmountEdit(customUnit, isNew).bind(this)}
                    />

                    {this.getSelect( Object.keys(UnitWeight) )}

                </div>

                <div className={styles.customUnitLineButton}>
                    {customUnitButton}
                </div>

            </div>
        );
    }

    private getParametersBlock(): JSX.Element {

        const { customUnitInputs } = this.props.foodItem;
        const { newCustomUnit } = this.state;

        return (
            
            <div className={styles.parametersBlock}>

                <div className={styles.typeSelect}>

                    <div className={styles.typeSelectLabel}>
                        {"TYPE"}
                    </div>

                    <input
                        type={"text"}
                        value={this.props.foodItem.type}
                        className={styles.typeSelectInput}
                        onChange={console.log}
                    />

                </div>

                <div className={styles.separator} />

                <div className={styles.densityLine}>
                    
                    {/* BULK DENSITY */}

                    <div className={styles.densityLineLabel}>
                        {"DENSITY"}
                    </div>
                    
                    <input
                        type={"text"}
                        value={this.props.foodItem.density}
                        className={styles.densityLineInput}
                        onChange={console.log}
                    />

                    {this.getSelect( Object.keys(UnitWeight) )}

                    {"/"}

                    {this.getSelect( Object.keys(UnitVolume) )}

                </div>

                <div className={styles.servingSizeLine}>
                    
                    <div className={styles.servingSizeLineLabel}>
                        {"SERVING SIZE"}
                    </div>
                    
                    <input
                        type={"text"}
                        value={this.props.foodItem.servingSize}
                        className={styles.servingSizeLineInput}
                        onChange={console.log}
                    />

                    {this.getSelect( Object.keys(UnitWeight) )}

                </div>

                <div className={styles.separator} />

                <div className={styles.customUnitsBlock}>

                    <div className={styles.customUnitsBlockLabel}>
                        {"CUSTOM UNITS"}
                    </div>

                    {customUnitInputs.map( (customUnit, index) => this.getCustomUnitLine(`CU_${index}`, customUnit, false) )}

                    {this.getCustomUnitLine("CU", newCustomUnit, true)}

                </div>

            </div>
        );
    }


    private getNutritionFacts(
        nutrientTypes: NutritionFactType[],
        nutrients: Dictionary<NutritionFactType, number>,
        nutrientInputs: Dictionary<NutritionFactType, string>,
    ): NutritionFact[] {

        return nutrientTypes.reduce<NutritionFact[]>(
            (previousNutritionFacts, currentNutrientType) => {

                const amount = nutrients[currentNutrientType];
                const inputValue = nutrientInputs[currentNutrientType];
                const nutrientDescription = NUTRITION_FACT_DESCRIPTIONS[currentNutrientType];

                return [
                    ...previousNutritionFacts,
                    {
                        type: currentNutrientType,
                        amount: amount,
                        inputValue: inputValue,
                        unit: nutrientDescription.unit,
                        dailyValue: Utils.getDailyValuePercent(amount, nutrientDescription.dailyValue),
                        isFraction: nutrientDescription.isFraction,
                    }
                ];
            },
            []
        );
    }

    public render(): JSX.Element {
        
        const {
            foodItem: {
                name,
                brand,
                description,
                nutritionFactValues,
                nutritionFactInputs,
                featuredNutritionFacts,
            },
            updateName,
            updateBrand,
            updateDescription,
        } = this.props;

        if (!this.props.foodItem.isLoaded) {
            return (<h1>LOADING</h1>);
        }

        return (
            <div className={styles.foodPage}>

                <div className={styles.foodPageElements}>

                    {/* Title Block */}

                    <PageItemTitleBlock
                        name={name}
                        brand={brand}
                        description={description}
                        updateName={updateName}
                        updateBrand={updateBrand}
                        updateDescription={updateDescription}
                    />

                    {/* Main Block */}

                    <div className={styles.mainBlock}>

                        {this.getParametersBlock()}

                        <div className={styles.featuredNutritionFacts}>

                            <NutritionFactsBlock
                                title={"NUTRITION FACTS"}
                                nutritionFacts={this.getNutritionFacts(featuredNutritionFacts, nutritionFactValues, nutritionFactInputs)}
                            />
                        </div>

                    </div>

                    {/* Detailed Nutrition Information  */}

                    <div className={styles.detailedNutritionFactsBlock}>

                        <div className={styles.detailedNutritionFactsTitle}>
                            {"DETAILED NUTRITION INFORMATION"}
                        </div>

                        <div className={styles.detailedNutritionFacts}>

                            <div className={styles.detailedNutritionFactsColumn}>

                                <NutritionFactsBlock
                                    title={NutrientGroupType.Carbohydrates}
                                    nutritionFacts={this.getNutritionFacts(CARBOHYDRATES_GROUP, nutritionFactValues, nutritionFactInputs)}
                                />

                                <NutritionFactsBlock
                                    title={NutrientGroupType.Lipids}
                                    nutritionFacts={this.getNutritionFacts(LIPIDS_GROUP, nutritionFactValues, nutritionFactInputs)}
                                />

                                <NutritionFactsBlock
                                    title={NutrientGroupType.Proteins}
                                    nutritionFacts={this.getNutritionFacts(PROTEINS_GROUP, nutritionFactValues, nutritionFactInputs)}
                                />
                            </div>

                            <div className={styles.detailedNutritionFactsColumn}>

                                <NutritionFactsBlock
                                    title={NutrientGroupType.Vitamins}
                                    nutritionFacts={this.getNutritionFacts(VITAMINS_GROUP, nutritionFactValues, nutritionFactInputs)}
                                />

                                <NutritionFactsBlock
                                    title={NutrientGroupType.Minerals}
                                    nutritionFacts={this.getNutritionFacts(MINERALS_GROUP, nutritionFactValues, nutritionFactInputs)}
                                />

                                <NutritionFactsBlock
                                    title={NutrientGroupType.Other}
                                    nutritionFacts={this.getNutritionFacts(OTHER_GROUP, nutritionFactValues, nutritionFactInputs)}
                                />
                            </div>

                        </div>

                    </div>
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
    updateDescription,
    requestFoodItem,
    updateCustomUnits,
};

export default connect(mapStateToProps, mapDispatchToProps)(FoodPage);
