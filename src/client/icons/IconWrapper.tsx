import StyledComponents from "styled-components";


interface Props {
    width: string;
    height: string;
    color: string;
    isFullWidth?: boolean;
}

const getIsFullWidth = (props: Props): string => (props.isFullWidth ? "100%" : props.width);
const getWidth = (props: Props): string => props.width;
const getHeight = (props: Props): string => props.height;
const getColor = (props: Props): string => props.color;

const IconWrapper = StyledComponents.div`

    width: ${getIsFullWidth};
    height: ${getHeight};

    svg {

        width: ${getWidth};
        height: ${getHeight};
        fill: ${getColor};

        path {
            stroke: ${getColor};
        }
    }
`;

export default IconWrapper;
