import React from "react";
import { useDispatch } from "react-redux";

import Utils from "@common/utils";
import SelectInput, { SelectInputType } from "@views/shared/SelectInput";
import * as actions from "@store/recipe/actions";
import type { RecipeDirection, RecipeIngredient } from "@store/recipe/types";
import { SubDirectionType } from "@store/recipe/types";
import RemoveIcon from "@icons/close-sharp.svg";
import IconWrapper from "@icons/IconWrapper";

import styles from "./DirectionsBlock.module.scss";



interface Props {
    directionIndex: number;
    direction: RecipeDirection;
    ingredients: RecipeIngredient[];
}

const NewSubDirectionLine: React.FC<Props> = ({ directionIndex, direction, ingredients }) => {

    const dispatch = useDispatch();

    const createSubDirection = (value: string): void => {

        const type = (
            Object.keys(SubDirectionType).includes(value)
                ? value as SubDirectionType
                : value.split("_")[Utils.ZERO] as SubDirectionType
        );

        if (type === SubDirectionType.Ingredient) {

            const LAST_INDEX = 1;
            const id = Number(value.split("_")[LAST_INDEX]);

            dispatch(actions.createSubDirectionIngredient(directionIndex, id));
        }
        else {
            dispatch(actions.createSubDirection(directionIndex, type));
        }
    };

    const otherSubDirectionTypes = [
        SubDirectionType.Tip,
        SubDirectionType.Note,
        SubDirectionType.Warning,
    ];

    return (

        <div className={styles.subDirectionLine}>

            <div
                className={styles.subDirectionLineButton}
                onClick={() => createSubDirection(direction.newStep)}
            >
                <IconWrapper
                    isFullWidth={true}
                    width={24} height={24} color={Utils.COLOR_WHITE}
                    style={{ transform: "rotate(0.125turn)" }}
                >
                    <RemoveIcon />
                </IconWrapper>
            </div>

            <div className={styles.subDirectionInfoLine}>

                <SelectInput
                    type={SelectInputType.SubDirectionType}
                    withGroups={true}
                    options={[
                        ...ingredients.map((ingredient) => ({
                            group: "Ingredients",
                            label: Utils.unwrapForced(
                                ingredient.products[ingredient.product_id],
                                `ingredient.products["${ingredient.product_id}"]`,
                            ).name.toUpperCase(),
                            value: `${SubDirectionType.Ingredient}_${ingredient.id}`,
                        })),
                        ...otherSubDirectionTypes.map((type) => ({ group: "Other", value: type })),
                    ]}
                    value={direction.newStep}
                    onChange={(value: SubDirectionType | string) => {
                        dispatch(actions.updateNewSubDirectionType(directionIndex, value));
                    }}
                />

            </div>
        </div>
    );
};

NewSubDirectionLine.displayName = "NewSubDirectionLine";

export default NewSubDirectionLine;
