import React from "react";
import * as constants from "@cypress/constants";

import type { InputChangeCallback } from "@common/typings";
import type { CustomUnitInput } from "@common/units";
import { Units } from "@common/units";
import Utils from "@common/utils";
import RbaSelect, { SelectHeightSize,SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { SelectOption } from "@views/shared/rba-select/rba-select-option";
import IconAdd from "@icons/add-sharp.svg";
import IconWrapper from "@icons/IconWrapper";

import styles from "./rba-custom-unit-line.module.scss";


interface CustomUnitLineProps {
    isNew: boolean;
    customUnit: CustomUnitInput;
    updateItemName: InputChangeCallback;
    updateItemAmount: InputChangeCallback;
    updateItemUnit: (unit: Units) => void;
    upsertCustomUnit: () => void;
}


const RbaCustomUnitLine: React.FC<CustomUnitLineProps> = ({
    isNew,
    customUnit,
    updateItemName,
    updateItemAmount,
    updateItemUnit,
    upsertCustomUnit,
}) => (
    <div
        data-cy={(isNew ? constants.CY_NEW_CUSTOM_UNIT_LINE : constants.CY_CUSTOM_UNIT_LINE)}
        className={styles.customUnitLine}
    >

        <div className={styles.customUnitLineButton}>

            <IconWrapper
                data-cy={constants.CY_CUSTOM_UNIT_BUTTON}
                isFullWidth={true} width={20} height={20} color={Utils.COLOR_DEFAULT}
                style={(isNew ? undefined : { transform: "rotate(0.125turn)" })}
                onClick={upsertCustomUnit}
            >
                <IconAdd />
            </IconWrapper>

        </div>

        <div className={styles.customUnitLineInfo}>

            <input
                data-cy={constants.CY_CUSTOM_UNIT_NAME}
                type={"text"}
                placeholder={"NAME"}
                className={styles.customUnitLineName}
                value={customUnit.name}
                onChange={updateItemName}
            />

            <div className={styles.customUnitLineEqualSign}>{"="}</div>

            <div className={styles.customUnitLineMeasure}>

                <input
                    data-cy={constants.CY_CUSTOM_UNIT_AMOUNT}
                    type={"text"}
                    placeholder={"#"}
                    className={styles.customUnitLineAmount}
                    value={customUnit.amount}
                    onChange={updateItemAmount}
                />

                <RbaSelect
                    theme={SelectTheme.Primary}
                    center={true}
                    width={SelectWidthSize.Medium}
                    height={SelectHeightSize.Small}
                    options={Object.values(Units).map((unit) => ({ value: unit }))}
                    value={customUnit.unit}
                    onChange={(option: SelectOption) => updateItemUnit(option.value as Units)}
                />
            </div>
        </div>

    </div>
);

RbaCustomUnitLine.displayName = "RbaCustomUnitLine";


export default RbaCustomUnitLine;
