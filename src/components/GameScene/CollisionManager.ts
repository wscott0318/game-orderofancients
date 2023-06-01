import { BOT_PROPS, BOT_STATUS, TOWER_HEIGHT } from "../../constants";
import { BotManager } from "./BotManager";
import { Sprite } from "./Instances/Sprite";
import { ParticleEffect } from "./ParticleEffect";
import SpriteManager from "./SpriteManager";
import { FiringStone } from "./Sprites/FiringStone";
import { TextSprite } from "./Sprites/Text";
import { PlayerState } from "./States/PlayerState";
import { TowerManager } from "./TowerManager";
import { SceneRenderer } from "./rendering/SceneRenderer";
import * as THREE from "three";

export class CollisionManager {
    sceneRenderer: SceneRenderer;
    towerManager: TowerManager;
    botManager: BotManager;
    spriteManager: SpriteManager;
    particleEffect: ParticleEffect;
    playerState: PlayerState;

    constructor({
        sceneRenderer,
        towerManager,
        botManager,
        spriteManager,
        particleEffect,
        playerState,
    }: any) {
        this.sceneRenderer = sceneRenderer;
        this.towerManager = towerManager;
        this.botManager = botManager;
        this.spriteManager = spriteManager;
        this.particleEffect = particleEffect;
        this.playerState = playerState;
    }

    checkIfTowerDetectEnemy() {
        if (this.towerManager._claimTime > 0) return;

        const attackRange = this.towerManager._tower.attackRange;
        const botArray = this.botManager.botArray;
        const canShootBotArray = [] as any;
        for (let i = 0; i < botArray.length; i++) {
            if (botArray[i].status === BOT_STATUS["dead"]) continue;

            const distance = botArray[i].mesh.position.distanceTo(
                this.towerManager._towerMesh.position
            );

            if (distance < attackRange)
                canShootBotArray.push({
                    distance: distance,
                    bot: botArray[i],
                });
        }

        if (!canShootBotArray.length) return;

        canShootBotArray.sort((a: any, b: any) => {
            return a.distance - b.distance;
        });

        const startPos = new THREE.Vector3(
            this.towerManager._towerMesh.position.x,
            this.towerManager._towerMesh.position.y,
            this.towerManager._towerMesh.position.z
        );
        startPos.y = TOWER_HEIGHT - 4;

        const sprite = new Sprite({
            object: new FiringStone({
                sceneRenderer: this.sceneRenderer,
                startPos,
            }),
            targetObject: canShootBotArray[0].bot,
            damage: this.towerManager._tower.damage,
        });

        this.spriteManager.addSprite(sprite);

        this.towerManager._claimTime = this.towerManager._tower.attackSpeed;
    }

    checkSpriteCollision() {
        const spriteArray = this.spriteManager.spriteArray;
        const newSpriteArray = [];

        for (let i = 0; i < spriteArray.length; i++) {
            const sprite = spriteArray[i] as Sprite;

            if (spriteArray[i].checkIfHit()) {
                sprite.targetObject.hp -= sprite.damage;
                sprite.dispose();

                this.particleEffect.addExplosion(sprite.object.mesh.position);
            } else if (
                spriteArray[i].targetObject.status === BOT_STATUS["dead"]
            ) {
                sprite.dispose();
            } else {
                newSpriteArray.push(spriteArray[i]);
            }
        }

        this.spriteManager.spriteArray = newSpriteArray;
    }

    checkBotHealth() {
        for (let i = 0; i < this.botManager.botArray.length; i++) {
            const bot = this.botManager.botArray[i];

            if (bot.hp <= 0 && bot.status !== BOT_STATUS["dead"]) {
                const gold = BOT_PROPS.gold[bot.botType];
                this.playerState.increaseGold(gold);

                const sprite = new TextSprite({
                    text: `+${gold}`,
                    color: `#EED734`,
                    position: new THREE.Vector3(
                        bot.mesh.position.x,
                        bot.mesh.position.y,
                        bot.mesh.position.z
                    ),
                    sceneRenderer: this.sceneRenderer,
                });

                this.spriteManager.addTextSprite(sprite);

                bot.kill();
            }
        }
    }

    checkBotAttack() {
        for (let i = 0; i < this.botManager.botArray.length; i++) {
            const bot = this.botManager.botArray[i];
            if (bot.claimTime <= 0 && bot.status === BOT_STATUS["attack"]) {
                this.towerManager._tower.hp -= bot.attackDamage;
                bot.claimTime = bot.attackSpeed;
            }
        }
    }

    removeDeadBots() {
        const newArray = [];

        for (let i = 0; i < this.botManager.botArray.length; i++) {
            const bot = this.botManager.botArray[i];
            if (!bot.canRemove) newArray.push(bot);
        }

        this.botManager.botArray = newArray;
    }

    tick() {
        /** Remove dead bots */
        this.removeDeadBots();

        /** Fires when bot reaches tower */
        this.checkIfTowerDetectEnemy();

        /** Detect if sprite hits bots */
        this.checkSpriteCollision();

        /** Detect if bot is dead */
        this.checkBotHealth();

        /** Handle bot attacking tower event */
        this.checkBotAttack();
    }
}
