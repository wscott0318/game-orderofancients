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
        grid-gap: 0.3vw;
        padding: 0.1vw 0.2vw;
        width: 16.5%;
        height: 77%;
        top: 20%;
        left: 70%;
        .item {
            background-image: url(/assets/images/rexar.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: 50% 50%;
            border: solid 0.1vw darkgray;
        }
        .item: nth-child(n + 4) {
            visibility: hidden;
        }
        .item:active {
            background-size: 90% 90%;
            transition: background-size 0s;
        }
    }
    .status {
        font-size: 1.4vw;
        position: absolute;
        background-color: #ff000033;
        width: 18.5%;
        height: 68%;
        left: 41%;
        bottom: 0px;
        display: flex;
        flex-direction: column;
        .name {
            position: relative;
            height: 20%;
            display: flex;
            color: white;
            justify-content: center;
        }
        .slider {
            height: 20%;
            background-color: #22222222;

            .progress {
                padding: 0.2vw 0.3vw;
                height: 100%;
                border: 0.1vw solid #ffff00;
                border-radius: 0.7vw;
                margin-left: 5%;
                margin-right: 5%;

                .progress-bar {
                    height: 100%;
                    background-image: linear-gradient(
                        0deg,
                        rgba(24, 34, 84, 1) 0%,
                        rgba(131, 138, 182, 1) 66%,
                        rgba(249, 249, 249, 1) 100%
                    );
                    width: 40%;
                }
            }
        }
        .others {
            position: relative;
            height: 60%;
            background-color: #33333333;
            color: yellow;
            display: flex;
            flex-direction: row;
            gap: 10%;
            padding: 5%;
            img {
                border: 0.1vw solid darkgray;
                padding: 1%;
            }
            ul li {
                font-size: 1.1vw;
                height: 30%;
            }
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
                <div className="status">
                    <div className="name">Survicor's Shop</div>
                    <div className="slider">
                        <div className="progress">
                            <div className="progress-bar"></div>
                        </div>
                    </div>
                    <div className="others">
                        <img src="/assets/images/rexar.png"></img>
                        <ul className="attributes">
                            <li>Armor: 10</li>
                            <li>Damage: 100</li>
                            <li>Range: 20</li>
                        </ul>
                    </div>
                </div>
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
