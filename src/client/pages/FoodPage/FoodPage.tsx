import React, { Component } from "react";
import { connect } from "react-redux";
import { FoodPageStore } from "../../store/food/types";
import { requestFoodItem, updateName } from "../../store/food/actions";
import { AppState } from "../../store";
import IconAdd from "../../icons/add-sharp.svg";
import styles from "./FoodPage.scss";
import { UnitVolume, UnitWeight } from "../../../common/units";
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



export interface CustomUnit {

    name: string;
    amount: number;
    unit: UnitWeight;
}


interface FoodPageOwnProps {
    foodId: string;
}

interface FoodPageStateToProps {
    foodItem: FoodPageStore;
}

interface FoodPageDispatchToProps {
    updateName: typeof updateName;
    requestFoodItem: typeof requestFoodItem;
}

interface FoodPageProps extends FoodPageOwnProps, FoodPageStateToProps, FoodPageDispatchToProps { }

export interface FoodPageState {
    isTitleInputsOpen: boolean;

    nameInput: string;
    brandInput: string;
    descriptionInput: string;

    customUnits: CustomUnit[];

    // TODO: Remove placeholder later
    amount: number;
}

class FoodPage extends Component<FoodPageProps, FoodPageState> {

    public constructor(props: FoodPageProps) {
        super(props);
        
        this.state = {
            isTitleInputsOpen: false,

            nameInput: this.props.foodItem.name,
            brandInput: this.props.foodItem.brand,
            descriptionInput: this.props.foodItem.description,

            customUnits: [
                { name: "piece", amount: 53, unit: UnitWeight.g },
                { name: "container", amount: 127, unit: UnitWeight.g }
            ],
            
            amount: 0,
        };
    }

    public componentDidMount(): void {

        this.props.requestFoodItem(this.props.foodId);
    }

    // NOTE: Input handles

    private editTitle(): void {

        this.setState({ isTitleInputsOpen: true });
    }

    private confirmTitle(): void {

        this.setState({ isTitleInputsOpen: false });
    }


    private handleNameEdit(event: React.ChangeEvent<HTMLInputElement>): void {

        this.setState({ nameInput: (event.target.value || "").toUpperCase() });
    }

    private handleBrandEdit(event: React.ChangeEvent<HTMLInputElement>): void {

        this.setState({ brandInput: (event.target.value || "").toUpperCase() });
    }

    private handleDescriptionEdit(event: React.ChangeEvent<HTMLInputElement>): void {

        this.setState({ descriptionInput: (event.target.value || "").toUpperCase() });
    }

    // NOTE: Elements

    private getTitleBlock(name: string, brand: string, description: string): JSX.Element {

        const titleBlockStatic = (

            <div
                className={styles.titleBlock}
                onClick={this.editTitle.bind(this)}
            >

                <div className={styles.nameBlock}>

                    <div className={styles.nameText}>
                        {name.toUpperCase()}
                    </div>

                    <div className={styles.brandText}>
                        {brand.toUpperCase()}
                    </div>
                    
                </div>

                <div className={styles.descriptionBlock}>

                    <div className={styles.descriptionText}>
                        {description.toUpperCase()}
                    </div>
                </div>

            </div>
        );

        const titleBlockInput = (

            <div className={styles.titleBlock}>

                <div className={styles.nameBlock}>

                    <input
                        type={"text"}
                        className={styles.nameInput}
                        placeholder={"NAME"}
                        value={name.toUpperCase()}
                        onChange={this.handleNameEdit.bind(this)}
                    />

                    <input
                        type={"text"}
                        className={styles.brandInput}
                        placeholder={"BRAND"}
                        value={brand.toUpperCase()}
                        onChange={this.handleBrandEdit.bind(this)}
                    />
                    
                </div>

                <div className={styles.descriptionBlock}>

                    <input
                        type={"text"}
                        className={styles.descriptionInput}
                        placeholder={"DESCRIPTION"}
                        value={description.toUpperCase()}
                        onChange={this.handleDescriptionEdit.bind(this)}
                    />

                    <div
                        className={styles.confirmButton}
                        onClick={this.confirmTitle.bind(this)}
                    >
                        {"CONFIRM"}
                    </div>
                </div>
            </div>
        );
        
        return ( this.state.isTitleInputsOpen ? titleBlockInput : titleBlockStatic );
    }

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

    private getCustomUnitLine(customUnit: CustomUnit): JSX.Element {

        return (
            <div
                key={customUnit.name}
                className={styles.customUnitLine}
            >

                <div>

                    <input
                        type={"text"}
                        className={styles.customUnitLineName}
                        value={customUnit.name}
                        onChange={console.log}
                    />

                    {"="}

                    <input
                        type={"text"}
                        className={styles.customUnitLineAmount}
                        value={customUnit.amount}
                        onChange={console.log}
                    />

                    {this.getSelect( Object.keys(UnitWeight) )}

                </div>


                {/* {customUnit.unit} */}

                <div className={styles.customUnitLineButton}>
                    {(
                        (customUnit.name !== "")
                            ? <IconAdd width={20} height={20} style={{ transform: "rotate(0.125turn)" }} />
                            : <IconAdd width={20} height={20} />
                    )}
                </div>

            </div>
        );
    }

    private getParametersBlock(): JSX.Element {

        const { customUnits } = this.state;

        return (
            
            <div className={styles.parametersBlock}>

                <div className={styles.typeSelect}>

                    <div className={styles.typeSelectLabel}>
                        {"TYPE"}
                    </div>

                    <input
                        type={"text"}
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

                    {customUnits.map( this.getCustomUnitLine.bind(this) )}

                    {this.getCustomUnitLine({ name: "", amount: 100, unit: UnitWeight.g })}

                </div>

            </div>
        );
    }


    private getNutritionFacts(nutrientTypes: NutritionFactType[], nutrients: Dictionary<NutritionFactType, number>): NutritionFact[] {

        return nutrientTypes.reduce<NutritionFact[]>(
            (previousNutritionFacts, currentNutrientType) => {

                const amount = nutrients[currentNutrientType];
                const nutrientDescription = NUTRITION_FACT_DESCRIPTIONS[currentNutrientType];

                return [
                    ...previousNutritionFacts,
                    {
                        type: currentNutrientType,
                        amount: amount,
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
        
        const { name, brand, description, nutritionFactValues, featuredNutritionFacts } = this.props.foodItem;

        if (!this.props.foodItem.isLoaded) {
            return (<h1>LOADING</h1>);
        }

        return (
            <div className={styles.foodPage}>

                <div className={styles.foodPageElements}>

                    {/* Title Block */}

                    {this.getTitleBlock(name, brand, description)}

                    {/* Main Block */}

                    <div className={styles.mainBlock}>

                        {this.getParametersBlock()}

                        <div className={styles.featuredNutritionFacts}>

                            <NutritionFactsBlock
                                title={"NUTRITION FACTS"}
                                nutritionFacts={this.getNutritionFacts(featuredNutritionFacts, nutritionFactValues)}
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
                                    nutritionFacts={this.getNutritionFacts(CARBOHYDRATES_GROUP, nutritionFactValues)}
                                />

                                <NutritionFactsBlock
                                    title={NutrientGroupType.Lipids}
                                    nutritionFacts={this.getNutritionFacts(LIPIDS_GROUP, nutritionFactValues)}
                                />

                                <NutritionFactsBlock
                                    title={NutrientGroupType.Vitamins}
                                    nutritionFacts={this.getNutritionFacts(VITAMINS_GROUP, nutritionFactValues)}
                                />

                                <NutritionFactsBlock
                                    title={NutrientGroupType.Other}
                                    nutritionFacts={this.getNutritionFacts(OTHER_GROUP, nutritionFactValues)}
                                />
                            </div>

                            <div className={styles.detailedNutritionFactsColumn}>

                                <NutritionFactsBlock
                                    title={NutrientGroupType.Proteins}
                                    nutritionFacts={this.getNutritionFacts(PROTEINS_GROUP, nutritionFactValues)}
                                />

                                <NutritionFactsBlock
                                    title={NutrientGroupType.Minerals}
                                    nutritionFacts={this.getNutritionFacts(MINERALS_GROUP, nutritionFactValues)}
                                />
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        );
    }
}



const mapStateToProps = (state: AppState): FoodPageStateToProps => ({
    foodItem: state.foodPage,
});

const mapDispatchToProps: FoodPageDispatchToProps = {
    updateName,
    requestFoodItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(FoodPage);
