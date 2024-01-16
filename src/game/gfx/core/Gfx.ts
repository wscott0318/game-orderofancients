
import { WebGLRenderer } from 'three';

import { GameScene } from './GameScene';
import { ComposerPass } from './Composer';

//

class GfxCore {

    public inited: boolean = false;

    public width: number = window.innerWidth;
    public height: number = window.innerHeight;

    public renderer: WebGLRenderer;

    public activeGameScene: GameScene;
    private gameScenes: GameScene[] = [];

    private prevRenderTime: number = 0;

    private resolution: number = 1;
    private composer: ComposerPass;
    private loopEnabled: boolean = true;
    private renderingEnabled: boolean = true;

    //

    public init ( params: { canvasDiv: HTMLElement } ) : void {

        this.composer = new ComposerPass();

        this.createRenderer( params.canvasDiv );

        //

        this.inited = true;

    }

    public setActiveScene ( gameScene: GameScene ) : void {

        this.activeGameScene = gameScene;

    }

    private createRenderer ( canvasDiv: HTMLElement ) : void {

        this.renderer = new WebGLRenderer({ antialias: false });
        canvasDiv.appendChild( this.renderer.domElement );

        this.renderer.setSize( this.width * this.resolution, this.height * this.resolution );

    }

    public update = () : void => {

        if ( ! this.inited ) return;
        if ( ! this.loopEnabled ) return;

        requestAnimationFrame( this.update );

        if ( ! this.renderingEnabled ) return;

        const time = performance.now();
        const delta = this.prevRenderTime ? time - this.prevRenderTime : 0;

        if ( this.activeGameScene ) {

            this.activeGameScene.update( delta, time );
            this.composer.readBuffers[ 'sceneDiffuse' ] = this.activeGameScene.getRenderTarget().texture;

        }

        this.composer.render( this.renderer );

        this.prevRenderTime = time;

    }

}

//

export const Gfx = new GfxCore();
