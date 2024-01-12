import { Vector3 } from "three";

import { AssetsManager } from "./managers/AssetsManager";
import { createExplosion } from "./Particles/Explosion2";
import { createLevelUp } from "./Particles/LevelUp";
import { createToonProjectile } from "./Particles/ToonProjectile";
import { SceneRenderer } from "./rendering/SceneRenderer";

//

export class ParticleEffect {

    public sceneRenderer: SceneRenderer;
    public assetsManager: AssetsManager;

    //

    constructor( params: any ) {

        this.sceneRenderer = params.sceneRenderer;
        this.assetsManager = params.assetsManager;

    }

    public addExplosion ( position: THREE.Vector3 ) {

        const explosion = createExplosion(
            this.sceneRenderer._particleRenderer,
            this.assetsManager._particleTextures
        );

        explosion.position.x = position.x;
        explosion.position.y = position.y;
        explosion.position.z = position.z;

        explosion.scale.set(0.1, 0.1, 0.1);

        this.sceneRenderer.getScene().add( explosion );

    }

    public addLevelUp ( position: Vector3 ) {

        const particle = createLevelUp(
            this.sceneRenderer._particleRenderer,
            this.assetsManager._particleTextures
        );

        particle.position.x = position.x;
        particle.position.y = position.y;
        particle.position.z = position.z;

        particle.scale.set(0.4, 0.4, 0.4);

        this.sceneRenderer.getScene().add( particle );

    }

    public ToonProjectTile ( position: Vector3 ) {

        const particle = createToonProjectile(
            this.sceneRenderer._particleRenderer,
            this.assetsManager._particleTextures
        );

        particle.position.x = position.x;
        particle.position.y = position.y;
        particle.position.z = position.z;

        particle.scale.set(1, 1, 1);

        this.sceneRenderer.getScene().add(particle);

        return particle;

    }

    public addParticle ( position: Vector3 ) : void {

        const particle = createToonProjectile(
            this.sceneRenderer._particleRenderer,
            this.assetsManager._particleTextures
        );

        particle.position.x = position.x;
        particle.position.y = position.y;
        particle.position.z = position.z;

        particle.scale.set(0.1, 0.1, 0.1);

        this.sceneRenderer.getScene().add( particle );

    }

    public tick () : void {}

}
