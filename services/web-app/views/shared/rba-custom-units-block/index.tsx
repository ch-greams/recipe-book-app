import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AnyAction } from "redux";

import type { InputChangeCallback } from "@common/typings";
import type { CustomUnitInput, Units } from "@common/units";
import { WeightUnit } from "@common/units";
import Utils from "@common/utils";
import RbaCustomUnitLine from "@views/shared/rba-custom-unit-line";

import styles from "./rba-custom-units-block.module.scss";



interface Props {
    customUnitInputs: CustomUnitInput[];
    addCustomUnit: (customUnit: CustomUnitInput) => AnyAction;
    removeCustomUnit: (index: number) => AnyAction;
    updateCustomUnit: (index: number, customUnit: CustomUnitInput) => AnyAction;
}

const RbaCustomUnitsBlock: React.FC<Props> = ({
    customUnitInputs,
    addCustomUnit: _addCustomUnit,
    removeCustomUnit: _removeCustomUnit,
    updateCustomUnit: _updateCustomUnit,
}) => {

    const addCustomUnit = Utils.unwrapForced(_addCustomUnit, "addCustomUnit");
    const removeCustomUnit = Utils.unwrapForced(_removeCustomUnit, "removeCustomUnit");
    const updateCustomUnit = Utils.unwrapForced(_updateCustomUnit, "updateCustomUnit");

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
        dispatch(addCustomUnit(newCustomUnit));
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
                    dispatch(updateCustomUnit(index, { ...customUnit, name }));
                };

                const updateItemAmount: InputChangeCallback = (event) => {
                    const amount = Utils.decimalNormalizer(event.target.value, customUnit.amount);
                    dispatch(updateCustomUnit(index, { ...customUnit, amount }));
                };

                const updateItemUnit = (unit: Units): void => {
                    dispatch(updateCustomUnit(index, { ...customUnit, unit }));
                };

                const saveCustomUnit = (): void => {
                    dispatch(removeCustomUnit(index));
                };

                return (
                    <RbaCustomUnitLine
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

            <RbaCustomUnitLine
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

RbaCustomUnitsBlock.displayName = "RbaCustomUnitsBlock";

export default RbaCustomUnitsBlock;
