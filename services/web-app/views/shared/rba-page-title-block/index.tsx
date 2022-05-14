import React, { useState } from "react";
import type { AnyAction } from "redux";

import RbaPageTitleBlockInput from "./rba-page-title-block-input";
import RbaPageTitleBlockStatic from "./rba-page-title-block-static";



interface Props {
    name: string;
    brand: string;
    subtitle: string;
    description?: string;
    updateName: (value: string) => AnyAction;
    updateBrand: (value: string) => AnyAction;
    updateSubtitle: (value: string) => AnyAction;
    updateDescription: (value: string) => AnyAction;
}


const RbaPageTitleBlock: React.FC<Props> = ({
    name, brand, subtitle, description,
    updateName, updateBrand, updateSubtitle, updateDescription,
}) => {

    const [ isTitleInputsOpen, setIsTitleInputsOpen ] = useState(false);

    return (
        isTitleInputsOpen
            ? (
                <RbaPageTitleBlockInput
                    name={name}
                    brand={brand}
                    subtitle={subtitle}
                    description={description}
                    confirmTitle={() => setIsTitleInputsOpen(false)}
                    updateName={updateName}
                    updateBrand={updateBrand}
                    updateSubtitle={updateSubtitle}
                    updateDescription={updateDescription}
                />
            )
            : (
                <RbaPageTitleBlockStatic
                    name={name}
                    brand={brand}
                    subtitle={subtitle}
                    description={description}
                    editTitle={() => setIsTitleInputsOpen(true)}
                />
            )
    );
};

RbaPageTitleBlock.displayName = "RbaPageTitleBlock";

export default RbaPageTitleBlock;
