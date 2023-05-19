import { useEffect } from "react";
import { Back, gsap } from "gsap";
import { CustomEase } from "gsap/all";
import "./index.scss";
import { StartMenu } from "./StartMenu";
export const UI = () => {
    useEffect(() => {
        gsap.to(".menu", {
            top: "0px",
            duration: 1,
            ease: CustomEase.create(
                "custom",
                "M0,0,C0.266,0.412,0.666,1,0.842,1.022,0.924,1.032,0.92,1.034,1,1"
            ),
        });
        gsap.to(".chain", {
            top: "-60px",
            duration: 1,
        });
        gsap.to(".chain", {
            height: "100px",
            duration: 0.1,
            delay: 0.78,
            yoyo: true,
            repeat: 1,
        });
    }, []);
    return (
        <div className="content">
            <div className="chain" />
            <StartMenu />
        </div>
    );
};
