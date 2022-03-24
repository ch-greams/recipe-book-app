import React from "react";
import { useDispatch } from "react-redux";

import type { VolumeUnit, WeightUnit } from "@common/units";
import { Units } from "@common/units";
import Utils from "@common/utils";
import type { SelectOption } from "@views/shared/SelectInput";
import SelectInput, { SelectInputType } from "@views/shared/SelectInput";
import * as actions from "@store/recipe/actions";
import type { RecipeSubDirectionIngredient } from "@store/recipe/types";
import RemoveIcon from "@icons/close-sharp.svg";
import IconWrapper from "@icons/IconWrapper";

import styles from "./DirectionsBlock.module.scss";


interface Props {
    isReadOnly: boolean;
    subDirection: RecipeSubDirectionIngredient;
    directionIndex: number;
    subDirectionIndex: number;
}


const SubDirectionLine: React.FC<Props> = ({ isReadOnly, subDirection, directionIndex, subDirectionIndex }) => {

    const dispatch = useDispatch();

    const checkbox = (
        <div
            className={styles.lineCheckbox}
            onClick={() => dispatch(actions.toggleSubDirectionMark(directionIndex, subDirectionIndex))}
        >
            {( subDirection.isMarked ? <div className={styles.lineCheckboxMark} /> : null )}
        </div>
    );

    const removeButton = (
        <div
            className={styles.subDirectionLineButton}
            onClick={() => dispatch(actions.removeSubDirection(directionIndex, subDirectionIndex))}
        >
            <IconWrapper isFullWidth={true} width={24} height={24} color={Utils.COLOR_WHITE}>
                <RemoveIcon />
            </IconWrapper>
        </div>
    );

    const ingredientAmountText = (
        <div className={styles.directionInfoLineAmount}>
            {subDirection.product_amount}
        </div>
    );

    const ingredientAmountInput = (
        <input
            type={"text"}
            className={styles.directionInfoLineAmountInput}
            placeholder={"#"}
            value={subDirection.amountInput}
            onChange={(event) => {
                dispatch(actions.updateSubDirectionIngredientAmount(
                    directionIndex, subDirectionIndex, event.target.value,
                ));
            }}
        />
    );

    return (

        <div className={styles.subDirectionLine}>

            {( isReadOnly ? checkbox : removeButton )}

            <div className={styles.subDirectionInfoLine}>

                <div
                    className={styles.directionInfoLineTitle}
                    style={( subDirection.isMarked ? { opacity: 0.25 } : undefined )}
                >

                    <div className={styles.directionInfoLineName}>
                        {subDirection.label.toUpperCase()}
                    </div>

                </div>

                <div className={styles.directionInfoLineMeasure}>

                    {( isReadOnly ? ingredientAmountText : ingredientAmountInput )}

                    <SelectInput
                        type={SelectInputType.AltIngredientUnit}
                        options={Object.values(Units).map((unit) => ({ value: unit }))}
                        value={subDirection.unit}
                        onChange={(option: SelectOption<WeightUnit | VolumeUnit>) => {
                            dispatch(actions.updateSubDirectionIngredientUnit(
                                directionIndex, subDirectionIndex, option.value,
                            ));
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

SubDirectionLine.displayName = "SubDirectionLine";

export default SubDirectionLine;
