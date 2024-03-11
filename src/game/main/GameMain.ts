
import EventEmitter from "events";
import { LobbyInfo } from "../Types";
import { GameEvents } from "../Events";
import { UIRenderer } from "./UIRenderer";

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

    private uiRenderer: UIRenderer;

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

        this.uiRenderer = new UIRenderer();
        this.uiRenderer.init( props.canvas.parentElement as HTMLDivElement );

        this.addListener( GameEvents.UI_ADD_ELEMENT, this.uiRenderer.addElement );
        this.addListener( GameEvents.UI_REMOVE_ELEMENT, this.uiRenderer.removeElement );
        this.addListener( GameEvents.UI_UPDATE_ELEMENT, this.uiRenderer.updateElement );
        this.addListener( GameEvents.UI_SET_ELEMENT_POSITION, this.uiRenderer.setElementPosition );
        this.addListener( GameEvents.UI_SET_CAMERA_POSITION, this.uiRenderer.setCameraPosition );

        window.addEventListener( 'resize', () => {

            this.dispatchEvent( GameEvents.RESIZE_GFX, {
                windowWidth:    window.innerWidth,
                windowHeight:   window.innerHeight,
                screenWidth:    window.screen.width,
                screenHeight:   window.screen.height
            });

        });

        //

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
