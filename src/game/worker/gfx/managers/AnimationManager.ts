
import { gsap, Circ } from "gsap";
import { Camera, HemisphereLight, SpotLight, Vector2, Vector3 } from "three";

import { CAMERA_POS } from "../../../../constants";
import { TOWER_POSITIONS } from "../../../../constants/tower";
import { GameScene } from "..";
import { GameWorker } from "../../GameWorker";

//

export class AnimationManager {

    public gameScene: GameScene;
    public _towerPosition: Vector3;
    public _camera: Camera;
    public _spotLight: SpotLight;
    public _hemiLight: HemisphereLight;

    //

    constructor ( gameScene: GameScene ) {

        this.gameScene = gameScene;

        const playerIndex = GameWorker.playerIndex;

        this._towerPosition = new Vector3(
            TOWER_POSITIONS[ playerIndex ].x,
            TOWER_POSITIONS[ playerIndex ].y,
            TOWER_POSITIONS[ playerIndex ].z
        );

        // this._spotLight = this._sceneRenderer._spotLightArray[ params.playerIndex ];
        // this._hemiLight = this._sceneRenderer._hemiLight;

    };

    public camera_Down () : void {

        gsap.to(this._camera.position, {
            ...CAMERA_POS.sideView,
            duration: 3,
            ease: Circ.easeIn,
            onUpdate: () => {
                this._camera.lookAt(this._towerPosition);
            },
        });

    };

    public camera_Rotate () : void {

        const camera2DPos = new Vector2(
            this._camera.position.x,
            this._camera.position.y
        );

        const tower2DPos = new Vector2(
            this._towerPosition.x,
            this._towerPosition.y
        );

        const rotPos = {
            radius: camera2DPos.distanceTo(tower2DPos),
            angle: 0,
        };

        gsap.to(rotPos, {
            angle: -Math.PI * 2,
            duration: 10,
            repeat: -1,
            ease: "none",
            onUpdate: () => {
                this._camera.position.x =
                    Math.cos(rotPos.angle) * rotPos.radius;
                this._camera.position.z =
                    Math.sin(rotPos.angle) * rotPos.radius;
                this._camera.lookAt(this._towerPosition);
            },
        });

    };

    public camera_diorama () : void {

        const camPos = this._camera.position;

        gsap.to(camPos, {
            x: Math.random() * 60 - 30,
            z: Math.random() * 60 - 30,
            y: Math.random() * 10 + 10,
            duration: 10,
            repeat: -1,
            onUpdate: () => {
                this._camera.lookAt(this._towerPosition);
            },
        });

    };

    public light_attention () : void {

        // this._sceneRenderer._spotLightArray.forEach( ( spotLight: SpotLight ) => {

        //     gsap.from(spotLight, {
        //         angle: 0,
        //         duration: 2,
        //         ease: Circ.easeIn,
        //     });

        // });

    };

    public dispose () : void {

        // todo

    };

};
