/* eslint-disable max-len */
import React from "react";


const RbaIconLink: React.FC<IconProps> = ({ size, color }) => {
    return (
        <svg
            width={size} height={size} fill={color} stroke={color}
            viewBox={"0 0 512 512"} fillRule={"evenodd"} clipRule={"evenodd"} strokeLinecap={"square"} strokeLinejoin={"round"}
        >
            <path
                d={"M200.66 352H144c-52.664 0-96-43.336-96-96s43.336-96 96-96h55.41M312.59 160H368c52.664 0 96 43.336 96 96s-43.336 96-96 96h-56.66M169.07 256h175.86"}
                fill={"none"} stroke={color} strokeWidth={"48"}
            />
        </svg>
    );
};

RbaIconLink.displayName = "RbaIconLink";

export default RbaIconLink;
