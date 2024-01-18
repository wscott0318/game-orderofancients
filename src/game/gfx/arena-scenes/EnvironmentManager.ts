
import { AmbientLight, BoxGeometry, DoubleSide, LinearFilter, LinearMipMapLinearFilter, Mesh, MeshStandardMaterial, PlaneGeometry, RepeatWrapping, Scene, TextureLoader, sRGBEncoding } from "three";

import { S3_BUCKET_URL } from "../../../constants";

const groundTex = S3_BUCKET_URL + "/assets/textures/ground/small2.png";
const tourPX = S3_BUCKET_URL + "/assets/textures/sky/tour_px.jpg";
const tourNX = S3_BUCKET_URL + "/assets/textures/sky/tour_nx.jpg";
const tourPY = S3_BUCKET_URL + "/assets/textures/sky/tour_py.jpg";
const tourNY = S3_BUCKET_URL + "/assets/textures/sky/tour_ny.jpg";
const tourPZ = S3_BUCKET_URL + "/assets/textures/sky/tour_pz.jpg";
const tourNZ = S3_BUCKET_URL + "/assets/textures/sky/tour_nz.jpg";

export class EnvironmentManager {

    private _scene: Scene;
    private _models: any;

    private ambientLight: AmbientLight;

    //

    public init ( scene: Scene ) : void {

        this._scene = scene;

        this.initGround();
        this.initSkyBox();
        this.initLights();

        // this._scene.add(this._models.environment.scene);

    }

    //

    private initLights () : void {

        this.ambientLight = new AmbientLight( 0xffffff, 0.5 );
        this._scene.add( this.ambientLight );

    }

    private initSkyBox () : void {

        const geometry = new BoxGeometry( 1000, 1000, 1000 );
        const texturesString = [ tourPX, tourNX, tourPY, tourNY, tourPZ, tourNZ ];

        const materialArray = texturesString.map( ( textureString: string ) => {

            const texture = new TextureLoader().load( textureString );
            const material = new MeshStandardMaterial({
                side: DoubleSide,
                map: texture,
            });

            return material;

        });

        const skyMesh = new Mesh( geometry, materialArray );
        this._scene.add( skyMesh );

    }

    private initGround () : void {

        const texture = new TextureLoader().load( groundTex );
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set( 400, 400 );
        texture.anisotropy = 16;
        texture.encoding = sRGBEncoding;
        texture.magFilter = LinearFilter;
        texture.minFilter = LinearMipMapLinearFilter;

        const geometry = new PlaneGeometry( 1000, 1000 );
        const material = new MeshStandardMaterial({
            side: DoubleSide,
            map: texture,
        });

        const plane = new Mesh( geometry, material );
        plane.receiveShadow = true;
        plane.rotateX( - Math.PI / 2 );
        plane.position.y = -0.1;

        this._scene.add( plane );

    }

    public update () : void {

        // nothing here

    }

}
