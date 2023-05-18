// import { useState } from "react";
import "./index.scss";
import "./star.scss";
// import Particles from "react-tsparticles";
// import { loadFull } from "tsparticles";

export const Loader = () => {
    // const [showParticle, setShowParticle]: [boolean, any] = useState(true);
    // const particlesInit = async (main: any) => {
    //     await loadFull(main);
    // };
    const starCount = new Array(10);
    const renderStars = () => {
        return starCount.map((element: any) => <div className="star"></div>);
    };
    return (
        <div className="content">
            {/* {showParticle && (
                <div id="particles-js">
                    <Particles
                        id="tsparticles"
                        init={particlesInit}
                        options={{
                            fpsLimit: 120,
                            interactivity: {
                                events: {
                                    onClick: {
                                        enable: true,
                                        mode: "push",
                                    },
                                    onHover: {
                                        enable: true,
                                        mode: "grab",
                                    },
                                    resize: true,
                                },
                                modes: {
                                    grab: {
                                        distance: 140,
                                        line_linked: {
                                            opacity: 1,
                                        },
                                    },
                                    push: {
                                        quantity: 4,
                                    },
                                    repulse: {
                                        distance: 200,
                                        duration: 0.4,
                                    },
                                },
                            },
                            particles: {
                                color: {
                                    value: "#ffffff",
                                },
                                links: {
                                    color: "#ffffff",
                                    distance: 150,
                                    enable: true,
                                    opacity: 0.5,
                                    width: 1,
                                },
                                collisions: {
                                    enable: true,
                                },
                                move: {
                                    direction: "none",
                                    enable: true,
                                    outModes: {
                                        default: "bounce",
                                    },
                                    random: false,
                                    speed: 1,
                                    straight: false,
                                },
                                number: {
                                    density: {
                                        enable: true,
                                        area: 800,
                                    },
                                    value: 80,
                                },
                                opacity: {
                                    value: 0.5,
                                },
                                shape: {
                                    type: "circle",
                                },
                                size: {
                                    value: { min: 1, max: 5 },
                                },
                            },
                            detectRetina: true,
                        }}
                    />
                </div>
            )} */}
            <div className="stars">
                {/* {starCount.map((e: any) => {
                    return <div className="star"></div>;
                })} */}
                {/* {renderStars} */}
                <div className="star"></div>
                <div className="star"></div>
                <div className="star"></div>
                <div className="star"></div>
                <div className="star"></div>
            </div>
            <div className="image-wrapper shine">
                <img src="/assets/images/logo.png" alt="background" />
            </div>

            <div className="progress-container">
                <div className="progress2 progress-moved">
                    <div className="progress-bar2"></div>
                </div>
            </div>
        </div>
    );
};
