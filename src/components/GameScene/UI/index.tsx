import { useEffect } from "react";
import { Back, gsap } from "gsap";
import "./index.scss";
import { StartMenu } from "./StartMenu";
export const UI = () => {
    useEffect(() => {
        gsap.to(".menu", {
            top: "0px",
            duration: 1,
            // ease: Back.easeOut,
        });
        gsap.to(".chain", {
            top: "-60px",
            height: "100px",
            duration: 1,
        });
        gsap.to(".chain", {
            height: "100px",
            duration: 1,
            ease: Back.easeOut,
        });
    }, []);
    return (
        <div className="content">
            <div className="chain" />
            <StartMenu />
        </div>
    );
};
