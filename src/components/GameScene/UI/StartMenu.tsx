export const StartMenu = () => {
    return (
        <div className="menu">
            <div className="button-col">
                <button className="warButton" name="campaign">
                    CAMPAIGN
                </button>
                <button className="warButton" name="versus">
                    VERSUS
                </button>
                <button className="warButton" name="custom">
                    CUSTOM GAME
                </button>
                <button className="warButton" name="localarea">
                    LOCAL AREA NETWORK
                </button>
                <button className="warButton" name="single">
                    SINGLE PLAYER
                </button>
                <button className="warButton" name="collection">
                    COLLECTION
                </button>
            </div>
        </div>
    );
};
