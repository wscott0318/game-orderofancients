
import { PerspectiveCamera, Scene, WebGLRenderTarget } from 'three';

import { Gfx } from './Gfx';

//

export class GameScene {

    public scene: Scene = new Scene();
    public camera: PerspectiveCamera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    private _renderTarget: WebGLRenderTarget;

    //

    public init () : void {

        this._renderTarget = new WebGLRenderTarget( Gfx.width, Gfx.height );

    }

    public update ( delta: number, time: number ) : void {

        Gfx.renderer.setRenderTarget( this._renderTarget );

    }

    public resize () : void {

        const width = Gfx.width;
        const height = Gfx.height;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this._renderTarget.setSize( width, height );

    }

    public getRenderTarget () : WebGLRenderTarget {

        return this._renderTarget;

    }

    public dispose () : void {

        this.scene.children = [];
        this._renderTarget.dispose();

    }

}
