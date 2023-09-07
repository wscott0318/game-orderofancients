import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { GAME_STATES } from "../../constants";
import AssetsManager from "./AssetsManager";
import { SceneRenderer } from "./rendering/SceneRenderer";
import * as THREE from "three";
import {
    TOWER_HEALTH_HEIGHT,
    TOWER_HEALTH_WIDTH,
} from "../../constants/gameUI";
import { getColorForPercentage } from "../../helper/color";
import { StateManager } from "./States/StateManager";
import { ParticleEffect } from "./ParticleEffect";
import { TOWER_HEIGHT, TOWER_POSITION } from "../../constants/tower";

export class TowerManager {
    level: number;
    maxHp: number;
    hp: number;
    _towerMesh: any;
    _sceneRenderer: SceneRenderer;
    _assetsManager: AssetsManager;
    _healthBarUI: CSS2DObject;
    _stateManager: StateManager;
    _particleEffect: ParticleEffect;

    sacrificeHP: number;

    constructor({
        sceneRenderer,
        assetsManager,
        stateManager,
        particleEffect,
    }: any) {
        this._sceneRenderer = sceneRenderer;
        this._assetsManager = assetsManager;
        this._stateManager = stateManager;
        this._particleEffect = particleEffect;

        this.level = 1;
        this.hp = 1700;
        this.maxHp = 1700;

        this.sacrificeHP = 0;

        this._towerMesh = this._assetsManager.getTowerModel();

        const wrapper = document.createElement("div");
        wrapper.className = "towerStatusBar";

        const levelDiv = document.createElement("div");
        levelDiv.className = "level";

        const healthBarDiv = document.createElement("div");
        healthBarDiv.className = "healthBar";

        const healthProgressDiv = document.createElement("div");
        healthProgressDiv.className = "healthBar__progress";

        healthBarDiv.appendChild(healthProgressDiv);

        wrapper.appendChild(levelDiv);
        wrapper.appendChild(healthBarDiv);

        this._healthBarUI = new CSS2DObject(wrapper);
        this._sceneRenderer.getScene().add(this._healthBarUI);

        this.initialize();
    }

    initialize() {
        this._towerMesh.position.x = TOWER_POSITION.x;
        this._towerMesh.position.y = TOWER_POSITION.y;
        this._towerMesh.position.z = TOWER_POSITION.z;
        this._sceneRenderer.getScene().add(this._towerMesh);
    }

    levelUp() {
        this.level++;

        const element = document.getElementById("gameLevel");
        if (element) {
            element.textContent = `Level ${this.level}`;
        }

        // visual effect
        const newVector = new THREE.Vector3(
            this._towerMesh.position.x,
            this._towerMesh.position.y + 5,
            this._towerMesh.position.z
        );

        this._particleEffect.addLevelUp(newVector);
    }

    renderHealthBar() {
        this._healthBarUI.position.set(
            this._towerMesh.position.x,
            this._towerMesh.position.y + TOWER_HEIGHT,
            this._towerMesh.position.z
        );

        const scaleFactor = 85;
        const scaleVector = new THREE.Vector3();
        const scale = Math.sqrt(
            scaleVector
                .subVectors(
                    this._healthBarUI.position,
                    this._sceneRenderer.getCamera().position
                )
                .length() / scaleFactor
        );

        this._healthBarUI.element.classList.add("flex");
        this._healthBarUI.element.style.gap = `${2 / scale}px`;
        this._healthBarUI.element.style.padding = `${2 / scale}px`;

        const levelDiv = this._healthBarUI.element.getElementsByClassName(
            "level"
        )[0] as HTMLDivElement;
        levelDiv.textContent = String(this.level);
        levelDiv.style.fontSize = `${13 / scale}px`;
        levelDiv.style.borderWidth = `${1 / scale}px`;
        levelDiv.style.padding = `0 ${5 / scale}px`;
        levelDiv.style.height = `${13 / scale}px`;

        const healthBar = this._healthBarUI.element.getElementsByClassName(
            "healthBar"
        )[0] as HTMLDivElement;

        healthBar.style.width = `${(TOWER_HEALTH_WIDTH + 2) / scale}px`;
        healthBar.style.height = `${(TOWER_HEALTH_HEIGHT + 2) / scale}px`;

        const progressBar = healthBar.children[0] as HTMLDivElement;
        progressBar.style.width = `${
            (TOWER_HEALTH_WIDTH * this.hp) / this.maxHp / scale
        }px`;
        progressBar.style.height = `${TOWER_HEALTH_HEIGHT / scale}px`;
        progressBar.style.left = `${1 / scale}px`;
        progressBar.style.top = `${1 / scale}px`;

        progressBar.style.background = `${getColorForPercentage(
            this.hp / this.maxHp
        )}`;

        const currentHealthDiv = document.getElementById("currentHP");
        if (currentHealthDiv) {
            currentHealthDiv.textContent = `${this.hp}`;
        }

        const maxHealthDiv = document.getElementById("maxHP");
        if (maxHealthDiv) {
            maxHealthDiv.textContent = ` / ${this.maxHp}`;
        }

        const healthBarDiv = document.getElementById("towerHealthBar");
        if (healthBarDiv) {
            healthBarDiv.style.width = `${(this.hp / this.maxHp) * 100}%`;
        }
    }

    sacrificeHealth(value: number) {
        this.sacrificeHP += value;
    }

    tick() {
        const sacrificeAmount = 15;

        if (this.sacrificeHP > 0) {
            if (this.sacrificeHP < sacrificeAmount) {
                this.hp -= this.sacrificeHP;
                this.sacrificeHP = 0;
            } else {
                this.hp -= sacrificeAmount;
                this.sacrificeHP -= sacrificeAmount;
            }
        }

        if (this.hp <= 0) {
            this._stateManager.setState(GAME_STATES.END);
        }

        this.renderHealthBar();
    }
}
