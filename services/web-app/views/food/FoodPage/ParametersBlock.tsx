import React from "react";
import { useDispatch } from "react-redux";
import * as actions from "@store/food/actions";
import type { FoodPageStore } from "@store/food/types";
import CustomUnitsBlock from "@views/shared/CustomUnitsBlock";
import SelectInput, { SelectInputType } from "@views/shared/SelectInput";

import { InputChangeCallback } from "@common/typings";
import { Units, VolumeUnit, WeightUnit } from "@common/units";
import Utils from "@common/utils";

import styles from "./FoodPage.module.scss";


interface Props {
    foodItem: FoodPageStore;
}


const ParametersBlock: React.FC<Props> = ({ foodItem }) => {

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

                <SelectInput
                    type={SelectInputType.Other}
                    options={Object.keys(WeightUnit).map((unit) => ({ value: unit }))}
                    onChange={(unit: WeightUnit) => dispatch(actions.updateDensityWeightUnit(unit))}
                    value={foodItem.densityWeightUnit}
                />

                {"/"}

                <SelectInput
                    type={SelectInputType.Other}
                    options={Object.keys(VolumeUnit).map((unit) => ({ value: unit }))}
                    onChange={(unit: VolumeUnit) => dispatch(actions.updateDensityVolumeUnit(unit))}
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

                <SelectInput
                    type={SelectInputType.ServingSize}
                    options={[
                        ...Object.values(Units).map((unit) => ({ value: unit })),
                        ...foodItem.customUnits.map((customUnit) => ({ value: customUnit.name })),
                    ]}
                    value={foodItem.servingSizeUnit}
                    onChange={(unit: WeightUnit | VolumeUnit) => dispatch(actions.updateServingSizeUnit(unit))}
                />

            </div>

            <div className={styles.separator} />

            <CustomUnitsBlock
                customUnitInputs={foodItem.customUnitInputs}
                addCustomUnitRequest={actions.addCustomUnitRequest}
                removeCustomUnitRequest={actions.removeCustomUnitRequest}
                updateCustomUnitRequest={actions.updateCustomUnitRequest}
            />

        </div>
    );
};

ParametersBlock.displayName = "ParametersBlock";

export default ParametersBlock;
