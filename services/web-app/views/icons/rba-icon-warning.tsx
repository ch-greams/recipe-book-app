/* eslint-disable max-len */
import React from "react";


const RbaIconWarning: React.FC<IconProps> = ({ width, height, color }) => {
    return (
        <svg
            width={width} height={height} fill={color} stroke={color}
            viewBox={"0 0 512 512"} fillRule={"evenodd"} clipRule={"evenodd"} strokeLinejoin={"round"} strokeMiterlimit={2}
        >
            <path d={"M479 447.77L268.43 56.64a8.009 8.009 0 00-7.045-4.209 8.009 8.009 0 00-7.045 4.209L43.73 447.77a7.996 7.996 0 00-.955 3.79c0 4.389 3.612 8 8 8H472c4.372-.025 7.955-3.628 7.955-8a7.996 7.996 0 00-.955-3.79zm-197.62-36.29h-40v-40h40v40zm-4-63.92h-32l-6-160h44l-6 160z"} fillRule={"nonzero"} />
        </svg>
    );
};

RbaIconWarning.displayName = "RbaIconWarning";

export default RbaIconWarning;
