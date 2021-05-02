import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";

import { InputChangeCallback } from "@common/typings";
import { CustomUnitInput, WeightUnit } from "@common/units";
import Utils from "@common/utils";
import IconAdd from "@client/icons/add-sharp.svg";
import IconWrapper from "@client/icons/IconWrapper";

import CustomUnitLine from "./CustomUnitLine";

import styles from "./CustomUnitsBlock.scss";



interface Props {
    customUnitInputs: CustomUnitInput[];
    updateCustomUnits?: (customUnits: CustomUnitInput[]) => AnyAction;

    addCustomUnitRequest?: (customUnit: CustomUnitInput) => AnyAction;
    removeCustomUnitRequest?: (index: number) => AnyAction;
    updateCustomUnitRequest?: (index: number, customUnit: CustomUnitInput) => AnyAction;
}

const CustomUnitsBlock: React.FC<Props> = ({
    customUnitInputs,
    addCustomUnitRequest,
    removeCustomUnitRequest,
    updateCustomUnitRequest,
}) => {

    const dispatch = useDispatch();
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

            {customUnitInputs.map((customUnit, index) => {
            
                const updateItemName: InputChangeCallback = (event) => {
                    const name = event.target.value;
                    dispatch(updateCustomUnitRequest(index, { ...customUnit, name }));
                };
            
                const updateItemAmount: InputChangeCallback = (event) => {
                    const amount = Utils.decimalNormalizer(event.target.value, customUnit.amount);
                    dispatch(updateCustomUnitRequest(index, { ...customUnit, amount }));
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
                            onClick={() => dispatch(removeCustomUnitRequest(index))}
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
                        dispatch(addCustomUnitRequest(newCustomUnit));
                        setNewCustomUnit({ name: "", amount: "100", unit: WeightUnit.g });
                    }}
                >
                    <IconAdd />
                </IconWrapper>

            </CustomUnitLine>

        </div>
    );
};

CustomUnitsBlock.displayName = "CustomUnitsBlock";

export default CustomUnitsBlock;