import React, { useState } from "react";
import { AnyAction } from "redux";

import type { Option } from "@common/typings";

import PageTitleBlockInput from "./PageTitleBlockInput";
import PageTitleBlockStatic from "./PageTitleBlockStatic";



interface Props {
    name: string;
    brand: string;
    subtitle: string;
    description?: string;
    withDescription?: boolean;
    updateName: (value: string) => AnyAction;
    updateBrand: (value: string) => AnyAction;
    updateSubtitle: (value: string) => AnyAction;
    updateDescription?: Option<(value: string) => AnyAction>;
}


const PageTitleBlock: React.FC<Props> = ({
    name, brand, subtitle, description, withDescription,
    updateName, updateBrand, updateSubtitle, updateDescription,
}) => {
    
    const [ isTitleInputsOpen, setIsTitleInputsOpen ] = useState(false);

    return (
        isTitleInputsOpen
            ? (
                <PageTitleBlockInput
                    name={name}
                    brand={brand}
                    subtitle={subtitle}
                    description={description}
                    withDescription={withDescription}
                    confirmTitle={() => setIsTitleInputsOpen(false)}
                    updateName={updateName}
                    updateBrand={updateBrand}
                    updateSubtitle={updateSubtitle}
                    updateDescription={updateDescription}
                />
            )
            : (
                <PageTitleBlockStatic
                    name={name}
                    brand={brand}
                    subtitle={subtitle}
                    description={description}
                    editTitle={() => setIsTitleInputsOpen(true)}
                />
            )
    );
};

PageTitleBlock.displayName = "PageTitleBlock";

export default PageTitleBlock;
