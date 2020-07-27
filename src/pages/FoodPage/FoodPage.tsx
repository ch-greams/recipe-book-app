import React, { Component } from "react";
import { connect } from "react-redux";
import { FoodItem } from "../../store/food/types";
import { updateName } from "../../store/food/actions";
import { AppState } from "../../store";
import IconAdd from "../../icons/add-sharp.svg";
import styles from "./FoodPage.scss";



export enum NutrientType {
    Protein = "Protein",
    Fat = "Fat",
    Carbohydrate = "Carbohydrate",
}


export enum UnitWeight {
    g = "g",
    //mg = "mg",
    //IU = "IU",
    oz = "oz",
}

export enum UnitVolume {
    ml = "ml",
    cup = "cup",
    tbsp = "tbsp",
    tsp = "tsp",
}

export enum Unit {
    g = "g",
}


export interface Nutrient {
    type: NutrientType | string;
    amount: number;
    unit: Unit | string;
    dv: number;
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
                    />

                    {"="}

                    <input
                        type={"text"}
                        className={styles.customUnitLineAmount}
                        value={customUnit.amount}
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
                    />

                </div>

                <div className={styles.separator} />

                <div className={styles.densityLine}>
                    
                    <div className={styles.densityLineLabel}>
                        {"DENSITY"}
                    </div>
                    
                    <input
                        type={"text"}
                        className={styles.densityLineInput}
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

    private getNutrientLine(nutrient: Nutrient): JSX.Element {

        return (
            <div className={styles.nutrientLine}>

                <span className={styles.nutrientName}>
                    {nutrient.type}
                </span>

                <input
                    type={"text"}
                    className={styles.nutrientAmount}
                    value={nutrient.amount}
                />

                <span className={styles.nutrientUnit}>
                    {nutrient.unit}
                </span>

                <span className={styles.nutrientDailyValue}>
                    {nutrient.dv}
                </span>

                <span className={styles.nutrientPercent}>
                    {"%"}
                </span>

            </div>
        );
    }

    private getSubNutrientLine(nutrient: Nutrient): JSX.Element {

        return (
            <div className={styles.subNutrientLine}>

                <span className={styles.nutrientName}>
                    {nutrient.type}
                </span>

                <input
                    type={"text"}
                    className={styles.nutrientAmount}
                    value={nutrient.amount}
                />

                <span className={styles.nutrientUnit}>
                    {nutrient.unit}
                </span>

                <span className={styles.nutrientDailyValue}>
                    {nutrient.dv}
                </span>

                <span className={styles.nutrientPercent}>
                    {"%"}
                </span>

            </div>
        );
    }

    private getNutrientsBlock(nutrients: Dictionary<Nutrient>): JSX.Element {

        return (

            <div className={styles.nutrientsBlock}>

                <div className={styles.nutrientsBlockTitle}>
                    {"NUTRIENTS"}
                </div>

                { this.getNutrientLine({ type: "Energy", amount: this.props.foodItem.energy, unit: "kcal", dv: 28 }) }

                { this.getNutrientLine(nutrients[NutrientType.Protein]) }

                { this.getNutrientLine(nutrients[NutrientType.Fat]) }

                { this.getSubNutrientLine({ type: "Monounsaturated", amount: 24.4, unit: Unit.g, dv: 5 }) }

                { this.getNutrientLine(nutrients[NutrientType.Carbohydrate]) }

                { this.getSubNutrientLine({ type: "Dietary Fiber", amount: 8.5, unit: Unit.g, dv: 34 }) }

                { this.getSubNutrientLine({ type: "Sugars", amount: 4, unit: Unit.g, dv: 0 }) }

                { this.getNutrientLine({ type: "Sodium", amount: 18, unit: "mg", dv: 1 }) }

                { this.getNutrientLine({ type: "Vitamin A", amount: 0, unit: "IU", dv: 0 }) }

                { this.getNutrientLine({ type: "Vitamin C", amount: 0, unit: "mg", dv: 0 }) }

            </div>
        );
    }


    public render(): JSX.Element {
        
        const { nutrients } = this.props.foodItem;

        return (
            <div className={styles.foodPage}>

                <div className={styles.foodPageElements}>

                    {/* Title Block */}

                    {this.getTitleBlock()}

                    {/* Main Block */}

                    <div className={styles.mainBlock}>

                        {this.getParametersBlock()}
                        
                        {this.getNutrientsBlock(nutrients)}

                    </div>

                    {/* Detailed Nutrient Information  */}

                    {/* <div className={styles.separator}></div> */}

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
