import React from "react";

import { InputChangeCallback } from "@common/typings";
import { CustomUnitInput, WeightUnit } from "@common/units";
import SelectInput, { SelectInputType } from "@client/components/SelectInput/SelectInput";

import styles from "./CustomUnitLine.scss";


interface CustomUnitLineProps {
    customUnit: CustomUnitInput;
    updateItemName: InputChangeCallback;
    updateItemAmount: InputChangeCallback;
}


const CustomUnitLine: React.FC<CustomUnitLineProps> = ({
    customUnit,
    children,
    updateItemName,
    updateItemAmount,
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
                    options={Object.keys(WeightUnit).map((unit) => ({ value: unit }))}
                    onChange={console.log}
                />
            </div>
        </div>

    </div>
);

CustomUnitLine.displayName = "CustomUnitLine";


export default CustomUnitLine;
