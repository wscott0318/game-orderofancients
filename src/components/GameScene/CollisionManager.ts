import { DAMAGE_TEXT_COLORS } from "../../constants";
import { BOT_PROPS, BOT_STATUS } from "../../constants/bot";
import { SPELLS_INFO } from "../../constants/spell";
import { TOWER_HEIGHT } from "../../constants/tower";
import { getDamageMultiplier } from "../../helper/game";
import AssetsManager from "./AssetsManager";
import { BotManager } from "./BotManager";
import { Bot } from "./Instances/Bot";
import { Sprite } from "./Instances/Sprite";
import { ParticleEffect } from "./ParticleEffect";
import SpriteManager from "./SpriteManager";
import { FiringStone } from "./Sprites/FiringStone";
import { TextSprite } from "./Sprites/Text";
import Boulder from "./Sprites/Weapons/Boulder";
import Bow from "./Sprites/Weapons/Bow";
import ChaosClaw from "./Sprites/Weapons/ChaosClaw";
import ChaosOrb from "./Sprites/Weapons/ChaosOrb";
import FireBow from "./Sprites/Weapons/FireBow";
import Flamecaster from "./Sprites/Weapons/FlameCaster";
import FrostBow from "./Sprites/Weapons/FrostBow";
import MagicMissiles from "./Sprites/Weapons/MagicMissiles";
import MissileBarrage from "./Sprites/Weapons/MissileBarrage";
import Rifle from "./Sprites/Weapons/Rifle";
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

    getTargetBot(weapon: any, launchPos: THREE.Vector3, botArray: Bot[]) {
        const attackRange = weapon.attackRange / 30 + 6;

        const canShootBotArray = [] as any;

        for (let i = 0; i < botArray.length; i++) {
            if (botArray[i].status === BOT_STATUS["dead"]) continue;

            const distance = botArray[i].mesh.position.distanceTo(launchPos);

            if (distance < attackRange)
                canShootBotArray.push({
                    distance: distance,
                    bot: botArray[i],
                });
        }

        if (!canShootBotArray.length)
            return {
                targetBot: null,
                preferTargetArray: [],
                normalTargetArray: [],
            };

        const preferTargetArray = canShootBotArray.filter(
            (item: any) =>
                BOT_PROPS.armorTypes[item.bot.botType] ===
                weapon.targetPreference
        );
        preferTargetArray.sort((first: any, second: any) => {
            return first.distance - second.distance;
        });

        const normalTargetArray = canShootBotArray.filter(
            (item: any) =>
                BOT_PROPS.armorTypes[item.bot.botType] !==
                weapon.targetPreference
        );
        normalTargetArray.sort((a: any, b: any) => {
            return a.distance - b.distance;
        });

        let targetBot = null;

        if (preferTargetArray.length > 0) {
            targetBot = preferTargetArray[0];
        } else {
            targetBot = normalTargetArray[0];
        }

        return {
            targetBot: targetBot,
            preferTargetArray: preferTargetArray,
            normalTargetArray: normalTargetArray,
        };
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

                if (
                    sprite.weaponType === "Chaos_Claw" ||
                    sprite.weaponType === "Throwing Axes"
                ) {
                    sprite.bounceCount--;

                    if (sprite.bounceCount < 0) {
                        sprite.dispose();
                    } else {
                        const botArray = this.botManager.botArray.filter(
                            (bot: Bot) => bot.uuid !== sprite.targetBot.uuid
                        );

                        const { targetBot } = this.getTargetBot(
                            SPELLS_INFO[
                                sprite.weaponType as keyof typeof SPELLS_INFO
                            ],
                            sprite.mesh.position,
                            botArray
                        );

                        if (targetBot) {
                            sprite.targetBot = targetBot.bot;
                            newSpriteArray.push(spriteArray[i]);
                        } else {
                            sprite.dispose();
                        }
                    }
                } else {
                    sprite.dispose();
                }
            } else if (spriteArray[i].targetBot.status === BOT_STATUS["dead"]) {
                sprite.dispose();
            } else {
                newSpriteArray.push(spriteArray[i]);
            }
        }

        this.spriteManager.spriteArray = newSpriteArray;
    }

    checkIfTowerDetectEnemy() {
        const weapons = this.playerState.Weapons;

        const weaponLaunchPos = new THREE.Vector3(
            this.towerManager._towerMesh.position.x,
            TOWER_HEIGHT - 4,
            this.towerManager._towerMesh.position.z
        );

        for (let i = 0; i < weapons.length; i++) {
            const weapon = weapons[i];

            if (weapon.reloadTime === 0) {
                let { targetBot, preferTargetArray, normalTargetArray } =
                    this.getTargetBot(
                        weapon,
                        this.towerManager._towerMesh.position,
                        this.botManager.botArray
                    );

                if (!targetBot) continue;

                // Fire the weapon!
                let sprite = null;

                switch (weapon.name) {
                    case "Throwing Axes":
                        sprite = new ThrowingAxe({
                            sceneRenderer: this.sceneRenderer,
                            assetsManager: this.assetsManager,
                            launchPos: weaponLaunchPos,
                            targetBot: targetBot.bot,
                            bounceCount: 0,
                        });
                        break;

                    case "Seeker Axe":
                        sprite = new ThrowingAxe({
                            sceneRenderer: this.sceneRenderer,
                            assetsManager: this.assetsManager,
                            launchPos: weaponLaunchPos,
                            targetBot: targetBot.bot,
                            bounceCount: 3,
                        });
                        break;
                    case "Rifle":
                        sprite = new Rifle({
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
                    case "Frost Bow":
                        sprite = new FrostBow({
                            sceneRenderer: this.sceneRenderer,
                            assetsManager: this.assetsManager,
                            launchPos: weaponLaunchPos,
                            targetBot: targetBot.bot,
                        });
                        break;
                    case "Fire Bow":
                        sprite = new FireBow({
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

                    case "Flamecaster":
                        sprite = new Flamecaster({
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

                    case "Missile Barrage":
                        const targetCount =
                            SPELLS_INFO.Missile_Barrage.targetCount;

                        for (let i = 0; i < targetCount; i++) {
                            if (
                                preferTargetArray.length +
                                    normalTargetArray.length >
                                0
                            ) {
                                if (preferTargetArray.length > 0) {
                                    targetBot = preferTargetArray[0];
                                    preferTargetArray.splice(0, 1);
                                } else {
                                    targetBot = normalTargetArray[0];
                                    normalTargetArray.splice(0, 1);
                                }

                                sprite = new MissileBarrage({
                                    sceneRenderer: this.sceneRenderer,
                                    assetsManager: this.assetsManager,
                                    launchPos: weaponLaunchPos,
                                    targetBot: targetBot.bot,
                                });

                                this.spriteManager.addSprite(sprite);

                                sprite = null;
                            }
                        }

                        break;

                    case "Chaos Orb":
                        sprite = new ChaosOrb({
                            sceneRenderer: this.sceneRenderer,
                            assetsManager: this.assetsManager,
                            launchPos: weaponLaunchPos,
                            targetBot: targetBot.bot,
                        });
                        break;

                    case "Chaos Claw":
                        sprite = new ChaosClaw({
                            sceneRenderer: this.sceneRenderer,
                            assetsManager: this.assetsManager,
                            launchPos: weaponLaunchPos,
                            targetBot: targetBot.bot,
                        });
                        break;
                }

                if (sprite) {
                    this.spriteManager.addSprite(sprite);
                }

                weapon.reloadTime = weapon.cooldown;
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

    checkBotHealth() {
        for (let i = 0; i < this.botManager.botArray.length; i++) {
            const bot = this.botManager.botArray[i];

            if (bot.hp <= 0 && bot.status !== BOT_STATUS["dead"]) {
                const gold = BOT_PROPS.gold[bot.botType];

                const finalGoldValue =
                    this.playerState.increaseBotKilledGold(gold);

                const sprite = new TextSprite({
                    text: `+${Math.ceil(finalGoldValue)}`,
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
