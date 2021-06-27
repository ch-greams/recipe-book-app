import React from "react";

import type { InputChangeCallback } from "@common/typings";
import type { CustomUnitInput } from "@common/units";
import { WeightUnit } from "@common/units";
import SelectInput, { SelectInputType } from "@views/shared/SelectInput";

import styles from "./CustomUnitLine.module.scss";


interface CustomUnitLineProps {
    customUnit: CustomUnitInput;
    updateItemName: InputChangeCallback;
    updateItemAmount: InputChangeCallback;
    updateItemUnit: (unit: WeightUnit) => void;
}


const CustomUnitLine: React.FC<CustomUnitLineProps> = ({
    customUnit,
    children,
    updateItemName,
    updateItemAmount,
    updateItemUnit,
}) => (
    <div className={styles.customUnitLine}>

        <div className={styles.customUnitLineButton}>

            {children}

        </div>

        <div className={styles.customUnitLineInfo}>

            <input
                type={"text"}
                placeholder={"NAME"}
                className={styles.customUnitLineName}
                value={customUnit.name}
                onChange={updateItemName}
            />

            <div className={styles.customUnitLineEqualSign}>{"="}</div>

            <div className={styles.customUnitLineMeasure}>

                <input
                    type={"text"}
                    placeholder={"#"}
                    className={styles.customUnitLineAmount}
                    value={customUnit.amount}
                    onChange={updateItemAmount}
                />

                <SelectInput
                    type={SelectInputType.CustomUnit}
                    options={Object.values(WeightUnit).map((unit) => ({ value: unit }))}
                    value={customUnit.unit}
                    onChange={updateItemUnit}
                />
            </div>
        </div>

    </div>
);

CustomUnitLine.displayName = "CustomUnitLine";


export default CustomUnitLine;
