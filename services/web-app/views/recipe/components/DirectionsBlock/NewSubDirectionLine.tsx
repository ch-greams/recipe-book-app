import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { CY_NEW_SUB_DIRECTION_LINE, CY_NEW_SUB_DIRECTION_LINE_CREATE_BUTTON } from "cypress/constants";

import Utils from "@common/utils";
import type { SelectOption } from "@views/shared/SelectInput";
import { getOptionLabel } from "@views/shared/SelectInput";
import SelectInput, { SelectInputType } from "@views/shared/SelectInput";
import * as actions from "@store/recipe/actions";
import type { RecipeIngredient } from "@store/recipe/types";
import { SubDirectionType } from "@store/recipe/types";
import RemoveIcon from "@icons/close-sharp.svg";
import IconWrapper from "@icons/IconWrapper";

import styles from "./DirectionsBlock.module.scss";



interface Props {
    directionIndex: number;
    ingredients: RecipeIngredient[];
}

const NewSubDirectionLine: React.FC<Props> = ({ directionIndex, ingredients }) => {

    const dispatch = useDispatch();

    const [ currentDirectionPart, setDirectionPart ] = useState<SelectOption<SubDirectionType | ID>>({
        group: "Comment",
        value: SubDirectionType.Note,
    });

    const createSubDirection = (option: SelectOption<SubDirectionType | ID>): void => {

        if (option.group === "Comment") {
            dispatch(actions.createSubDirectionComment(directionIndex, option.value as SubDirectionType));
        }
        else {
            dispatch(actions.createSubDirectionIngredient(directionIndex, Number(option.value)));
        }
    };

    const otherSubDirectionTypes = [
        SubDirectionType.Tip,
        SubDirectionType.Note,
        SubDirectionType.Warning,
    ];

    return (

        <div
            data-cy={CY_NEW_SUB_DIRECTION_LINE}
            className={styles.subDirectionLine}
        >

            <div
                data-cy={CY_NEW_SUB_DIRECTION_LINE_CREATE_BUTTON}
                className={styles.subDirectionLineButton}
                onClick={() => createSubDirection(currentDirectionPart)}
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
                            value: String(ingredient.id),
                        })),
                        ...otherSubDirectionTypes.map((type) => ({ group: "Comment", value: type })),
                    ]}
                    value={getOptionLabel(currentDirectionPart)}
                    onChange={setDirectionPart}
                />

            </div>
        </div>
    );
};

NewSubDirectionLine.displayName = "NewSubDirectionLine";

export default NewSubDirectionLine;
