
import TWEEN from "@tweenjs/tween.js";
import { VSMShadowMap, WebGLRenderer } from 'three';

import { GameScene } from './GameScene';
import { ComposerPass } from './Composer';
import { GameWorker } from '../../GameWorker';
import { GameEvents } from '../../../Events';

//

export interface IGfxInitProps {
    // @ts-ignore
    offscreen:          OffscreenCanvas;
    windowWidth:        number;
    windowHeight:       number;
    screenWidth:        number;
    screenHeight:       number;
    devicePixelRatio:   number;
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

    public activeGameScene: GameScene | null = null;

    private resolution: number = 1;
    private composer: ComposerPass;
    private loopEnabled: boolean = true;
    private renderingEnabled: boolean = true;

    //

    public init ( params: IGfxInitProps ) : void {

        GameWorker.addListener( GameEvents.RESIZE_GFX, this.resize );

        this.width = params.windowWidth;
        this.height = params.windowHeight;
        this.screenWidth = params.screenWidth;
        this.screenHeight = params.screenHeight;
        this.devicePixelRatio = params.devicePixelRatio;

        this.composer = new ComposerPass();

        this.createRenderer( params.offscreen );

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

        if ( this.activeGameScene ) {

            this.activeGameScene.render( delta, time );
            this.composer.readBuffers[ 'sceneDiffuse' ] = this.activeGameScene.getRenderTarget().texture;

        }

        this.composer.render( this.renderer );

        TWEEN.update();

    };

    public dispose () : void {

        if ( this.activeGameScene ) {

            this.activeGameScene.dispose();

        }

        this.renderer.dispose();

        this.activeGameScene = null;
        this.inited = false;

    };

    //

    private resize = ( params: { windowWidth: number, windowHeight: number } ) : void => {

        this.width = params.windowWidth;
        this.height = params.windowHeight;

        this.renderer.setSize( this.width, this.height, false );

        if ( this.activeGameScene ) this.activeGameScene.resize( this.devicePixelRatio );

    };

    // @ts-ignore
    private createRenderer ( canvas: OffscreenCanvas ) : void {

        this.renderer = new WebGLRenderer({ antialias: false, canvas: canvas });

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = VSMShadowMap;
        this.renderer.setPixelRatio( this.devicePixelRatio );
        this.renderer.setSize( this.width, this.height, false );

    };

};

//

export const Gfx = new GfxCore();
