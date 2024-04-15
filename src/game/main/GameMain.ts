
import EventEmitter from "events";
import { LobbyInfo } from "../Types";
import { GameEvents } from "../Events";
import { UIRenderer } from "./UIRenderer";

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

    private uiRenderer: UIRenderer;
    private canvas: HTMLCanvasElement;
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

        const canvas = document.createElement( 'canvas' );
        props.container.appendChild( canvas );
        this.canvas = canvas;

        const minimapCanvas = document.createElement( 'canvas' );
        minimapCanvas.width = 160;
        minimapCanvas.height = 160;
        this.minimapCanvas = minimapCanvas;

        window.addEventListener( 'resize', this.onResize );

        this.uiRenderer = new UIRenderer();
        this.uiRenderer.init( props.container );

        this.addListener( GameEvents.UI_ADD_ELEMENT, this.uiRenderer.addElement );
        this.addListener( GameEvents.UI_REMOVE_ELEMENT, this.uiRenderer.removeElement );
        this.addListener( GameEvents.UI_UPDATE_ELEMENT, this.uiRenderer.updateElement );
        this.addListener( GameEvents.UI_SET_ELEMENT_POSITION, this.uiRenderer.setElementPosition );
        this.addListener( GameEvents.UI_SET_CAMERA_POSITION, this.uiRenderer.setCameraPosition );

        //

        const offscreen = this.canvas.transferControlToOffscreen();
        const minimapOffscreen = this.minimapCanvas.transferControlToOffscreen();

        this.dispatchEvent( GameEvents.INIT_GFX, {

            offscreen:          offscreen,
            minimapOffscreen:   minimapOffscreen,
            windowWidth:        window.innerWidth,
            windowHeight:       window.innerHeight,
            screenWidth:        window.screen.width,
            screenHeight:       window.screen.height,
            devicePixelRatio:   window.devicePixelRatio,
            gameMode:           props.gameMode

        // @ts-ignore
        }, [ offscreen, minimapOffscreen ] );

    };

    public dispatchEvent = ( eventName: string, params?: any, buffers: Transferable[] = [] ) : void => {

        if ( ! this.worker ) return;

        this.worker.postMessage({
            eventName,
            params
        }, buffers );

    };

    public dispose () : void {

        this.canvas.remove();

        window.removeEventListener( 'resize', this.onResize );

        this.removeListener( GameEvents.UI_ADD_ELEMENT, this.uiRenderer.addElement );
        this.removeListener( GameEvents.UI_REMOVE_ELEMENT, this.uiRenderer.removeElement );
        this.removeListener( GameEvents.UI_UPDATE_ELEMENT, this.uiRenderer.updateElement );
        this.removeListener( GameEvents.UI_SET_ELEMENT_POSITION, this.uiRenderer.setElementPosition );
        this.removeListener( GameEvents.UI_SET_CAMERA_POSITION, this.uiRenderer.setCameraPosition );

        this.uiRenderer.dispose();
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
