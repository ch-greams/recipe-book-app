/* eslint-disable max-len */
import React from "react";


const RbaIconAdd: React.FC<IconProps> = ({ size, color }) => {
    return (
        <svg
            width={size} height={size} fill={color} stroke={color} transform={"rotate(45)"}
            viewBox={"0 0 512 512"} fillRule={"evenodd"} clipRule={"evenodd"} strokeLinejoin={"round"} strokeMiterlimit={"2"}>
            <path d={"M400 145.49L366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49z"} fillRule={"nonzero"}/>
        </svg>
    );
};

RbaIconAdd.displayName = "RbaIconAdd";

export default RbaIconAdd;
