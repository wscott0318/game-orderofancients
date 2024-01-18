
import { Vector3 } from "three";

import { AssetsManager } from "./managers/AssetsManager";
import { createExplosion } from "./gfx/particles/Explosion2";
import { createLevelUp } from "./gfx/particles/LevelUp";
import { createToonProjectile } from "./gfx/particles/ToonProjectile";
import { GameScene } from "./gfx";

//

export class ParticleEffect {

    public gameScene: GameScene;
    public assetsManager: AssetsManager;

    //

    constructor( params: any ) {

        this.gameScene = params.game;
        this.assetsManager = params.assetsManager;

    }

    public addExplosion ( position: THREE.Vector3 ) {

        const explosion = createExplosion(
            this.gameScene.particleRenderer,
            this.assetsManager._particleTextures
        );

        explosion.position.x = position.x;
        explosion.position.y = position.y;
        explosion.position.z = position.z;

        explosion.scale.set(0.1, 0.1, 0.1);

        this.gameScene.add( explosion );

    }

    public addLevelUp ( position: Vector3 ) {

        const particle = createLevelUp(
            this.gameScene.particleRenderer,
            this.assetsManager._particleTextures
        );

        particle.position.x = position.x;
        particle.position.y = position.y;
        particle.position.z = position.z;

        particle.scale.set(0.4, 0.4, 0.4);

        this.gameScene.add( particle );

    }

    public ToonProjectTile ( position: Vector3 ) {

        const particle = createToonProjectile(
            this.gameScene.particleRenderer,
            this.assetsManager._particleTextures
        );

        particle.position.x = position.x;
        particle.position.y = position.y;
        particle.position.z = position.z;

        particle.scale.set(1, 1, 1);

        this.gameScene.add(particle);

        return particle;

    }

    public addParticle ( position: Vector3 ) : void {

        const particle = createToonProjectile(
            this.gameScene.particleRenderer,
            this.assetsManager._particleTextures
        );

        particle.position.x = position.x;
        particle.position.y = position.y;
        particle.position.z = position.z;

        particle.scale.set(0.1, 0.1, 0.1);

        this.gameScene.add( particle );

    }

    public tick () : void {}

}
