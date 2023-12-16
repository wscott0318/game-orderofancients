import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/all";
import { GAME_STATES, S3_BUCKET_URL } from "../../constants";
import styled from "styled-components";
import { useGame } from "../../hooks/useGame";

const tutorialBackImg =
    S3_BUCKET_URL + "/assets/images/tutorial/tutorial-back.png";

const Wrapper = styled.div`
    padding-top: 10%;
    padding-left: 8%;
    padding-right: 8%;
    padding-bottom: 5%;
`;

export const Tutorial = () => {
    const { setGameState } = useGame();

    const [step, setStep] = useState(1);

    const divRef = useRef<HTMLDivElement>(null);
    const menuAnim = gsap.timeline();

    useEffect(() => {
        if (divRef.current) {
            const divElement = divRef.current.childNodes[0];

            menuAnim.add("start").from(divElement, {
                top: "-50vw",
                duration: 1,
                ease: CustomEase.create(
                    "custom",
                    "M0,0,C0.266,0.412,0.666,1,0.842,1.022,0.924,1.032,0.92,1.034,1,1"
                ),
            });
        }
        return () => {
            menuAnim.kill();
        };
    }, []);

    const onClickNext = () => {
        if (step === 3) {
            if (divRef.current) {
                const divElement = divRef.current.childNodes[0];
                menuAnim.add("end").to(divElement, {
                    top: "-50vw",
                    duration: 1,
                    ease: CustomEase.create(
                        "custom",
                        "M0,0,C0.266,0.412,0.666,1,0.842,1.022,0.924,1.032,0.92,1.034,1,1"
                    ),
                });
            }

            setTimeout(() => {
                setGameState(GAME_STATES.GAME_MENU);
            }, 1000);
        } else {
            setStep((prev) => prev + 1);
        }
    };

    return (
        <div
            className="z-[20] w-full h-full flex justify-center items-center"
            ref={divRef}
        >
            <div className="relative w-[1200px]">
                <img className="w-full" alt="pic" src={tutorialBackImg} />

                <Wrapper className="w-full h-full absolute top-0 flex flex-col justify-start items-center gap-[2%]">
                    <div className="flex justify-center items-start gap-[2%]">
                        <div className="flex flex-col justify-start items-center w-[18%] gap-4">
                            <img
                                alt="pic"
                                className="w-full"
                                src={`/assets/images/tutorial/first-${
                                    step === 1 ? "active" : "inactive"
                                }.png`}
                            />
                            <img
                                alt="pic"
                                className="w-full"
                                src={`/assets/images/tutorial/second-${
                                    step === 2 ? "active" : "inactive"
                                }.png`}
                            />
                            <img
                                alt="pic"
                                className="w-full"
                                src={`/assets/images/tutorial/third-${
                                    step === 3 ? "active" : "inactive"
                                }.png`}
                            />
                        </div>

                        <div className="relative w-[80%]">
                            <img
                                alt="pic"
                                className="w-full"
                                src={"/assets/images/tutorial/text-back.png"}
                            />

                            <div className="w-full h-full absolute top-0 p-8 overflow-auto">
                                <p
                                    style={{
                                        display: "inline-block",
                                        wordBreak: "break-word",
                                    }}
                                    className="text-white"
                                >
                                    <img
                                        src={`/assets/images/tutorial/content-pic.png`}
                                        alt="pic"
                                        className="w-[35%] float-right clear-left mt-2 p-2"
                                    />
                                    <img
                                        src={`/assets/images/tutorial/${step}.png`}
                                        alt="pic"
                                        className="w-[3%] mb-4"
                                    />
                                    Id ipsum mi tempor eget. Pretium consectetur
                                    scelerisque blandit habitasse non
                                    ullamcorper enim, diam quam id et, tempus
                                    massa. Sed nam vulputate pellentesque quis.
                                    Varius a, nunc faucibus proin elementum id
                                    odio auctor. Nunc, suspendisse consequat
                                    libero, pharetra tellus vulputate auc tor
                                    venenatis tortor non rhoncus at duis.
                                    Pharetra ipsum ma uris integer sit feugiat.{" "}
                                    <br />
                                    Id ipsum mi tempor eget. Pretium consectetur
                                    scelerisque blandit habitasse non
                                    ullamcorper enim, diam quam id et, tempus
                                    massa. Sed nam vulputate pellentesque quis.
                                    Varius a, nunc faucibus proin elementum id
                                    odio auctor. Nunc, suspendisse consequat
                                    libero, pharetra tellus vulputate auc tor
                                    venenatis tortor non rhoncus at duis.
                                    Pharetra ipsum ma uris integer sit feugiat.
                                    suspendisse consequat libero, pharetra
                                    tellus vulputate auc tor venenatis tortor
                                    non rhoncus at duis. Pharetra ipsum ma uris
                                    integer sit feugiat. suspendisse consequat
                                    libero, pharetra tellus vulputate auc tor
                                    venenatis tortor non rhoncus at duis.
                                    Pharetra ipsum ma uris integer sit feugiat.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full text-center h-[10%]">
                        <button
                            className="h-full imageButton"
                            onClick={onClickNext}
                        >
                            <img
                                alt="pic"
                                src={`/assets/images/tutorial/${
                                    step !== 3 ? `next-btn` : `try-btn`
                                }.png`}
                                className="h-full"
                            />
                        </button>
                    </div>
                </Wrapper>
            </div>
        </div>
    );
};

export default Tutorial;
