
import { GAME_STATES } from "../../constants";

interface StateManagerProps {
    setCurrentGameState: Function;
}

//

export class StateManager {

    public currentState: number;
    public setCurrentGameState: Function;

    //

    constructor ( { setCurrentGameState }: StateManagerProps ) {

        this.currentState = GAME_STATES["GAME_MENU"];
        this.setCurrentGameState = setCurrentGameState;

    }

    public getCurrentState () {

        return this.currentState;

    }

    public setState ( newState: number ) {

        this.currentState = newState;
        this.setCurrentGameState( newState );

    }

}
