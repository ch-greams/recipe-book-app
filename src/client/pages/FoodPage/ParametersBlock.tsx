import React from "react";
import { useDispatch } from "react-redux";

import { Units, VolumeUnit, WeightUnit } from "@common/units";
import Utils from "@common/utils";
import CustomUnitsBlock from "@client/components/CustomUnitsBlock/CustomUnitsBlock";
import SelectInput, { SelectInputType } from "@client/components/SelectInput/SelectInput";
import * as actions from "@client/store/food/actions";
import type { FoodPageStore } from "@client/store/food/types";

import styles from "./FoodPage.scss";


interface Props {
    foodItem: FoodPageStore;
}


const ParametersBlock: React.FC<Props> = ({ foodItem }) => {

    const dispatch = useDispatch();


    const handleServingSizeAmountEdit = (event: React.ChangeEvent<HTMLInputElement>): void => {

        const amount = Utils.decimalNormalizer(event.target.value, foodItem.servingSizeInput);

        dispatch(actions.updateServingSize(amount));
    };

    const handleServingSizeUnitEdit = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        // NOTE: Unit or CustomUnit
        console.log(event.target.value);
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
                    onChange={console.log}
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
                    value={foodItem.density}
                    className={styles.densityLineInput}
                    onChange={console.log}
                />

                <SelectInput
                    type={SelectInputType.Other}
                    options={Object.keys(WeightUnit)}
                    onChange={console.log}
                    value={foodItem.densityWeight}
                />

                {"/"}

                <SelectInput
                    type={SelectInputType.Other}
                    options={Object.keys(VolumeUnit)}
                    onChange={console.log}
                    value={foodItem.densityVolume}
                />

            </div>

            <div className={styles.servingSizeLine}>
                
                <div className={styles.servingSizeLineLabel}>
                    {"SERVING SIZE"}
                </div>
                
                <input
                    type={"text"}
                    value={foodItem.servingSize}
                    className={styles.servingSizeLineInput}
                    onChange={handleServingSizeAmountEdit}
                />

                <SelectInput
                    type={SelectInputType.Other}
                    options={[ ...Object.values(Units), ...foodItem.customUnits.map((cu) => cu.name) ]}
                    onChange={handleServingSizeUnitEdit}
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
