/* eslint-disable max-len */
import React from "react";


const RbaIconCheck: React.FC<IconProps> = ({ size, color }) => {
    return (
        <svg width={size} height={size} viewBox={"0 0 512 512"}>
            <path d={"M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"} fill={"none"} stroke={color} strokeMiterlimit={"10"} strokeWidth={"32"} />
            <path fill={"none"} stroke={color} strokeLinecap={"round"} strokeLinejoin={"round"} strokeWidth={"32"} d={"M352 176L217.6 336 160 272"} />
        </svg>
    );
};

RbaIconCheck.displayName = "RbaIconCheck";

export default RbaIconCheck;


