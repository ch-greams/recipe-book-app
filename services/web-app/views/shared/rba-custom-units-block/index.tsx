import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AnyAction } from "redux";

import type { InputChangeCallback } from "@common/typings";
import type { CustomUnitInput, Unit } from "@common/units";
import { WeightUnit } from "@common/units";
import Utils from "@common/utils";
import RbaCustomUnitLine from "@views/shared/rba-custom-unit-line";

import styles from "./rba-custom-units-block.module.scss";



interface Props {
    customUnits: CustomUnitInput[];
    addCustomUnit: (customUnit: CustomUnitInput) => AnyAction;
    removeCustomUnit: (index: number) => AnyAction;
    updateCustomUnit: (index: number, customUnit: CustomUnitInput) => AnyAction;
}

const NEW_CUSTOM_UNIT: CustomUnitInput = {
    product_id: -1,
    name: "",
    amount: 100,
    amountInput: "100",
    unit: WeightUnit.g,
};

const RbaCustomUnitsBlock: React.FC<Props> = ({ customUnits, addCustomUnit, removeCustomUnit, updateCustomUnit }) => {

    const dispatch = useDispatch();
    const [ newCustomUnit, setNewCustomUnit ] = useState<CustomUnitInput>(NEW_CUSTOM_UNIT);

    const updateNewItemName: InputChangeCallback = (event) => setNewCustomUnit({ ...newCustomUnit, name: event.target.value });

    const updateNewItemAmount: InputChangeCallback = (event) => {
        const amountInputNormilized = Utils.decimalNormalizer(event.target.value, newCustomUnit.amountInput);
        setNewCustomUnit({
            ...newCustomUnit,
            amount: Number(amountInputNormilized),
            amountInput: amountInputNormilized,
        });
    };

    const updateNewItemUnit = (unit: Unit): void => {
        setNewCustomUnit({ ...newCustomUnit, unit });
    };

    const createCustomUnit = (): void => {
        dispatch(addCustomUnit(newCustomUnit));
        setNewCustomUnit(NEW_CUSTOM_UNIT);
    };

    return (
        <div className={styles.customUnitsBlock}>

            <div className={styles.customUnitsBlockLabel}>
                {"CUSTOM UNITS"}
            </div>

            {customUnits.map((customUnit, index) => {

                const updateItemName: InputChangeCallback = (event) => {
                    const name = event.target.value;
                    dispatch(updateCustomUnit(index, { ...customUnit, name }));
                };

                const updateItemAmount: InputChangeCallback = (event) => {
                    dispatch(updateCustomUnit(index, {
                        ...customUnit,
                        amountInput: Utils.decimalNormalizer(event.target.value, customUnit.amountInput),
                    }));
                };

                const updateItemUnit = (unit: Unit): void => {
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
