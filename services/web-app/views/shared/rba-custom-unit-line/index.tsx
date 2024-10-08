import React from "react";
import * as constants from "@cypress/constants";

import { Color } from "@common/style";
import type { CustomUnitInput } from "@common/units";
import { Unit } from "@common/units";
import RbaSelect, { SelectHeightSize, SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { SelectOption } from "@views/shared/rba-select/rba-select-option";
import { IconSize } from "@icons/icon-params";
import RbaIconAdd from "@icons/rba-icon-add";
import RbaIconRemove from "@icons/rba-icon-remove";

import type { RbaInputChangeCallback } from "../rba-input";
import { InputNormalizer } from "../rba-input";
import RbaInput, { InputHeightSize, InputTheme, InputWidthSize } from "../rba-input";

import styles from "./rba-custom-unit-line.module.scss";


interface Props {
    isReadOnly?: boolean;
    isNew: boolean;
    customUnit: CustomUnitInput;
    updateItemName: RbaInputChangeCallback;
    updateItemAmount: RbaInputChangeCallback;
    updateItemUnit: (unit: Unit) => void;
    onButtonClick: () => void;
}


const RbaCustomUnitLine: React.FC<Props> = ({
    isReadOnly = false,
    isNew,
    customUnit,
    updateItemName,
    updateItemAmount,
    updateItemUnit,
    onButtonClick,
}) => (
    <div
        data-cy={(isNew ? constants.CY_NEW_CUSTOM_UNIT_LINE : constants.CY_CUSTOM_UNIT_LINE)}
        className={styles.customUnitLine}
    >

        {(
            !isReadOnly && (
                <div
                    data-cy={constants.CY_CUSTOM_UNIT_BUTTON}
                    className={styles.customUnitLineButton}
                    onClick={onButtonClick}
                >
                    {(
                        isNew
                            ? <RbaIconAdd size={IconSize.ExtraSmall} color={Color.Default} />
                            : <RbaIconRemove size={IconSize.ExtraSmall} color={Color.Default} />
                    )}

                </div>
            )
        )}

        <div className={styles.customUnitLineInfo}>

            <RbaInput
                data-cy={constants.CY_CUSTOM_UNIT_NAME}
                disabled={isReadOnly}
                theme={InputTheme.Primary}
                width={InputWidthSize.Full}
                height={InputHeightSize.Small}
                placeholder={"NAME"}
                value={customUnit.name}
                onChange={updateItemName}
            />

            <div className={styles.customUnitLineSeparator}>{"is"}</div>

            <div className={styles.customUnitLineMeasure}>

                <RbaInput
                    data-cy={constants.CY_CUSTOM_UNIT_AMOUNT}
                    disabled={isReadOnly}
                    theme={InputTheme.Primary}
                    width={InputWidthSize.Medium}
                    height={InputHeightSize.Small}
                    placeholder={"#"}
                    value={customUnit.amountInput}
                    normalizer={InputNormalizer.Decimal}
                    onChange={updateItemAmount}
                />

                <RbaSelect
                    data-cy={constants.CY_SELECT_INPUT}
                    disabled={isReadOnly}
                    theme={SelectTheme.Primary}
                    center={true}
                    width={SelectWidthSize.Medium}
                    height={SelectHeightSize.Small}
                    options={Object.values(Unit).map((unit) => ({ value: unit }))}
                    value={customUnit.unit}
                    onChange={(option: SelectOption) => updateItemUnit(option.value as Unit)}
                />
            </div>
        </div>

    </div>
);

RbaCustomUnitLine.displayName = "RbaCustomUnitLine";


export default RbaCustomUnitLine;
