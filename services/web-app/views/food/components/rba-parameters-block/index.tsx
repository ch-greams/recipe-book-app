import React from "react";
import { useDispatch } from "react-redux";

import type { InputChangeCallback } from "@common/typings";
import { Units, VolumeUnit, WeightUnit } from "@common/units";
import Utils from "@common/utils";
import RbaCustomUnitsBlock from "@views/shared/rba-custom-units-block";
import RbaSelect, { SelectHeightSize,SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { SelectOption } from "@views/shared/rba-select/rba-select-option";
import * as actions from "@store/food/actions";
import type { FoodPageStore } from "@store/food/types";

import styles from "./rba-parameters-block.module.scss";


interface Props {
    foodItem: FoodPageStore;
}


const RbaParametersBlock: React.FC<Props> = ({ foodItem }) => {

    const dispatch = useDispatch();


    const handleServingSizeAmountEdit: InputChangeCallback = (event) => {
        const amount = Utils.decimalNormalizer(event.target.value, foodItem.servingSizeInput);
        dispatch(actions.updateServingSizeAmount(amount));
    };

    return (
        <div className={styles.parametersBlock}>

            <div className={styles.typeSelect}>

                <div className={styles.typeSelectLabel}>
                    {"TYPE"}
                </div>

                <input
                    type={"text"}
                    value={foodItem.type}
                    className={styles.typeSelectInput}
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

                <input
                    type={"text"}
                    value={foodItem.densityInput}
                    className={styles.densityLineInput}
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
                    value={foodItem.densityWeightUnit}
                />

                {"/"}

                <RbaSelect
                    theme={SelectTheme.Alternative}
                    center={true}
                    width={SelectWidthSize.Medium}
                    height={SelectHeightSize.Large}
                    options={Object.values(VolumeUnit).map((unit) => ({ value: unit }))}
                    onChange={(option: SelectOption) => dispatch(actions.updateDensityVolumeUnit(option.value as VolumeUnit))}
                    value={foodItem.densityVolumeUnit}
                />

            </div>

            <div className={styles.servingSizeLine}>

                <div className={styles.servingSizeLineLabel}>
                    {"SERVING SIZE"}
                </div>

                <input
                    type={"text"}
                    value={foodItem.servingSizeInput}
                    className={styles.servingSizeLineInput}
                    onChange={handleServingSizeAmountEdit}
                />

                <RbaSelect
                    theme={SelectTheme.Alternative}
                    center={true}
                    width={SelectWidthSize.Medium}
                    height={SelectHeightSize.Large}
                    options={[
                        ...Object.values(Units).map((unit) => ({ value: unit })),
                        ...foodItem.customUnits.map((customUnit) => ({ value: customUnit.name })),
                    ]}
                    value={foodItem.servingSizeUnit}
                    onChange={(option: SelectOption) => dispatch(actions.updateServingSizeUnit(option.value))}
                />

            </div>

            <div className={styles.separator} />

            <RbaCustomUnitsBlock
                customUnitInputs={foodItem.customUnitInputs}
                addCustomUnit={actions.addCustomUnit}
                removeCustomUnit={actions.removeCustomUnit}
                updateCustomUnit={actions.updateCustomUnit}
            />

        </div>
    );
};

RbaParametersBlock.displayName = "RbaParametersBlock";

export default RbaParametersBlock;
