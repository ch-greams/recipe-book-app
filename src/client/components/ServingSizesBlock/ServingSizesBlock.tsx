import React, { useState } from "react";
import { AnyAction } from "redux";

import { InputChangeCallback } from "@common/typings";
import { CustomUnitInput, WeightUnit } from "@common/units";
import Utils from "@common/utils";
import IconAdd from "@client/icons/add-sharp.svg";
import IconWrapper from "@client/icons/IconWrapper";

import CustomUnitLine from "./CustomUnitLine";

import styles from "./ServingSizesBlock.scss";



interface Props {
    customUnitInputs: CustomUnitInput[];
    updateCustomUnits: (customUnits: CustomUnitInput[]) => AnyAction;
}

const ServingSizesBlock: React.FC<Props> = ({ customUnitInputs, updateCustomUnits }) => {

    const [ newCustomUnit, setNewCustomUnit ] = useState<CustomUnitInput>({ name: "", amount: "100", unit: WeightUnit.g });

    const updateNewItemName: InputChangeCallback = (event) => setNewCustomUnit({ ...newCustomUnit, name: event.target.value });

    const updateNewItemAmount: InputChangeCallback = (event) => {
        setNewCustomUnit({
            ...newCustomUnit,
            amount: Utils.decimalNormalizer(event.target.value, newCustomUnit.amount),
        });
    };

    return (
        <div className={styles.customUnitsBlock}>

            <div className={styles.customUnitsBlockLabel}>
                {"CUSTOM UNITS"}
            </div>

            {customUnitInputs.map((customUnit) => {
            
                const updateItemName: InputChangeCallback = (event) => {
                    updateCustomUnits(
                        customUnitInputs.map((customUnitInput) => (
                            (customUnitInput.name === customUnit.name)
                                ? { ...customUnitInput, name: event.target.value }
                                : customUnitInput
                        ))
                    );
                };
            
                const updateItemAmount: InputChangeCallback = (event) => {
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
                };
                
                return (
                    <CustomUnitLine
                        key={`CU_${customUnit.name}`}
                        customUnit={customUnit}
                        updateItemName={updateItemName}
                        updateItemAmount={updateItemAmount}    
                    >

                        <IconWrapper
                            isFullWidth={true} width={20} height={20} color={"#00bfa5"}
                            style={{ transform: "rotate(0.125turn)" }}
                            onClick={() => updateCustomUnits(customUnitInputs.filter((cu) => cu.name !== customUnit.name))}
                        >
                            <IconAdd />
                        </IconWrapper>

                    </CustomUnitLine>
                );
            })}

            <CustomUnitLine
                key={"NCU"}
                customUnit={newCustomUnit}
                updateItemName={updateNewItemName}
                updateItemAmount={updateNewItemAmount}
            >

                <IconWrapper
                    isFullWidth={true} width={20} height={20} color={"#00bfa5"}
                    onClick={() => {
                        const isUniqueName = !customUnitInputs.some((cu) => cu.name === newCustomUnit.name);
                
                        if (isUniqueName && !Utils.isEmptyString(newCustomUnit.name)) {
                
                            updateCustomUnits([ ...customUnitInputs, newCustomUnit ]);
                    
                            setNewCustomUnit({ name: "", amount: "100", unit: WeightUnit.g });
                        }
                        else {
                            console.log("Custom Unit name is empty or already exist");
                        }
                    }}
                >
                    <IconAdd />
                </IconWrapper>

            </CustomUnitLine>

        </div>
    );
};

ServingSizesBlock.displayName = "ServingSizesBlock";

export default ServingSizesBlock;
