import AssetsManager from "./AssetsManager";
import { createExplosion } from "./Particles/Explosion2";
import { createLevelUp } from "./Particles/LevelUp";
import { createToonProjectile } from "./Particles/ToonProjectile";
import { SceneRenderer } from "./rendering/SceneRenderer";

export * as THREE from "three";

export class ParticleEffect {
    sceneRenderer: SceneRenderer;
    assetsManager: AssetsManager;

    constructor({ sceneRenderer, assetsManager }: any) {
        this.sceneRenderer = sceneRenderer;
        this.assetsManager = assetsManager;
    }

    addExplosion(position: THREE.Vector3) {
        const explosion = createExplosion(
            this.sceneRenderer._particleRenderer,
            this.assetsManager._particleTextures
        );

        explosion.position.x = position.x;
        explosion.position.y = position.y;
        explosion.position.z = position.z;

        explosion.scale.set(0.1, 0.1, 0.1);

        this.sceneRenderer.getScene().add(explosion);
    }

    addLevelUp(position: THREE.Vector3) {
        const particle = createLevelUp(
            this.sceneRenderer._particleRenderer,
            this.assetsManager._particleTextures
        );

        particle.position.x = position.x;
        particle.position.y = position.y;
        particle.position.z = position.z;

        particle.scale.set(0.4, 0.4, 0.4);

        this.sceneRenderer.getScene().add(particle);
    }

    ToonProjectTile(position: THREE.Vector3) {
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

    addParticle(position: THREE.Vector3) {
        const particle = createToonProjectile(
            this.sceneRenderer._particleRenderer,
            this.assetsManager._particleTextures
        );

        particle.position.x = position.x;
        particle.position.y = position.y;
        particle.position.z = position.z;

        particle.scale.set(0.1, 0.1, 0.1);

        this.sceneRenderer.getScene().add(particle);
    }

    tick() {}
}
