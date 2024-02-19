
import { ShaderMaterial, Texture, WebGLRenderTarget, WebGLRenderer } from "three";

import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass';
import { ComposerMaterial } from '../materials/postprocess/Composer.Material';
// import { FXAAShader } from '../materials/postprocess/FXAA.Shader';

//

export class ComposerPass {

    public name: string = 'ComposerPass';
    public fsQuad: FullScreenQuad;
    public _output: number = 0;

    public renderTarget: WebGLRenderTarget = new WebGLRenderTarget( 1, 1, { depthBuffer: false } );
    public readBuffers: { [key:string]: Texture } = {};

    private fxaaEnabled: boolean = false;

    public ready: boolean = false;

    //

    constructor () {

        this.fsQuad = new FullScreenQuad();
        this.updateMaterial();

    };

    public update () : void {

        this.fxaaEnabled = false;

        this.updateMaterial();

        this.ready = true;

    };

    public updateMaterial () : void {

        // const uniforms: any[] = [ ComposeShader.uniforms, FXAAShader.uniforms ];

        this.fsQuad.material = new ComposerMaterial();

        // this.fsQuad.material.onBeforeCompile = ( shader ) => {

        //     shader.fragmentShader = shader.fragmentShader.replace( '#import <FXAA>', FXAAShader.fragmentShaderFunc );

        // };

    };

    public render ( renderer: WebGLRenderer ) : void {

        // if (
        //     this.fxaaEnabled !== ( Game.SettingsManager.gfx.antialiasMode === 'FXAA' ) ||
        // ) {

        //     this.update();

        // }

        const composerMaterial = this.fsQuad.material as ShaderMaterial;

        for ( const readBufferName in this.readBuffers ) {

            if ( ! composerMaterial.uniforms[ readBufferName ] ) continue;
            composerMaterial.uniforms[ readBufferName ].value = this.readBuffers[ readBufferName ];

        }

        renderer.setRenderTarget( null );
        renderer.clear();
        this.fsQuad.render( renderer );

    }

}
