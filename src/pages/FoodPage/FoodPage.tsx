import React, { Component } from "react";
import { connect } from "react-redux";
import { FoodItem } from "../../store/food/types";
import { updateName } from "../../store/food/actions";
import { AppState } from "../../store";
import IconAdd from "../../icons/add-sharp.svg";
import styles from "./FoodPage.scss";
import { UnitEnergy, UnitVolume, UnitWeight } from "../../common/units";
import { Nutrient, NutrientType } from "../../common/nutrients";



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

    private getNutrientLine(nutrient: {
        type: string;
        amount: number;
        unit: string;
        dv: number;
        isFraction: boolean;
    }): JSX.Element {

        return (

            <div
                className={nutrient.isFraction ? styles.subNutrientLine : styles.nutrientLine}
                key={nutrient.type}
            >

                <span className={styles.nutrientName}>
                    {nutrient.type}
                </span>

                <input
                    type={"text"}
                    className={styles.nutrientAmount}
                    value={nutrient.amount}
                    onChange={console.log}
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

    private getNutritionInfoBlock(nutrients: Dictionary<Nutrient>, featuredNutrients: NutrientType[]): JSX.Element {

        return (

            <div className={styles.nutritionInfoBlock}>

                <div className={styles.nutritionInfoBlockTitle}>
                    {"NUTRITION INFORMATION"}
                </div>


                { this.getNutrientLine({
                    type: "Energy",
                    amount: this.props.foodItem.energy,
                    unit: UnitEnergy.kcal,
                    dv: 28,
                    isFraction: false,
                }) }

                { featuredNutrients.map( (nutrientType) => this.getNutrientLine(nutrients[nutrientType]) ) }

            </div>
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
                        
                        {this.getNutritionInfoBlock(nutrients, featuredNutrients)}

                    </div>

                    {/* Detailed Nutrient Information  */}

                    <div className={styles.detailedNutritionInfoBlock}>

                        <div className={styles.detailedNutritionInfoTitle}>
                            {"DETAILED NUTRITION INFORMATION"}
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
