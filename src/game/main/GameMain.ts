
import EventEmitter from "events";
import { LobbyInfo } from "../Types";
import { GameEvents } from "../Events";

//

interface IGameMainProps {
    container:      HTMLDivElement;
    minimapCanvas:  HTMLCanvasElement;
    gameMode:       number;
};

//

class GameMainCore extends EventEmitter {

    private worker: Worker;

    public meId: string;
    public lobbyInfo: LobbyInfo;
    public playerIndex: number;

    private sceneRenderCanvas: HTMLCanvasElement;
    private uiCanvas: HTMLCanvasElement;
    public minimapCanvas: HTMLCanvasElement;

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

        const sceneRenderCanvas = document.createElement( 'canvas' );
        props.container.appendChild( sceneRenderCanvas );
        this.sceneRenderCanvas = sceneRenderCanvas;

        const minimapCanvas = document.createElement( 'canvas' );
        minimapCanvas.width = 160;
        minimapCanvas.height = 160;
        this.minimapCanvas = minimapCanvas;

        const uiCanvas = document.createElement( 'canvas' );
        props.container.appendChild( uiCanvas );
        this.uiCanvas = uiCanvas;

        window.addEventListener( 'resize', this.onResize );

        //

        const sceneOffscreen = this.sceneRenderCanvas.transferControlToOffscreen();
        const uiOffscreen = this.uiCanvas.transferControlToOffscreen();
        const minimapOffscreen = this.minimapCanvas.transferControlToOffscreen();

        this.dispatchEvent( GameEvents.INIT_GFX, {

            sceneOffscreen:     sceneOffscreen,
            uiOffscreen:        uiOffscreen,
            minimapOffscreen:   minimapOffscreen,
            windowWidth:        window.innerWidth,
            windowHeight:       window.innerHeight,
            screenWidth:        window.screen.width,
            screenHeight:       window.screen.height,
            devicePixelRatio:   window.devicePixelRatio,
            gameMode:           props.gameMode

        // @ts-ignore
        }, [ sceneOffscreen, uiOffscreen, minimapOffscreen ] );

    };

    public dispatchEvent = ( eventName: string, params?: any, buffers: Transferable[] = [] ) : void => {

        if ( ! this.worker ) return;

        this.worker.postMessage({
            eventName,
            params
        }, buffers );

    };

    public dispose () : void {

        this.sceneRenderCanvas.remove();
        this.minimapCanvas.remove();
        this.uiCanvas.remove();

        window.removeEventListener( 'resize', this.onResize );

        this.dispatchEvent( GameEvents.DISPOSE );

    };

    //

    private onResize = () : void => {

        this.dispatchEvent( GameEvents.RESIZE_GFX, {
            windowWidth:    window.innerWidth,
            windowHeight:   window.innerHeight,
            screenWidth:    window.screen.width,
            screenHeight:   window.screen.height
        });

    };

    private onWorkerMessage = ( event: MessageEvent ) : void => {

        this.emit( event.data.eventName, event.data.params );

    };

};

export const GameMain = new GameMainCore();
GameMain.init();
