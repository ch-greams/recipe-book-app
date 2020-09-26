import React, { Component } from "react";
import { AnyAction } from "redux";
import { CustomUnitInput, UnitWeight } from "../../../common/units";
import IconAdd from "../../icons/add-sharp.svg";
import styles from "./ServingSizesBlock.scss";



interface Props {
    customUnitInputs: CustomUnitInput[];
    updateCustomUnits: (customUnits: CustomUnitInput[]) => AnyAction;
}
interface State {
    newCustomUnit: CustomUnitInput;
}

export default class ServingSizesBlock extends Component<Props, State> {

    public state = {
        newCustomUnit: { name: "", amount: "100", unit: UnitWeight.g },
    };

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

    private createCustomUnits(customUnit: CustomUnitInput): void {

        const { customUnitInputs, updateCustomUnits } = this.props;

        const isUniqueName = !customUnitInputs.some((cu) => cu.name === customUnit.name);
        const isEmpty = !customUnit.name;

        if (isUniqueName && !isEmpty) {

            updateCustomUnits([ ...customUnitInputs, customUnit ]);
    
            this.setState({ newCustomUnit: { name: "", amount: "100", unit: UnitWeight.g } });
        }
        else {
            console.log("Custom Unit name is empty or already exist");
        }
    }
    private deleteCustomUnits(name: string): void {

        const { customUnitInputs, updateCustomUnits } = this.props;

        updateCustomUnits(customUnitInputs.filter((cu) => cu.name !== name));
    }

    private handleCustomUnitNameEdit(
        customUnit: CustomUnitInput,
        isNew: boolean,
    ): (event: React.ChangeEvent<HTMLInputElement>) => void {

        const { customUnitInputs, updateCustomUnits } = this.props;
        const { newCustomUnit } = this.state;

        return (event: React.ChangeEvent<HTMLInputElement>) => {
            if (isNew) {
                this.setState({
                    newCustomUnit: { ...newCustomUnit, name: event.target.value }
                });
            }
            else {
                updateCustomUnits(
                    customUnitInputs.map(
                        (cu) => (cu.name === customUnit.name) ? { ...cu, name: event.target.value } : cu
                    )
                );
            }
        };
    }
    private handleCustomUnitAmountEdit(
        customUnit: CustomUnitInput,
        isNew: boolean,
    ): (event: React.ChangeEvent<HTMLInputElement>) => void {

        const { customUnitInputs, updateCustomUnits } = this.props;
        const { newCustomUnit } = this.state;

        return (event: React.ChangeEvent<HTMLInputElement>) => {
            if (isNew) {
                this.setState({
                    newCustomUnit: { ...newCustomUnit, amount: event.target.value }
                });
            }
            else {
                updateCustomUnits(
                    customUnitInputs.map(
                        (cu) => (cu.name === customUnit.name) ? { ...cu, amount: event.target.value } : cu
                    )
                );
            }
        };
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


    public render(): JSX.Element {

        const { customUnitInputs } = this.props;
        const { newCustomUnit } = this.state;

        return (
            <div className={styles.customUnitsBlock}>

                <div className={styles.customUnitsBlockLabel}>
                    {"CUSTOM UNITS"}
                </div>

                {customUnitInputs.map( (customUnit, index) => this.getCustomUnitLine(`CU_${index}`, customUnit, false) )}

                {this.getCustomUnitLine("CU", newCustomUnit, true)}

            </div>
        );
    }
}
