import "./index.scss";

export const Loader = () => {
    return (
        <div className="content">
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
