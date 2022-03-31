import React from "react";
import {
    CY_CUSTOM_UNIT_AMOUNT, CY_CUSTOM_UNIT_BUTTON, CY_CUSTOM_UNIT_LINE,
    CY_CUSTOM_UNIT_NAME, CY_NEW_CUSTOM_UNIT_LINE,
} from "cypress/constants";

import type { InputChangeCallback } from "@common/typings";
import type { CustomUnitInput } from "@common/units";
import { Units } from "@common/units";
import Utils from "@common/utils";
import type { SelectOption } from "@views/shared/select-input";
import SelectInput, { SelectInputType } from "@views/shared/select-input";
import IconAdd from "@icons/add-sharp.svg";
import IconWrapper from "@icons/IconWrapper";

import styles from "./custom-unit-line.module.scss";


interface CustomUnitLineProps {
    isNew: boolean;
    customUnit: CustomUnitInput;
    updateItemName: InputChangeCallback;
    updateItemAmount: InputChangeCallback;
    updateItemUnit: (unit: Units) => void;
    upsertCustomUnit: () => void;
}


const CustomUnitLine: React.FC<CustomUnitLineProps> = ({
    isNew,
    customUnit,
    updateItemName,
    updateItemAmount,
    updateItemUnit,
    upsertCustomUnit,
}) => (
    <div
        data-cy={(isNew ? CY_NEW_CUSTOM_UNIT_LINE : CY_CUSTOM_UNIT_LINE)}
        className={styles.customUnitLine}
    >

        <div className={styles.customUnitLineButton}>

            <IconWrapper
                data-cy={CY_CUSTOM_UNIT_BUTTON}
                isFullWidth={true} width={20} height={20} color={Utils.COLOR_DEFAULT}
                style={(isNew ? undefined : { transform: "rotate(0.125turn)" })}
                onClick={upsertCustomUnit}
            >
                <IconAdd />
            </IconWrapper>

        </div>

        <div className={styles.customUnitLineInfo}>

            <input
                data-cy={CY_CUSTOM_UNIT_NAME}
                type={"text"}
                placeholder={"NAME"}
                className={styles.customUnitLineName}
                value={customUnit.name}
                onChange={updateItemName}
            />

            <div className={styles.customUnitLineEqualSign}>{"="}</div>

            <div className={styles.customUnitLineMeasure}>

                <input
                    data-cy={CY_CUSTOM_UNIT_AMOUNT}
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