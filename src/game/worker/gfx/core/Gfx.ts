
import { WebGLRenderer } from 'three';
// import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
// import Stats from 'stats-gl';

import { GameScene } from './GameScene';
import { ComposerPass } from './Composer';
import { GameWorker } from '../../GameWorker';

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
    // public uiRenderer: CSS2DRenderer;

    public activeGameScene: GameScene | null = null;
    private gameScenes: GameScene[] = [];

    private prevRenderTime: number = 0;

    private stats: Stats;
    private resolution: number = 1;
    private composer: ComposerPass;
    private loopEnabled: boolean = true;
    private renderingEnabled: boolean = true;

    //

    public init ( params: IGfxInitProps ) : void {

        this.width = params.windowWidth;
        this.height = params.windowHeight;
        this.screenWidth = params.screenWidth;
        this.screenHeight = params.screenHeight;
        this.devicePixelRatio = params.devicePixelRatio;

        // this.stats = new Stats();
        // document.body.appendChild( this.stats.domElement );

        this.composer = new ComposerPass();

        this.createRenderer( params.offscreen );

        //

        this.inited = true;

        this.update();

    };

    public setActiveScene ( gameScene: GameScene ) : void {

        this.activeGameScene = gameScene;

    };

    public update = () : void => {

        if ( ! this.inited ) return;
        if ( ! this.loopEnabled ) return;

        requestAnimationFrame( this.update );

        if ( ! this.renderingEnabled ) return;

        const time = performance.now();
        const delta = this.prevRenderTime ? time - this.prevRenderTime : 0;

        // this.stats.begin();

        if ( this.activeGameScene ) {

            this.activeGameScene.update( delta, time );
            this.composer.readBuffers[ 'sceneDiffuse' ] = this.activeGameScene.getRenderTarget().texture;

        }

        this.composer.render( this.renderer );

        // this.stats.end();
        // this.stats.update();

        // todo: move to game loop later

        if ( GameWorker.inited ) {

            GameWorker.towerManager.update();
            GameWorker.spriteManager.tick();
            GameWorker.particleEffect.tick();

        }

        this.prevRenderTime = time;

    };

    public dispose () : void {

        if ( this.activeGameScene ) {

            this.activeGameScene.dispose();

        }

        // this.uiRenderer.domElement.remove();
        this.renderer.domElement.remove();
        this.renderer.dispose();
        this.gameScenes = [];
        // this.stats.domElement.remove();

        this.activeGameScene = null;

    };

    //

    private resize () : void {

        this.renderer.setSize( this.width, this.height, false );
        // this.uiRenderer.setSize( this.width, this.height );

        if ( this.activeGameScene ) this.activeGameScene.resize();

    };

    // @ts-ignore
    private createRenderer ( canvas: OffscreenCanvas ) : void {

        this.renderer = new WebGLRenderer({ antialias: false, canvas: canvas });

        this.renderer.setPixelRatio( this.devicePixelRatio );
        this.renderer.setSize( this.width, this.height, false );

        //

        // this.uiRenderer = new CSS2DRenderer();
        // this.uiRenderer.setSize( this.width, this.height );
        // this.uiRenderer.domElement.id = 'uiRenderer';
        // this.uiRenderer.domElement.style.position = 'absolute';
        // this.uiRenderer.domElement.style.top = '0px';
        // document.body.appendChild( this.uiRenderer.domElement );

    };

};

//

export const Gfx = new GfxCore();
