
import TWEEN from "@tweenjs/tween.js";
import { VSMShadowMap, WebGLRenderer } from 'three';

import { GameScene } from './GameScene';
import { ComposerPass } from './Composer';
import { GameWorker } from '../../GameWorker';
import { GameEvents } from '../../../Events';
import { UILayer, UIText } from "./UILayer";

//

export interface IGfxInitProps {
    // @ts-ignore
    sceneOffscreen:             OffscreenCanvas;
    // @ts-ignore
    uiOffscreen:                OffscreenCanvas;
    // @ts-ignore
    minimapOffscreen:           OffscreenCanvas;
    windowWidth:                number;
    windowHeight:               number;
    screenWidth:                number;
    screenHeight:               number;
    devicePixelRatio:           number;
};

//

class GfxCore {

    public inited: boolean = false;

    public width: number = 0;
    public height: number = 0;
    public screenWidth: number = 0;
    public screenHeight: number = 0;
    public devicePixelRatio: number = 1;

    public renderer: WebGLRenderer;

    public activeGameScene: GameScene = null;

    private resolution: number = 1;
    private composer: ComposerPass;
    private loopEnabled: boolean = true;
    private renderingEnabled: boolean = true;

    // @ts-ignore
    public minimapCanvas: OffscreenCanvas = null;

    private frame: number = 0;
    public fps: number = 0;
    private lastFpsUpdateTime: number = 0;

    //

    public init ( params: IGfxInitProps ) : void {

        GameWorker.addListener( GameEvents.RESIZE_GFX, this.resize );

        this.minimapCanvas = params.minimapOffscreen;
        this.width = params.windowWidth;
        this.height = params.windowHeight;
        this.screenWidth = params.screenWidth;
        this.screenHeight = params.screenHeight;
        this.devicePixelRatio = params.devicePixelRatio;

        this.composer = new ComposerPass();

        this.createRenderer( params.sceneOffscreen );

        UILayer.uiCanvas = params.uiOffscreen;
        UILayer.resize( this.width, this.height );
        UILayer.init();

        //

        this.inited = true;

    };

    public setActiveScene ( gameScene: GameScene ) : void {

        this.activeGameScene = gameScene;

    };

    public update = ( delta: number, time: number ) : void => {

        if ( ! this.inited ) return;
        if ( ! this.loopEnabled ) return;

        if ( ! this.renderingEnabled ) return;

        this.renderer.info.reset();

        if ( this.activeGameScene ) {

            this.activeGameScene.render( delta, time );
            this.composer.readBuffers[ 'sceneDiffuse' ] = this.activeGameScene.getRenderTarget().texture;

        }

        this.composer.render( this.renderer );

        UILayer.render( this.activeGameScene.camera );

        TWEEN.update();

        //

        this.frame ++;

        if ( this.frame % 200 === 0 ) {

            const fpsDeltaTime = time - this.lastFpsUpdateTime;
            this.lastFpsUpdateTime = time;

            this.fps = Math.round( 200 / fpsDeltaTime * 1000 );

        }

    };

    public dispose () : void {

        if ( this.activeGameScene ) {

            this.activeGameScene.dispose();
            this.activeGameScene = null;

        }

        this.minimapCanvas = null;
        this.composer = null;
        this.renderer.dispose();

        this.width = 0;
        this.height = 0;
        this.activeGameScene = null;
        this.inited = false;

    };

    //

    private resize = ( params: { windowWidth: number, windowHeight: number } ) : void => {

        this.width = params.windowWidth;
        this.height = params.windowHeight;

        this.renderer.setSize( this.width, this.height, false );

        UILayer.resize( this.width, this.height );

        if ( this.activeGameScene ) this.activeGameScene.resize( this.devicePixelRatio );

    };

    // @ts-ignore
    private createRenderer ( canvas: OffscreenCanvas ) : void {

        this.renderer = new WebGLRenderer({ antialias: false, canvas: canvas });

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = VSMShadowMap;
        this.renderer.info.autoReset = false;
        this.renderer.setPixelRatio( this.devicePixelRatio );
        this.renderer.setSize( this.width, this.height, false );

    };

};

//

export const Gfx = new GfxCore();
