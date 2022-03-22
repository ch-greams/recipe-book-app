import React from "react";

import type { InputChangeCallback } from "@common/typings";
import type { CustomUnitInput } from "@common/units";
import { Units } from "@common/units";
import type { SelectOption } from "@views/shared/SelectInput";
import SelectInput, { SelectInputType } from "@views/shared/SelectInput";

import styles from "./CustomUnitLine.module.scss";


interface CustomUnitLineProps {
    customUnit: CustomUnitInput;
    updateItemName: InputChangeCallback;
    updateItemAmount: InputChangeCallback;
    updateItemUnit: (unit: Units) => void;
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
                    options={Object.values(Units).map((unit) => ({ value: unit }))}
                    value={customUnit.unit}
                    onChange={(option: SelectOption<Units>) => updateItemUnit(option.value)}
                />
            </div>
        </div>

    </div>
);

CustomUnitLine.displayName = "CustomUnitLine";


export default CustomUnitLine;
