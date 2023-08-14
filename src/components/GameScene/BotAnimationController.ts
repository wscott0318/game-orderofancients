import * as THREE from "three";
import { ANIMATION_TYPE, BOT_ANIMATION_CLIPS } from "../../constants/bot";

export class BotAnimationController {
    mixer: THREE.AnimationMixer;
    clips: any;
    animations: any;
    mesh: any;
    botType: any;
    clock: THREE.Clock;

    constructor({ animations, mesh, botType }: any) {
        this.clips = {};
        this.mixer = new THREE.AnimationMixer(mesh);
        this.animations = animations;
        this.mesh = mesh;
        this.botType = botType;
        this.clock = new THREE.Clock();

        this.initialize();
    }

    initAnimationClips() {
        this.clips[ANIMATION_TYPE["walk"]] = THREE.AnimationUtils.subclip(
            this.animations[0],
            "walk",
            BOT_ANIMATION_CLIPS[this.botType]["walk"].startFrame,
            BOT_ANIMATION_CLIPS[this.botType]["walk"].endFrame,
            24
        );

        this.clips[ANIMATION_TYPE["attack"]] = THREE.AnimationUtils.subclip(
            this.animations[0],
            "attack",
            BOT_ANIMATION_CLIPS[this.botType]["attack"].startFrame,
            BOT_ANIMATION_CLIPS[this.botType]["attack"].endFrame,
            24
        );

        this.clips[ANIMATION_TYPE["dead"]] = THREE.AnimationUtils.subclip(
            this.animations[0],
            "dead",
            BOT_ANIMATION_CLIPS[this.botType]["dead"].startFrame,
            BOT_ANIMATION_CLIPS[this.botType]["dead"].endFrame,
            24
        );
    }

    playAnimation(animType: any) {
        this.mixer.stopAllAction();

        const action = this.mixer.clipAction(this.clips[animType]);

        if (animType === ANIMATION_TYPE["dead"]) {
            action.clampWhenFinished = true;
            action.setLoop(THREE.LoopOnce, 2);
        }

        action.play();
    }

    stopAnimation() {
        this.mixer.stopAllAction();
    }

    initialize() {
        this.initAnimationClips();

        this.playAnimation(ANIMATION_TYPE["walk"]);
    }

    dispose() {
        this.mixer.stopAllAction();

        this.mixer.uncacheClip(this.clips[ANIMATION_TYPE["walk"]]);
        this.mixer.uncacheClip(this.clips[ANIMATION_TYPE["attack"]]);
        this.mixer.uncacheClip(this.clips[ANIMATION_TYPE["dead"]]);
        this.mixer.uncacheRoot(this.mesh);
    }

    tick() {
        const delta = this.clock.getDelta();
        this.mixer.update(delta);
    }
}
