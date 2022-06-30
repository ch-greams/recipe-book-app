import React from "react";
import { useDispatch } from "react-redux";

import type { InputChangeCallback } from "@common/typings";
import { Unit, VolumeUnit, WeightUnit } from "@common/units";
import Utils from "@common/utils";
import RbaCustomUnitsBlock from "@views/shared/rba-custom-units-block";
import RbaInput, { InputHeightSize, InputTextAlign, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import RbaSelect, { SelectHeightSize,SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { SelectOption } from "@views/shared/rba-select/rba-select-option";
import * as actions from "@store/food/actions";
import type { FoodPageStore } from "@store/food/types";

import styles from "./rba-parameters-block.module.scss";


interface Props {
    food: FoodPageStore;
}


const RbaParametersBlock: React.FC<Props> = ({ food }) => {

    const dispatch = useDispatch();


    const handleServingSizeAmountEdit: InputChangeCallback = (event) => {
        const amount = Utils.decimalNormalizer(event.target.value, food.servingSizeInput);
        dispatch(actions.updateServingSizeAmount(amount));
    };

    return (
        <div className={styles.parametersBlock}>

            <div className={styles.typeSelect}>

                <div className={styles.typeSelectLabel}>
                    {"TYPE"}
                </div>

                <RbaInput
                    theme={InputTheme.Alternative}
                    align={InputTextAlign.Left}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Large}
                    disabled={!food.editMode}
                    value={food.type}
                    onChange={(event) => {
                        dispatch(actions.updateType(event.target.value));
                    }}
                />

            </div>

            <div className={styles.separator} />

            <div className={styles.densityLine}>

                {/* BULK DENSITY */}

                <div
                    className={styles.densityLineLabel}
                    title={"Use Bulk Density for foods like rice or beans"}
                >
                    {"DENSITY"}
                </div>

                <RbaInput
                    theme={InputTheme.Alternative}
                    width={InputWidthSize.Large}
                    height={InputHeightSize.Large}
                    disabled={!food.editMode}
                    value={food.densityInput}
                    onChange={(event) => {
                        dispatch(actions.updateDensityAmount(event.target.value));
                    }}
                />

                <RbaSelect
                    theme={SelectTheme.Alternative}
                    center={true}
                    width={SelectWidthSize.Medium}
                    height={SelectHeightSize.Large}
                    options={Object.values(WeightUnit).map((unit) => ({ value: unit }))}
                    onChange={(option: SelectOption) => dispatch(actions.updateDensityWeightUnit(option.value as WeightUnit))}
                    value={food.densityWeightUnit}
                />

                <span className={styles.densityLineUnitSeparator}>
                    {"in"}
                </span>

                <RbaSelect
                    theme={SelectTheme.Alternative}
                    center={true}
                    width={SelectWidthSize.Medium}
                    height={SelectHeightSize.Large}
                    options={Object.values(VolumeUnit).map((unit) => ({ value: unit }))}
                    onChange={(option: SelectOption) => dispatch(actions.updateDensityVolumeUnit(option.value as VolumeUnit))}
                    value={food.densityVolumeUnit}
                />

            </div>

            <div className={styles.servingSizeLine}>

                <div className={styles.servingSizeLineLabel}>
                    {"SERVING SIZE"}
                </div>

                <RbaInput
                    theme={InputTheme.Alternative}
                    width={InputWidthSize.Large}
                    height={InputHeightSize.Large}
                    value={food.servingSizeInput}
                    onChange={handleServingSizeAmountEdit}
                />

                <RbaSelect
                    theme={SelectTheme.Alternative}
                    center={true}
                    width={SelectWidthSize.Medium}
                    height={SelectHeightSize.Large}
                    options={[
                        ...Object.values(Unit).map((unit) => ({ value: unit })),
                        ...food.customUnits.map((customUnit) => ({ value: customUnit.name })),
                    ]}
                    value={food.servingSizeUnit}
                    onChange={(option: SelectOption) => dispatch(actions.updateServingSizeUnit(option.value))}
                />

            </div>

            <div className={styles.separator} />

            <RbaCustomUnitsBlock
                customUnits={food.customUnits}
                addCustomUnit={actions.addCustomUnit}
                removeCustomUnit={actions.removeCustomUnit}
                updateCustomUnit={actions.updateCustomUnit}
            />

        </div>
    );
};

RbaParametersBlock.displayName = "RbaParametersBlock";

export default RbaParametersBlock;
