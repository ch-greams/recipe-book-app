import styled from "styled-components";


interface Props {
    width: number;
    height: number;
    color: string;
    isFullWidth?: boolean;
}

const IconWrapper = styled.div<Props>`

    width: ${(props) => (props.isFullWidth ? "100%" : `${props.width}px`)};
    height: ${(props) => props.height}px;

    svg {

        width: ${(props) => props.width}px;
        height: ${(props) => props.height}px;
        fill: ${(props) => props.color};

        path {
            stroke: ${(props) => props.color};
        }
    }
`;

export default IconWrapper;
