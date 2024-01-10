import { GAME_STATES } from "../../constants";

interface StateManagerProps {
    setCurrentGameState: Function;
}

export class StateManager {
    currentState: number;
    setCurrentGameState: Function;

    constructor({ setCurrentGameState }: StateManagerProps) {
        this.currentState = GAME_STATES["GAME_MENU"];
        this.setCurrentGameState = setCurrentGameState;
    }

    getCurrentState() {
        return this.currentState;
    }

    setState(newState: number) {
        this.currentState = newState;
        this.setCurrentGameState(newState);
    }
}
