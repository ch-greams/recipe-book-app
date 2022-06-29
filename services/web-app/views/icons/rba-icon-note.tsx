/* eslint-disable max-len */
import React from "react";


const RbaIconNote: React.FC<IconProps> = ({ width, height, color }) => {
    return (
        <svg
            width={width} height={height} fill={color} stroke={color}
            viewBox={"0 0 512 512"} fillRule={"evenodd"} clipRule={"evenodd"} strokeLinejoin={"round"} strokeMiterlimit={2}
        >
            <path d={"M240 304h32l6-160h-44l6 160z"} fill={"none"} />
            <path d={"M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm20 319.91h-40v-40h40v40zM272 304h-32l-6-160h44l-6 160z"} fillRule={"nonzero"} />
        </svg>
    );
};

RbaIconNote.displayName = "RbaIconNote";

export default RbaIconNote;
