import React, { useState } from "react";
import { AnyAction } from "redux";

import { CustomUnitInput, WeightUnit } from "@common/units";
import Utils from "@common/utils";
import SelectInput, { SelectInputType } from "@client/components/SelectInput/SelectInput";
import IconAdd from "@client/icons/add-sharp.svg";
import IconWrapper from "@client/icons/IconWrapper";

import styles from "./ServingSizesBlock.scss";



interface Props {
    customUnitInputs: CustomUnitInput[];
    updateCustomUnits: (customUnits: CustomUnitInput[]) => AnyAction;
}

interface NewProps extends Props {
    customUnit: CustomUnitInput;
}

const NewCustomUnitLine: React.FC<Props> = ({ customUnitInputs, updateCustomUnits }) => {

    const [ customUnit, setCustomUnit ] = useState<CustomUnitInput>({ name: "", amount: "100", unit: WeightUnit.g });

    return (
        <div className={styles.customUnitLine}>

            <div className={styles.customUnitLineButton}>
                <IconWrapper
                    isFullWidth={true} width={20} height={20} color={"#00bfa5"}
                    onClick={() => {
                        const isUniqueName = !customUnitInputs.some((cu) => cu.name === customUnit.name);
                
                        if (isUniqueName && !Utils.isEmptyString(customUnit.name)) {
                
                            updateCustomUnits([ ...customUnitInputs, customUnit ]);
                    
                            setCustomUnit({ name: "", amount: "100", unit: WeightUnit.g });
                        }
                        else {
                            console.log("Custom Unit name is empty or already exist");
                        }
                    }}
                >
                    <IconAdd />
                </IconWrapper>
            </div>

            <div className={styles.customUnitLineInfo}>

                <input
                    type={"text"}
                    placeholder={"NAME"}
                    className={styles.customUnitLineName}
                    value={customUnit.name}
                    onChange={(event) => setCustomUnit({ ...customUnit, name: event.target.value })}
                />

                <div className={styles.customUnitLineEqualSign}>{"="}</div>

                <div className={styles.customUnitLineMeasure}>

                    <input
                        type={"text"}
                        placeholder={"#"}
                        className={styles.customUnitLineAmount}
                        value={customUnit.amount}
                        onChange={(event) => {
                            setCustomUnit({
                                ...customUnit,
                                amount: Utils.decimalNormalizer(event.target.value, customUnit.amount),
                            });
                        }}
                    />

                    <SelectInput
                        type={SelectInputType.CustomUnit}
                        options={Object.keys(WeightUnit)}
                        onChange={console.log}
                    />
                </div>
            </div>

        </div>
    );
};

NewCustomUnitLine.displayName = "NewCustomUnitLine";

const CustomUnitLine: React.FC<NewProps> = ({ customUnit, customUnitInputs, updateCustomUnits }) => {

    return (
        <div className={styles.customUnitLine}>

            <div className={styles.customUnitLineButton}>

                <IconWrapper
                    isFullWidth={true} width={20} height={20} color={"#00bfa5"}
                    style={{ transform: "rotate(0.125turn)" }}
                    onClick={() => updateCustomUnits(customUnitInputs.filter((cu) => cu.name !== customUnit.name))}
                >
                    <IconAdd />
                </IconWrapper>
            </div>

            <div className={styles.customUnitLineInfo}>

                <input
                    type={"text"}
                    placeholder={"NAME"}
                    className={styles.customUnitLineName}
                    value={customUnit.name}
                    onChange={(event) => {
                        updateCustomUnits(
                            customUnitInputs.map((customUnitInput) => (
                                (customUnitInput.name === customUnit.name)
                                    ? { ...customUnitInput, name: event.target.value }
                                    : customUnitInput
                            ))
                        );
                    }}
                />

                <div className={styles.customUnitLineEqualSign}>{"="}</div>

                <div className={styles.customUnitLineMeasure}>

                    <input
                        type={"text"}
                        placeholder={"#"}
                        className={styles.customUnitLineAmount}
                        value={customUnit.amount}
                        onChange={(event) => {
                
                            updateCustomUnits(
                                customUnitInputs.map((customUnitInput) => (
                                    (customUnitInput.name === customUnit.name)
                                        ? {
                                            ...customUnitInput,
                                            amount: Utils.decimalNormalizer(event.target.value, customUnit.amount),
                                        }
                                        : customUnitInput
                                ))
                            );
                        }}
                    />

                    <SelectInput
                        type={SelectInputType.CustomUnit}
                        options={Object.keys(WeightUnit)}
                        onChange={console.log}
                    />
                </div>
            </div>

        </div>
    );
};

CustomUnitLine.displayName = "CustomUnitLine";


const ServingSizesBlock: React.FC<Props> = ({ customUnitInputs, updateCustomUnits }) => {

    return (
        <div className={styles.customUnitsBlock}>

            <div className={styles.customUnitsBlockLabel}>
                {"CUSTOM UNITS"}
            </div>

            {customUnitInputs.map((customUnit) => (
                <CustomUnitLine
                    key={`CU_${customUnit.name}`}
                    customUnit={customUnit}
                    customUnitInputs={customUnitInputs}
                    updateCustomUnits={updateCustomUnits}
                />
            ))}

            <NewCustomUnitLine
                key={"NCU"}
                customUnitInputs={customUnitInputs}
                updateCustomUnits={updateCustomUnits}
            />

        </div>
    );
};

ServingSizesBlock.displayName = "ServingSizesBlock";

export default ServingSizesBlock;
