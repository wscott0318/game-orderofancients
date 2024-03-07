
import EventEmitter from "events";
import { LobbyInfo } from "../Types";
import { GameEvents } from "../Events";

//

interface IGameMainProps {
    canvas:         HTMLCanvasElement;
    gameMode:       number;
};

//

class GameMainCore extends EventEmitter {

    private worker: Worker;

    public meId: string;
    public lobbyInfo: LobbyInfo;
    public playerIndex: number;

    //

    public init () : void {

        this.worker = new Worker( "./worker.bundle.js" );
        this.worker.onmessage = this.onWorkerMessage;

        this.addListener( GameEvents.NETWORK_INITED, ( { socketId }: { socketId: string } ) => {

            this.meId = socketId;

        });

        console.log( 'GameMainCore: init' );

    };

    public initGFX ( props: IGameMainProps ) : void {

        // @ts-ignore
        const offscreen = props.canvas.transferControlToOffscreen();

        this.dispatchEvent( GameEvents.INIT_GFX, {

            offscreen:          offscreen,
            windowWidth:        window.innerWidth,
            windowHeight:       window.innerHeight,
            screenWidth:        window.screen.width,
            screenHeight:       window.screen.height,
            devicePixelRatio:   window.devicePixelRatio,
            gameMode:           props.gameMode

        }, [ offscreen ] );

    };

    public dispatchEvent = ( eventName: string, params?: any, buffers: Transferable[] = [] ) : void => {

        if ( ! this.worker ) return;

        this.worker.postMessage({
            eventName,
            params
        }, buffers );

    };

    public dispose () : void {

        this.worker.terminate();

    };

    //

    private onWorkerMessage = ( event: MessageEvent ) : void => {

        this.emit( event.data.eventName, event.data.params );

    };

};

export const GameMain = new GameMainCore();
GameMain.init();
