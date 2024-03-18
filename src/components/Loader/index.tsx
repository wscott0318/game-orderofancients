import styled from "styled-components";
import "./index.scss";
import "./firefly.scss";
import { useEffect, useState } from "react";
import { GET_RANDOM_VAL } from "../../helper/math";
import { S3_BUCKET_URL } from "../../constants";
import { GameMain } from "../../game/main/GameMain";
import { GameEvents } from "../../game/Events";

const logoImg = S3_BUCKET_URL + "/assets/images/logo2.png";
const sliderImg = S3_BUCKET_URL + "/assets/images/loader-slider-shine.png";

const TopLogo = styled.div`
    height: 450px;
    max-width: 100%;
    position: absolute;
    transform: translate(-50%, -50%);
    top: calc(50% - 50px);
    left: 50%;
    @media (max-width: 500px) {
        width: 90%;
    }

    img {
        object-fit: contain;
        object-position: center;
    }
`;

const LoadingProgress = styled.div`
    max-width: 90%;
    width: 800px;
    bottom: 20px;
`;

interface LoaderProps {
    canEnterGame: boolean;
}

export const Loader = ({ canEnterGame }: LoaderProps) => {
    const [progressValue, setProgressValue] = useState(0);

    // Firefly particle effects
    const renderFirefly = (count: number) => {
        const array = new Array(count);
        array.fill(1);

        return array.map((val: number, index: number) => (
            <div key={index} className="firefly"></div>
        ));
    };

    useEffect(() => {

        const onLoadProgress = ( value: number ) => {

            setProgressValue( 100 * value );

        };

        GameMain.addListener( GameEvents.ASSETS_LOADING_PROGRESS_UPDATE, onLoadProgress );

        return () => {

            GameMain.removeListener( GameEvents.ASSETS_LOADING_PROGRESS_UPDATE, onLoadProgress );

        };

    }, []);

    //

    return (
        <div className="loader">
            <div className="w-screen h-screen overflow-hidden z-20 relative select-none flex flex-col justify-end items-center">
                <div className="stars absolute">{renderFirefly(30)}</div>

                <TopLogo>
                    <img src={logoImg} alt="logo" className="w-full h-full" />
                </TopLogo>

                <LoadingProgress className="relative">
                    <CustomLoaderSlider
                        value={progressValue}
                        canEnterGame={canEnterGame}
                    />
                </LoadingProgress>

                <div
                    className={`pressAnyKey w-full text-center ${
                        canEnterGame ? "active" : ""
                    }`}
                >
                    PRESS ANY KEY
                </div>
            </div>
        </div>
    );
};

const CustomLoaderSlider = ({ value, canEnterGame }: any) => {
    return (
        <div className={`progress-container ${canEnterGame ? "hide" : ""}`}>
            <div
                className="progress h-full"
                style={{ backgroundSize: `${value}% 100%` }}
            />
            <img src={sliderImg} style={{ left: `${value}%` }} />
            <p className="absolute text-white top-0 left-[50%] translate-x-[-50%] text-[24px] uppercase">
                Loading
            </p>
        </div>
    );
};
