
import { AnimationMixer, AnimationUtils, Clock, LoopOnce } from "three";

import { ANIMATION_TYPE, BOT_ANIMATION_CLIPS } from "../../../../constants/bot";

//

export class BotAnimationController {

    public mixer: AnimationMixer;
    public clips: any;
    public animations: any;
    public mesh: any;
    public botType: any;
    public clock: Clock;

    constructor ( { animations, mesh, botType }: any ) {

        this.clips = {};
        this.mixer = new AnimationMixer(mesh);
        this.animations = animations;
        this.mesh = mesh;
        this.botType = botType;
        this.clock = new Clock();

        this.initialize();

    };

    public initAnimationClips () {

        this.clips[ANIMATION_TYPE["walk"]] = AnimationUtils.subclip(
            this.animations[0],
            "walk",
            BOT_ANIMATION_CLIPS[this.botType]["walk"].startFrame,
            BOT_ANIMATION_CLIPS[this.botType]["walk"].endFrame,
            24
        );

        this.clips[ANIMATION_TYPE["attack"]] = AnimationUtils.subclip(
            this.animations[0],
            "attack",
            BOT_ANIMATION_CLIPS[this.botType]["attack"].startFrame,
            BOT_ANIMATION_CLIPS[this.botType]["attack"].endFrame,
            24
        );

        this.clips[ANIMATION_TYPE["dead"]] = AnimationUtils.subclip(
            this.animations[0],
            "dead",
            BOT_ANIMATION_CLIPS[this.botType]["dead"].startFrame,
            BOT_ANIMATION_CLIPS[this.botType]["dead"].endFrame,
            24
        );

    };

    public playAnimation ( animType: any ) {

        this.mixer.stopAllAction();

        const action = this.mixer.clipAction(this.clips[animType]);

        if (animType === ANIMATION_TYPE["dead"]) {

            action.clampWhenFinished = true;
            action.setLoop(LoopOnce, 2);

        }

        action.play();

    };

    public stopAnimation () {

        this.mixer.stopAllAction();

    };

    public initialize () {

        this.initAnimationClips();
        this.playAnimation(ANIMATION_TYPE["walk"]);

    };

    public dispose () {

        this.mixer.stopAllAction();

        this.mixer.uncacheClip(this.clips[ANIMATION_TYPE["walk"]]);
        this.mixer.uncacheClip(this.clips[ANIMATION_TYPE["attack"]]);
        this.mixer.uncacheClip(this.clips[ANIMATION_TYPE["dead"]]);
        this.mixer.uncacheRoot(this.mesh);

    };

    public tick () {

        const delta = this.clock.getDelta();
        this.mixer.update(delta);

    };

};
