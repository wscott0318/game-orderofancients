
import EventEmitter from "events";
import { LobbyInfo } from "../Types";

//

interface IGameMainProps {
    canvas:         HTMLCanvasElement;
    lobbyInfo:      LobbyInfo;
    playerIndex:    number;
    gameMode:       number;
};

//

class GameMainCore extends EventEmitter {

    private worker: Worker;
    private inited: boolean = false;

    public lobbyInfo: LobbyInfo;
    public playerIndex: number;

    private props: IGameMainProps;

    //

    public init () : void {

        this.worker = new Worker( "./worker.bundle.js" );
        this.worker.onmessage = this.onWorkerMessage;

        console.log( 'GameMainCore: init' );

    };

    public dispatchEvent = ( eventName: string, params?: any, buffers: Transferable[] = [] ) : void => {

        if ( ! this.worker ) return;

        console.log( eventName );

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

        if ( event.data.eventName === 'InitedWorker' ) {

            // @ts-ignore
            const offscreen = this.props.canvas.transferControlToOffscreen();

            this.dispatchEvent( 'InitCanvas', {

                offscreen:          offscreen,
                windowWidth:        window.innerWidth,
                windowHeight:       window.innerHeight,
                devicePixelRatio:   window.devicePixelRatio,
                lobbyInfo:          this.props.lobbyInfo,
                playerIndex:        this.props.playerIndex,
                gameMode:           this.props.gameMode

            }, [ offscreen ] );

            this.inited = true;
            return;

        }

        this.emit( event.data.eventName, event.data.params );

    };

};

export const GameMain = new GameMainCore();
GameMain.init();
