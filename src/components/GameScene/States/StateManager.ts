import { GAME_STATES } from "../../../constants";

interface StateManagerProps {
    setCurrentGameSate: Function;
}

export class StateManager {
    currentState: number;
    setCurrentGameSate: Function;

    constructor({ setCurrentGameSate }: StateManagerProps) {
        this.currentState = GAME_STATES["GAME_MENU"];
        this.setCurrentGameSate = setCurrentGameSate;
    }

    getCurrentState() {
        return this.currentState;
    }

    setState(newState: number) {
        this.currentState = newState;
        this.setCurrentGameSate(newState);
    }
}
