import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AnyAction } from "redux";

import type { InputChangeCallback } from "@common/typings";
import type { CustomUnitInput, Units } from "@common/units";
import { WeightUnit } from "@common/units";
import Utils from "@common/utils";

import CustomUnitLine from "./custom-unit-line";

import styles from "./custom-units-block.module.scss";



interface Props {
    customUnitInputs: CustomUnitInput[];
    updateCustomUnits?: (customUnits: CustomUnitInput[]) => AnyAction;

    addCustomUnitRequest?: (customUnit: CustomUnitInput) => AnyAction;
    removeCustomUnitRequest?: (index: number) => AnyAction;
    updateCustomUnitRequest?: (index: number, customUnit: CustomUnitInput) => AnyAction;
}

const CustomUnitsBlock: React.FC<Props> = ({
    customUnitInputs,
    addCustomUnitRequest: _addCustomUnitRequest,
    removeCustomUnitRequest: _removeCustomUnitRequest,
    updateCustomUnitRequest: _updateCustomUnitRequest,
}) => {

    const addCustomUnitRequest = Utils.unwrapForced(_addCustomUnitRequest, "addCustomUnitRequest");
    const removeCustomUnitRequest = Utils.unwrapForced(_removeCustomUnitRequest, "removeCustomUnitRequest");
    const updateCustomUnitRequest = Utils.unwrapForced(_updateCustomUnitRequest, "updateCustomUnitRequest");

    const dispatch = useDispatch();
    const [ newCustomUnit, setNewCustomUnit ] = useState<CustomUnitInput>({ name: "", amount: "100", unit: WeightUnit.g });

    const updateNewItemName: InputChangeCallback = (event) => setNewCustomUnit({ ...newCustomUnit, name: event.target.value });

    const updateNewItemAmount: InputChangeCallback = (event) => {
        setNewCustomUnit({
            ...newCustomUnit,
            amount: Utils.decimalNormalizer(event.target.value, newCustomUnit.amount),
        });
    };

    const updateNewItemUnit = (unit: Units): void => setNewCustomUnit({ ...newCustomUnit, unit });

    const createCustomUnit = (): void => {
        dispatch(addCustomUnitRequest(newCustomUnit));
        setNewCustomUnit({ name: "", amount: "100", unit: WeightUnit.g });
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

                const updateItemUnit = (unit: Units): void => {
                    dispatch(updateCustomUnitRequest(index, { ...customUnit, unit }));
                };

                const saveCustomUnit = (): void => {
                    dispatch(removeCustomUnitRequest(index));
                };

                return (
                    <CustomUnitLine
                        key={`CU_${index}`}
                        isNew={false}
                        customUnit={customUnit}
                        updateItemName={updateItemName}
                        updateItemAmount={updateItemAmount}
                        updateItemUnit={updateItemUnit}
                        upsertCustomUnit={saveCustomUnit}
                    />
                );
            })}

            <CustomUnitLine
                key={"NCU"}
                isNew={true}
                customUnit={newCustomUnit}
                updateItemName={updateNewItemName}
                updateItemAmount={updateNewItemAmount}
                updateItemUnit={updateNewItemUnit}
                upsertCustomUnit={createCustomUnit}
            />

        </div>
    );
};

CustomUnitsBlock.displayName = "CustomUnitsBlock";

export default CustomUnitsBlock;
