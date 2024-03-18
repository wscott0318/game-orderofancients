
import { Vector3 } from "three";

import { createExplosion } from "../particles/Explosion2";
import { createLevelUp } from "../particles/LevelUp";
import { createToonProjectile } from "../particles/ToonProjectile";
import { GameScene } from "..";
import { ResourcesManager } from "../../managers/ResourcesManager";

//

export class ParticleEffect {

    public gameScene: GameScene;

    //

    constructor ( gameScene: GameScene ) {

        this.gameScene = gameScene;

    };

    public addExplosion ( position: Vector3 ) {

        const explosion = createExplosion(
            this.gameScene.particleRenderer,
            [ ResourcesManager.getTexture("Particles1")!, ResourcesManager.getTexture("Particles2")! ]
        );

        explosion.position.x = position.x;
        explosion.position.y = position.y;
        explosion.position.z = position.z;

        explosion.scale.setScalar( 0.1 );

        this.gameScene.add( explosion );

    };

    public addLevelUp ( position: Vector3 ) {

        const particle = createLevelUp(
            this.gameScene.particleRenderer,
            [ ResourcesManager.getTexture("Particles1")!, ResourcesManager.getTexture("Particles2")! ]
        );

        particle.position.x = position.x;
        particle.position.y = position.y;
        particle.position.z = position.z;

        particle.scale.setScalar( 0.4 );

        this.gameScene.add( particle );

    };

    public ToonProjectTile ( position: Vector3 ) {

        const particle = createToonProjectile(
            this.gameScene.particleRenderer,
            [ ResourcesManager.getTexture("Particles1")!, ResourcesManager.getTexture("Particles2")! ]
        );

        particle.position.x = position.x;
        particle.position.y = position.y;
        particle.position.z = position.z;

        particle.scale.set(1, 1, 1);

        this.gameScene.add(particle);

        return particle;

    };

    public addParticle ( position: Vector3 ) : void {

        const particle = createToonProjectile(
            this.gameScene.particleRenderer,
            [ ResourcesManager.getTexture("Particles1")!, ResourcesManager.getTexture("Particles2")! ]
        );

        particle.position.x = position.x;
        particle.position.y = position.y;
        particle.position.z = position.z;

        particle.scale.set(0.1, 0.1, 0.1);

        this.gameScene.add( particle );

    };

    public tick () : void {}

    public dispose () : void {

        //

    };

};
