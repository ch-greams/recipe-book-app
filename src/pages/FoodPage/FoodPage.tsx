import React, { Component } from "react";
import { connect } from "react-redux";
import { FoodItem } from "../../store/food/types";
import { updateName } from "../../store/food/actions";
import { AppState } from "../../store";
import IconAdd from "../../icons/add-sharp.svg";
import styles from "./FoodPage.scss";
import { UnitEnergy, UnitVolume, UnitWeight } from "../../common/units";
import {
    CARBOHYDRATES_GROUP,
    LIPIDS_GROUP,
    MINERALS_GROUP,
    NutrientGroupType,
    NutrientType, NUTRIENT_DESCRIPTIONS, OTHER_GROUP, PROTEINS_GROUP, VITAMINS_GROUP,
} from "../../common/nutrients";
import Utils from "../../common/utils";
import { Dictionary } from "../../common/typings";
import NutritionFactsBlock from "../../components/NutritionFactsBlock/NutritionFactsBlock";



export interface NutritionFact {

    amount: number;
    type: NutrientType | "Energy";
    unit: UnitWeight | UnitEnergy;
    dailyValue?: number;
    isFraction: boolean;
}

export interface CustomUnit {

    name: string;
    amount: number;
    unit: UnitWeight;
}


interface FoodPageStateToProps {
    foodItem: FoodItem;
}

interface FoodPageDispatchToProps {
    updateName: typeof updateName;
}

interface FoodPageProps extends FoodPageStateToProps, FoodPageDispatchToProps { }

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

            nameInput: "PEANUTS",
            brandInput: "",
            descriptionInput: "REGULAR OR QUICK COOKING, DRY",

            customUnits: [
                { name: "piece", amount: 53, unit: UnitWeight.g },
                { name: "container", amount: 127, unit: UnitWeight.g }
            ],
            
            amount: 0,
        };
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

    private getTitleBlock(): JSX.Element {

        const { nameInput, brandInput, descriptionInput } = this.state;

        const titleBlockStatic = (

            <div
                className={styles.titleBlock}
                onClick={this.editTitle.bind(this)}
            >

                <div className={styles.nameBlock}>

                    <div className={styles.nameText}>
                        {nameInput}
                    </div>

                    <div className={styles.brandText}>
                        {brandInput}
                    </div>
                    
                </div>

                <div className={styles.descriptionBlock}>

                    <div className={styles.descriptionText}>
                        {descriptionInput}
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
                        value={nameInput}
                        onChange={this.handleNameEdit.bind(this)}
                    />

                    <input
                        type={"text"}
                        className={styles.brandInput}
                        placeholder={"BRAND"}
                        value={brandInput}
                        onChange={this.handleBrandEdit.bind(this)}
                    />
                    
                </div>

                <div className={styles.descriptionBlock}>

                    <input
                        type={"text"}
                        className={styles.descriptionInput}
                        placeholder={"DESCRIPTION"}
                        value={descriptionInput}
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


    private getNutritionFacts(nutrientTypes: NutrientType[], nutrients: Dictionary<NutrientType, number>): NutritionFact[] {

        return nutrientTypes.reduce<NutritionFact[]>(
            (previousNutritionFacts, currentNutrientType) => {

                const amount = nutrients[currentNutrientType];
                const nutrientDescription = NUTRIENT_DESCRIPTIONS[currentNutrientType];

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
        
        const { nutrients, featuredNutrients } = this.props.foodItem;

        return (
            <div className={styles.foodPage}>

                <div className={styles.foodPageElements}>

                    {/* Title Block */}

                    {this.getTitleBlock()}

                    {/* Main Block */}

                    <div className={styles.mainBlock}>

                        {this.getParametersBlock()}

                        <NutritionFactsBlock
                            title={"NUTRITION INFORMATION"}
                            nutritionFacts={[
                                {
                                    type: "Energy",
                                    amount: this.props.foodItem.energy,
                                    unit: UnitEnergy.kcal,
                                    dailyValue: Utils.getDailyValuePercent(this.props.foodItem.energy, Utils.ENERGY_DAILY_VALUE_CALORIES),
                                    isFraction: false,
                                },
                                ...this.getNutritionFacts(featuredNutrients, nutrients),
                            ]}
                        />

                    </div>

                    {/* Detailed Nutrient Information  */}

                    <div className={styles.detailedNutritionInfoBlock}>

                        <div className={styles.detailedNutritionInfoTitle}>
                            {"DETAILED NUTRITION INFORMATION"}
                        </div>

                        <div>
                            {/* LEFT COLUMN */}

                            <NutritionFactsBlock
                                title={NutrientGroupType.Carbohydrates}
                                nutritionFacts={this.getNutritionFacts(CARBOHYDRATES_GROUP, nutrients)}
                            />

                            <NutritionFactsBlock
                                title={NutrientGroupType.Lipids}
                                nutritionFacts={this.getNutritionFacts(LIPIDS_GROUP, nutrients)}
                            />

                            <NutritionFactsBlock
                                title={NutrientGroupType.Vitamins}
                                nutritionFacts={this.getNutritionFacts(VITAMINS_GROUP, nutrients)}
                            />
                        </div>

                        <div>
                            {/* RIGHT COLUMN */}

                            <NutritionFactsBlock
                                title={NutrientGroupType.Proteins}
                                nutritionFacts={this.getNutritionFacts(PROTEINS_GROUP, nutrients)}
                            />

                            <NutritionFactsBlock
                                title={NutrientGroupType.Minerals}
                                nutritionFacts={this.getNutritionFacts(MINERALS_GROUP, nutrients)}
                            />

                            <NutritionFactsBlock
                                title={NutrientGroupType.Other}
                                nutritionFacts={this.getNutritionFacts(OTHER_GROUP, nutrients)}
                            />
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}



const mapStateToProps = (state: AppState): FoodPageStateToProps => ({
    foodItem: state.foodItem,
});

const mapDispatchToProps: FoodPageDispatchToProps = {
    updateName,
};

export default connect(mapStateToProps, mapDispatchToProps)(FoodPage);
