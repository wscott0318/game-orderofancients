import { gsap } from "gsap";
import { CustomEase } from "gsap/all";
import { useEffect } from "react";
import styled from "styled-components";
import { GAME_STATES } from "../../../constants";

const GamePlay = styled.div`
    position: fixed;
    z-index: 10;

    .top-bar {
        width: 100%;
        position: fixed;
        aspect-ratio: 1920 / 51;
        top: -100px;
        background-size: 100% auto;
        background-image: url("/assets/images/top-bar-remove-center.png");
    }
    .top-center {
        width: 6.8%;
        position: fixed;
        top: -100px;
        left: 50%;
        transform: translateX(-50%);
        aspect-ratio: 130 / 83;
        background-size: 100% auto;
        background-image: url("/assets/images/top-bar-center.png");
    }
    .bottom-bar {
        position: fixed;
        bottom: -400px;
        background-size: 100% auto;
        width: 100%;
        aspect-ratio: 1920 / 302;
        background-image: url(/assets/images/bottom-bar.png);
    }
    .spec {
        position: relative;
        display: grid;
        grid: auto / auto auto auto auto;
        grid-gap: 6px;
        padding: 4px;
        width: 16.5%;
        height: 77%;
        top: 20%;
        left: 70%;
        .item {
            background-image: url(/assets/images/rexar.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: 50% 50%;
            border: solid 3px darkgray;
        }
        .item: nth-child(n + 4) {
            visibility: hidden;
        }
        .item:active {
            background-size: 90% 90%;
            transition: background-size 0s;
        }
    }
`;

const GamePlayUI = () => {
    const playControlDown = gsap.timeline();

    useEffect(() => {
        playControlDown
            .add("start")
            .to(
                ".top-bar",
                {
                    top: "0px",
                    duration: 1,
                },
                "start"
            )
            .to(
                ".top-center",
                {
                    top: "0px",
                    duration: 1,
                },
                "start"
            )
            .to(
                ".bottom-bar",
                {
                    bottom: "0px",
                    duration: 1,
                },
                "start"
            );
    }, []);

    return (
        <GamePlay className="gameplay">
            <div className="top-bar"></div>
            <div className="top-center"></div>
            <div className="bottom-bar">
                <div className="spec">
                    <div className="item"></div>
                    <div className="item"></div>
                    <div className="item"></div>
                    <div className="item"></div>
                    <div className="item"></div>
                    <div className="item"></div>
                    <div className="item"></div>
                    <div className="item"></div>
                    <div className="item"></div>
                    <div className="item"></div>
                    <div className="item"></div>
                    <div className="item"></div>
                </div>
            </div>
        </GamePlay>
    );
};

export default GamePlayUI;
