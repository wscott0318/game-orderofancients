
import { AmbientLight, BoxGeometry, DirectionalLight, DoubleSide, Mesh, MeshStandardMaterial, PlaneGeometry, RepeatWrapping, Scene, TextureLoader } from "three";

import { S3_BUCKET_URL } from "../../../../constants";
import { ResourcesManager } from "../../managers/ResourcesManager";

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
    private directionalLight: DirectionalLight;

    //

    public init ( scene: Scene ) : void {

        this._scene = scene;

        this.initGround();
        this.initLights();

    };

    //

    private initLights () : void {

        this.ambientLight = new AmbientLight( 0xffffff, 0.2 );
        this._scene.add( this.ambientLight );

        this.directionalLight = new DirectionalLight( 0xffffff, 0.5 );
        this.directionalLight.position.set( 20, 20, 20 );
        this.directionalLight.lookAt( 0, 0, 0 );
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 1024;
        this.directionalLight.shadow.mapSize.height = 1024;
        this.directionalLight.shadow.camera.far = 300;
        this.directionalLight.shadow.camera.near = 10;
        this.directionalLight.shadow.camera.left = - 50;
        this.directionalLight.shadow.camera.right = 50;
        this.directionalLight.shadow.camera.top = 50;
        this.directionalLight.shadow.camera.bottom = - 50;
        this.directionalLight.shadow.bias = - 0.0002;
        this.directionalLight.shadow.radius = 2;
        this._scene.add( this.directionalLight );

    };

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

    };

    private initGround () : void {

        const envModel = ResourcesManager.getModel("Environment")?.scene;
        this._scene.add( envModel );

        envModel.traverse( ( child: any ) => {

            if ( child.isMesh ) {

                if ( child.name !== 'Plane' ) {

                    child.castShadow = true;

                }

                child.receiveShadow = true;

                ( child.material as MeshStandardMaterial ).roughnessMap = null;

            }

        });

    };

    public update () : void {

        // nothing here

    };

};
