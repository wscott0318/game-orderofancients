import { DAMAGE_TEXT_COLORS } from "../../constants";
import { BOT_PROPS, BOT_STATUS } from "../../constants/bot";
import { TOWER_HEIGHT } from "../../constants/tower";
import { getDamageMultiplier } from "../../helper/game";
import AssetsManager from "./AssetsManager";
import { BotManager } from "./BotManager";
import { Sprite } from "./Instances/Sprite";
import { ParticleEffect } from "./ParticleEffect";
import SpriteManager from "./SpriteManager";
import { FiringStone } from "./Sprites/FiringStone";
import { TextSprite } from "./Sprites/Text";
import Boulder from "./Sprites/Weapons/Boulder";
import Bow from "./Sprites/Weapons/Bow";
import ChaosOrb from "./Sprites/Weapons/ChaosOrb";
import MagicMissiles from "./Sprites/Weapons/MagicMissiles";
import ThrowingAxe from "./Sprites/Weapons/ThrowingAxe";
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
    assetsManager: AssetsManager;

    constructor({
        sceneRenderer,
        towerManager,
        botManager,
        spriteManager,
        particleEffect,
        playerState,
        assetsManager,
    }: any) {
        this.sceneRenderer = sceneRenderer;
        this.towerManager = towerManager;
        this.botManager = botManager;
        this.spriteManager = spriteManager;
        this.particleEffect = particleEffect;
        this.playerState = playerState;
        this.assetsManager = assetsManager;
    }

    checkIfTowerDetectEnemy() {
        const weapons = this.playerState.Weapons;

        const botArray = this.botManager.botArray;

        const weaponLaunchPos = new THREE.Vector3(
            this.towerManager._towerMesh.position.x,
            TOWER_HEIGHT - 4,
            this.towerManager._towerMesh.position.z
        );

        for (let i = 0; i < weapons.length; i++) {
            const weapon = weapons[i];

            if (weapon.reloadTime === 0) {
                // Weapon can be fired
                const attackRange = weapon.attackRange / 30;

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

                const preferTargetArray = canShootBotArray.filter(
                    (item: any) =>
                        BOT_PROPS.armorTypes[item.bot.botType] ===
                        weapon.targetPreference
                );

                let targetBot = null;

                if (preferTargetArray.length > 0) {
                    preferTargetArray.sort((first: any, second: any) => {
                        return first.distance - second.distance;
                    });

                    targetBot = preferTargetArray[0];
                } else {
                    canShootBotArray.sort((a: any, b: any) => {
                        return a.distance - b.distance;
                    });

                    targetBot = canShootBotArray[0];
                }

                // Fire the weapon!
                let sprite = null;

                switch (weapon.name) {
                    case "Throwing Axes":
                        sprite = new ThrowingAxe({
                            sceneRenderer: this.sceneRenderer,
                            assetsManager: this.assetsManager,
                            launchPos: weaponLaunchPos,
                            targetBot: targetBot.bot,
                        });
                        break;

                    case "Bow":
                        sprite = new Bow({
                            sceneRenderer: this.sceneRenderer,
                            assetsManager: this.assetsManager,
                            launchPos: weaponLaunchPos,
                            targetBot: targetBot.bot,
                        });
                        break;

                    case "Magic Missiles":
                        sprite = new MagicMissiles({
                            sceneRenderer: this.sceneRenderer,
                            assetsManager: this.assetsManager,
                            launchPos: weaponLaunchPos,
                            targetBot: targetBot.bot,
                        });
                        break;

                    case "Boulder":
                        sprite = new Boulder({
                            sceneRenderer: this.sceneRenderer,
                            assetsManager: this.assetsManager,
                            launchPos: weaponLaunchPos,
                            targetBot: targetBot.bot,
                        });
                        break;

                    case "Chaos Orb":
                        sprite = new ChaosOrb({
                            sceneRenderer: this.sceneRenderer,
                            assetsManager: this.assetsManager,
                            launchPos: weaponLaunchPos,
                            targetBot: targetBot.bot,
                        });
                        break;
                }

                this.spriteManager.addSprite(sprite);

                weapon.reloadTime = weapon.cooldown;
            }
        }
    }

    checkSpriteCollision() {
        const spriteArray = this.spriteManager.spriteArray;
        const newSpriteArray = [];

        for (let i = 0; i < spriteArray.length; i++) {
            const sprite = spriteArray[i];

            if (spriteArray[i].checkIfHit()) {
                const damageType = sprite.damageType;
                const armorType =
                    BOT_PROPS.armorTypes[sprite.targetBot.botType];

                const multiplier = getDamageMultiplier(damageType, armorType);

                const trueDamage = sprite.attackDamage * multiplier;

                sprite.targetBot.hp -= trueDamage;

                this.spriteManager.addTextSprite(
                    new TextSprite({
                        text: `${Math.ceil(trueDamage)}`,
                        color: DAMAGE_TEXT_COLORS[damageType],
                        position: new THREE.Vector3(
                            sprite.mesh.position.x,
                            sprite.mesh.position.y,
                            sprite.mesh.position.z
                        ),
                        sceneRenderer: this.sceneRenderer,
                        fastMode: true,
                    })
                );

                sprite.addCollisionEffect();

                sprite.dispose();
            } else if (spriteArray[i].targetBot.status === BOT_STATUS["dead"]) {
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
                    fastMode: false,
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
                this.towerManager.hp -= bot.attackDamage;
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
