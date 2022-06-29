/* eslint-disable max-len */
import React from "react";


const RbaIconLoading: React.FC<IconProps> = ({ size, color }) => {
    return (
        <svg viewBox={"0 0 512 512"} width={size} height={size} fill={color} stroke={color}>
            <path
                d={"M434.67 285.59v-29.8c0-98.73-80.24-178.79-179.2-178.79a179 179 0 00-140.14 67.36m-38.53 82v29.8C76.8 355 157 435 256 435a180.45 180.45 0 00140-66.92"}
                fill={"none"} stroke={color} strokeLinecap={"square"} strokeMiterlimit={"10"} strokeWidth={"32"}
            />
            <path
                d={"M32 256l44-44 46 44m358 0l-44 44-46-44"}
                fill={"none"} stroke={color} strokeLinecap={"square"} strokeMiterlimit={"10"} strokeWidth={"32"}
            />
        </svg>
    );
};

RbaIconLoading.displayName = "RbaIconLoading";

export default RbaIconLoading;
