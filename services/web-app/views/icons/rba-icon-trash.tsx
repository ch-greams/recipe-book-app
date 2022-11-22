/* eslint-disable max-len */
import React from "react";


const RbaIconTrash: React.FC<IconProps> = ({ size, color }) => {
    return (
        <svg width={size} height={size} fill={color} stroke={color} style={{ display: "block" }} viewBox={"0 0 512 512"}>
            <path d={"M296 64h-80a7.91 7.91 0 00-8 8v24h96V72a7.91 7.91 0 00-8-8z"} fill={"none"} />
            <path d={"M432 96h-96V72a40 40 0 00-40-40h-80a40 40 0 00-40 40v24H80a16 16 0 000 32h17l19 304.92c1.42 26.85 22 47.08 48 47.08h184c26.13 0 46.3-19.78 48-47l19-305h17a16 16 0 000-32zM192.57 416H192a16 16 0 01-16-15.43l-8-224a16 16 0 1132-1.14l8 224A16 16 0 01192.57 416zM272 400a16 16 0 01-32 0V176a16 16 0 0132 0zm32-304h-96V72a7.91 7.91 0 018-8h80a7.91 7.91 0 018 8zm32 304.57A16 16 0 01320 416h-.58A16 16 0 01304 399.43l8-224a16 16 0 1132 1.14z"} />
        </svg>
    );
};

RbaIconTrash.displayName = "RbaIconTrash";

export default RbaIconTrash;
