import React, { useState } from "react";

import type { CustomUnitInput, Unit } from "@common/units";
import { WeightUnit } from "@common/units";
import RbaCustomUnitLine from "@views/shared/rba-custom-unit-line";

import styles from "./rba-custom-units-block.module.scss";



interface Props {
    isReadOnly: boolean;
    customUnits: CustomUnitInput[];
    addCustomUnit: (customUnit: CustomUnitInput) => void;
    removeCustomUnit: (index: number) => void;
    updateCustomUnit: (index: number, customUnit: CustomUnitInput) => void;
}

const NEW_CUSTOM_UNIT: CustomUnitInput = {
    food_id: -1,
    name: "",
    amount: 100,
    amountInput: "100",
    unit: WeightUnit.g,
};

const RbaCustomUnitsBlock: React.FC<Props> = ({ isReadOnly, customUnits, addCustomUnit, removeCustomUnit, updateCustomUnit }) => {

    const [ newCustomUnit, setNewCustomUnit ] = useState<CustomUnitInput>(NEW_CUSTOM_UNIT);

    const newCustomUnitLine = (
        <RbaCustomUnitLine
            isNew={true}
            customUnit={newCustomUnit}
            updateItemName={(value) => {
                setNewCustomUnit({ ...newCustomUnit, name: value });
            }}
            updateItemAmount={(value) => {
                setNewCustomUnit({ ...newCustomUnit, amountInput: value });
            }}
            updateItemUnit={(unit: Unit) => {
                setNewCustomUnit({ ...newCustomUnit, unit });
            }}
            onButtonClick={() => {
                addCustomUnit(newCustomUnit);
                setNewCustomUnit(NEW_CUSTOM_UNIT);
            }}
        />
    );

    return (
        <div className={styles.customUnitsBlock}>

            <div className={styles.customUnitsBlockLabel}>
                {"CUSTOM UNITS"}
            </div>

            {customUnits.map((customUnit, index) => (
                <RbaCustomUnitLine
                    key={`CU_${index}`}
                    isReadOnly={isReadOnly}
                    isNew={false}
                    customUnit={customUnit}
                    updateItemName={(value) => {
                        updateCustomUnit(index, { ...customUnit, name: value });
                    }}
                    updateItemAmount={(value) => {
                        updateCustomUnit(index, { ...customUnit, amountInput: value });
                    }}
                    updateItemUnit={(unit: Unit) => { updateCustomUnit(index, { ...customUnit, unit }); }}
                    onButtonClick={() => { removeCustomUnit(index); }}
                />
            ))}

            {( !isReadOnly && newCustomUnitLine )}

        </div>
    );
};

RbaCustomUnitsBlock.displayName = "RbaCustomUnitsBlock";

export default RbaCustomUnitsBlock;
