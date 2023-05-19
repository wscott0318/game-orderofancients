import "./index.scss";
import "./star.scss";
import "./firefly.scss";
export const Loader = () => {
    // const renderStars = (count: number) => {
    //     const array = new Array(count);
    //     array.fill(1);
    //     return array.map((index: number) => (
    //         <div key={index} className="star"></div>
    //     ));
    // };

    const renderFirefly = (count: number) => {
        const array = new Array(count);
        array.fill(1);
        return array.map((index: number) => (
            <div key={index} className="firefly"></div>
        ));
    };

    return (
        <div className="content">
            {/* <div className="stars">{renderStars(30)}</div> */}
            <div className="stars">{renderFirefly(30)}</div>
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
