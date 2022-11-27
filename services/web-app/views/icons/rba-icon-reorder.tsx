/* eslint-disable max-len */
import React from "react";


const RbaIconReorder: React.FC<IconProps> = ({ size, color }) => {
    return (
        <svg width={size} height={size} style={{ display: "block" }} viewBox={"0 0 512 512"}>
            <path fill={"none"} stroke={color} strokeLinecap={"round"} strokeLinejoin={"round"} strokeWidth={"32"} d={"M96 256h320M96 176h320M96 336h320"} />
        </svg>
    );
};

RbaIconReorder.displayName = "RbaIconReorder";

export default RbaIconReorder;
