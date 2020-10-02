import React, { Component } from "react";
import { AnyAction } from "redux";
import { CustomUnitInput, UnitWeight } from "../../../common/units";
import Utils from "../../../common/utils";
import IconAdd from "../../icons/add-sharp.svg";
import IconWrapper from "../../icons/IconWrapper";
import SelectInput, { SelectInputType } from "../SelectInput/SelectInput";
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
                        (cui) => (cui.name === customUnit.name) ? { ...cui, name: event.target.value } : cui
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

            const amount = Utils.decimalNormalizer(event.target.value, customUnit.amount);

            if (isNew) {
                this.setState({
                    newCustomUnit: { ...newCustomUnit, amount: amount }
                });
            }
            else {
                updateCustomUnits(
                    customUnitInputs.map(
                        (cui) => (cui.name === customUnit.name) ? { ...cui, amount: amount } : cui
                    )
                );
            }
        };
    }

    private getCustomUnitCreateButton(customUnit: CustomUnitInput): JSX.Element {
        return (
            <IconWrapper
                isFullWidth={true} width={"20px"} height={"20px"} color={"#00bfa5"}
                onClick={() => this.createCustomUnits(customUnit)}
            >
                <IconAdd />
            </IconWrapper>
        );
    }

    private getCustomUnitDeleteButton(name: string): JSX.Element {
        return (
            <IconWrapper
                isFullWidth={true} width={"20px"} height={"20px"} color={"#00bfa5"}
                style={{ transform: "rotate(0.125turn)" }}
                onClick={() => this.deleteCustomUnits(name)}
            >
                <IconAdd />
            </IconWrapper>
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

                    <SelectInput
                        type={SelectInputType.CustomUnit}
                        options={Object.keys(UnitWeight)}
                    />

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
