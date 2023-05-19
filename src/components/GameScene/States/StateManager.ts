import { GAME_STATES } from "../../../constants";

export class StateManager {
    currentState: number;

    constructor() {
        this.currentState = GAME_STATES["GAME_MENU"];
    }

    setState(newState: number) {
        this.currentState = newState;
    }
}
