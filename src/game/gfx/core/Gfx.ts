
import { WebGLRenderer } from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import Stats from 'stats-gl';

import { GameScene } from './GameScene';
import { ComposerPass } from './Composer';

//

class GfxCore {

    public inited: boolean = false;

    public width: number = window.innerWidth;
    public height: number = window.innerHeight;

    public renderer: WebGLRenderer;
    public uiRenderer: CSS2DRenderer;

    public activeGameScene: GameScene | null = null;
    private gameScenes: GameScene[] = [];

    private prevRenderTime: number = 0;

    private stats: Stats;
    private resolution: number = 1;
    private composer: ComposerPass;
    private loopEnabled: boolean = true;
    private renderingEnabled: boolean = true;

    //

    public init ( params: { canvasDiv: HTMLElement } ) : void {

        this.stats = new Stats();
        document.body.appendChild( this.stats.domElement );

        this.composer = new ComposerPass();

        this.createRenderer( params.canvasDiv );

        //

        this.inited = true;

    }

    public setActiveScene ( gameScene: GameScene ) : void {

        this.activeGameScene = gameScene;

    }

    public update = () : void => {

        if ( ! this.inited ) return;
        if ( ! this.loopEnabled ) return;

        requestAnimationFrame( this.update );

        if ( window.innerWidth !== this.width || window.innerHeight !== this.height ) {

            this.resize();

        }

        if ( ! this.renderingEnabled ) return;

        const time = performance.now();
        const delta = this.prevRenderTime ? time - this.prevRenderTime : 0;

        this.stats.begin();

        if ( this.activeGameScene ) {

            this.activeGameScene.update( delta, time );
            this.composer.readBuffers[ 'sceneDiffuse' ] = this.activeGameScene.getRenderTarget().texture;

        }

        this.composer.render( this.renderer );

        this.stats.end();
        this.stats.update();

        this.prevRenderTime = time;

    }

    public dispose () : void {

        if ( this.activeGameScene ) {

            this.activeGameScene.dispose();

        }

        this.uiRenderer.domElement.remove();
        this.renderer.domElement.remove();
        this.renderer.dispose();
        this.gameScenes = [];
        this.stats.domElement.remove();

        this.activeGameScene = null;

    }

    //

    private resize () : void {

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.renderer.setSize( this.width * this.resolution, this.height * this.resolution );
        this.uiRenderer.setSize( this.width, this.height );

        if ( this.activeGameScene ) this.activeGameScene.resize();

    };

    private createRenderer ( canvasDiv: HTMLElement ) : void {

        this.renderer = new WebGLRenderer({ antialias: false });
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0px';
        this.renderer.domElement.style.left = '0px';
        this.renderer.domElement.style.zIndex = '1';
        canvasDiv.appendChild( this.renderer.domElement );

        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( this.width * this.resolution, this.height * this.resolution );

        //

        this.uiRenderer = new CSS2DRenderer();
        this.uiRenderer.setSize( this.width, this.height );
        this.uiRenderer.domElement.id = 'uiRenderer';
        this.uiRenderer.domElement.style.position = 'absolute';
        this.uiRenderer.domElement.style.top = '0px';
        document.body.appendChild( this.uiRenderer.domElement );

    }

}

//

export const Gfx = new GfxCore();
