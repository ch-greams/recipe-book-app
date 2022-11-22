/* eslint-disable react/display-name */
import type { PropsWithChildren } from "react";
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { Color } from "@common/style";
import Utils from "@common/utils";
import { IconSize } from "@icons/icon-params";

import RbaIconAdd from "./rba-icon-add";
import RbaIconCheck from "./rba-icon-check";
import RbaIconLink from "./rba-icon-link";
import RbaIconLoading from "./rba-icon-loading";
import RbaIconNote from "./rba-icon-note";
import RbaIconPerson from "./rba-icon-person";
import RbaIconRemove from "./rba-icon-remove";
import RbaIconSearch from "./rba-icon-search";
import RbaIconTip from "./rba-icon-tip";
import RbaIconTrash from "./rba-icon-trash";
import RbaIconWarning from "./rba-icon-warning";



const RbaIcon: React.FC<PropsWithChildren<IconProps>> = ({ children }) => (
    <div style={{ gap: "40px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
        {children}
    </div>
);


export default {
    title: "Icons/RbaIcon",
    component: RbaIcon,
    argTypes: {
        size: {
            type: { name: "enum", value: Utils.getObjectValues(IconSize), required: true },
            table: { type: { summary: "IconSize" } },
            control: { type: "select", options: IconSize },
        },
        color: {
            type: { name: "enum", value: Utils.getObjectValues(Color), required: true },
            table: { type: { summary: "Color" } },
            control: { type: "select", options: Color },
        },
    },
} as ComponentMeta<typeof RbaIcon>;



const Template: ComponentStory<typeof RbaIcon> = (args) =>(
    <RbaIcon {...args}>
        <RbaIconAdd {...args} />
        <RbaIconLink {...args} />
        <RbaIconLoading {...args} />
        <RbaIconNote {...args} />
        <RbaIconPerson {...args} />
        <RbaIconRemove {...args} />
        <RbaIconSearch {...args} />
        <RbaIconTip {...args} />
        <RbaIconWarning {...args} />
        <RbaIconCheck {...args} />
        <RbaIconTrash {...args} />
    </RbaIcon>
);
export const Default = Template.bind({});
Default.args = {
    size: IconSize.ExtraLarge,
    color: Color.White,
};
