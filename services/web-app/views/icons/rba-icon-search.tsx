/* eslint-disable max-len */
import React from "react";


const RbaIconSearch: React.FC<IconProps> = ({ width, height, color }) => {
    return (
        <svg
            width={width} height={height} fill={color} stroke={color}
            viewBox={"0 0 512 512"} fillRule={"evenodd"} clipRule={"evenodd"} strokeLinejoin={"round"} strokeMiterlimit={2}
        >
            <path
                d={"M464 428L339.92 303.9a160.5 160.5 0 0030.72-94.58C370.64 120.37 298.27 48 209.32 48 120.37 48 48 120.37 48 209.32c0 88.95 72.37 161.32 161.32 161.32a160.5 160.5 0 0094.58-30.72L428 464l36-36zM209.32 319.69h-.01c-60.553 0-110.38-49.827-110.38-110.38S148.757 98.93 209.31 98.93s110.38 49.827 110.38 110.38v.01c-.071 60.52-49.85 110.299-110.37 110.37z"}
                fillRule={"nonzero"}
            />
        </svg>
    );
};

RbaIconSearch.displayName = "RbaIconSearch";

export default RbaIconSearch;
