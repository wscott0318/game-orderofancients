
import { RawShaderMaterial } from "three";

//

export class ComposerMaterial extends RawShaderMaterial {

    constructor () {

        super();

        this.name = `PPComposerMaterial`;

        this.vertexShader = /* glsl */`
            precision highp float;

            attribute vec3 position;
            attribute vec2 uv;

            varying vec2 vUv;

            void main () {

                vUv = uv;

                gl_Position = vec4( position, 1.0 );

            }
        `;

        this.fragmentShader = /* glsl */`
            precision lowp float;

            uniform sampler2D sceneDiffuse;

            uniform float sepia;
            uniform float contrast;
            uniform float brightness;
            uniform float fade;

            varying vec2 vUv;

            // #ifdef FXAA

            //     #import <FXAA>

            // #endif

            vec4 sRGBTransferOETF( in vec4 value ) {
                return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
            }

            //

            void main () {

                vec4 texel;

                // antialias or direct texture

                // #ifdef FXAA

                //     texel = applyFXAA( sceneDiffuse, vUv );

                // #else

                    texel = texture2D( sceneDiffuse, vUv );

                // #endif

                // brightness & contrast effect

                float saturation = 1.05; // adjust this value to increase/decrease saturation
                vec3 gray = vec3( dot( vec3( 0.2126, 0.7152, 0.0722 ), texel.rgb ) );
                texel.rgb = mix( gray, texel.rgb, saturation );

                float contrastValue = contrast * 2.55;
                float factor = ( 255.0 + contrastValue ) / ( 255.01 - contrastValue );
                texel.rgb = brightness * ( factor * ( texel.rgb - vec3( 0.5 ) ) + vec3( 0.5 ) );

                // sepia effect

                vec3 deadColor = vec3( ( texel.r + texel.g + texel.b ) / 3.0 );
                deadColor.r *= 1.1;
                deadColor.b *= 1.02;
                texel.rgb = sepia * deadColor.rgb + ( 1.0 - sepia ) * texel.rgb;

                // fade stage screen

                texel.rgb = clamp( mix( vec3( 0.0 ), texel.rgb, fade ), vec3( 0.0 ), vec3( 1.0 ) );

                //

                gl_FragColor = sRGBTransferOETF( texel );

            }
        `;

        this.uniforms = {
            sceneDiffuse:           { value: null },
            sepia:                  { value: 0 },
            brightness:             { value: 1 },
            contrast:               { value: 1 },
            fade:                   { value: 0 }
        };

    }

}
