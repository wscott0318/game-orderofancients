import styled from "styled-components";

export const InputButton = styled.button`
    margin-left: 0.5rem;
    margin-right: 0.5rem;

    :hover {
        cursor: pointer;

        svg {
            stroke: #986db2 !important;
        }
    }

    :disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

interface CustomProgressBarProps {
    width?: string;
    height?: string;
    borderRadius?: string;
    trackColor?: string;
    backgroundColor?: string;
    value?: number;
    padding?: string;
    gradient?: boolean;
    props?: any;
    id?: string;
}
export const CustomProgressBar = ({
    width = "100%",
    height = "100%",
    backgroundColor = "black",
    padding = "2px",
    borderRadius = "20px",
    trackColor = "blue",
    value = 50,
    gradient = false,
    props,
    id,
}: CustomProgressBarProps) => {
    return (
        <div
            style={{
                width,
                height,
                backgroundColor,
                borderRadius,
                padding,
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <div
                    id={id}
                    style={{
                        width: `${value}%`,
                        height: "100%",
                        borderRadius,
                        background: `linear-gradient(
                            to top,
                            #80808044 0%,
                            #76767644 29%,
                            #ffffff44 79%,
                            #c0c0c044 100%
                            ), ${trackColor}`,
                        ...props,
                    }}
                ></div>
            </div>
        </div>
    );
};
