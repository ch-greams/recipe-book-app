/* eslint-disable max-len */
import React from "react";


const RbaIconTip: React.FC<IconProps> = ({ width, height, color }) => {
    return (
        <svg
            width={width} height={height} fill={color} stroke={color}
            viewBox={"0 0 512 512"} fillRule={"evenodd"} clipRule={"evenodd"} strokeLinejoin={"round"} strokeMiterlimit={2}
        >
            <path d={"M208 464h96v32h-96zM192 416h128v32H192z"} />
            <path d={"M369.42 62.69C339.35 32.58 299.07 16 256 16h-.38C168.055 16 96 88.055 96 175.62v.38c0 46.62 17.87 90.23 49 119.64l4.36 4.09C167.37 316.57 192 339.64 192 360v40h48V269.11L195.72 244 214 217.72 256 240l41.29-22.39 19.1 25.68-44.39 26V400h48v-40c0-19.88 24.36-42.93 42.15-59.77l4.91-4.66C399.08 265 416 223.61 416 176a159.216 159.216 0 00-46.58-113.31z"} fillRule={"nonzero"} />
        </svg>
    );
};

RbaIconTip.displayName = "RbaIconTip";

export default RbaIconTip;
