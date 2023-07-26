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
}
export const CustomProgressBar = ({
    width = "100%",
    height = "100%",
    backgroundColor = "black",
    padding = "2px",
    borderRadius = "20px",
    trackColor = "blue",
    value = 50,
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
                    style={{
                        width: `${value}%`,
                        height: "100%",
                        borderRadius,
                        backgroundColor: trackColor,
                    }}
                ></div>
            </div>
        </div>
    );
};
