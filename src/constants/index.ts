import * as THREE from "three";
import { Config } from "../utils/config";

export const S3_BUCKET_URL = Config.s3BucketUrl;

export const MODEL_URLS = {
    environment:
        S3_BUCKET_URL + "/assets/models/environment/foliage_pack_final.gltf",
    buildings: S3_BUCKET_URL + "/assets/models/building/scene.gltf",
    bot_grunt: S3_BUCKET_URL + "/assets/models/skeleton_grunt/scene.gltf",
    bot_swordsman:
        S3_BUCKET_URL + "/assets/models/skeleton_swordsman/scene.gltf",
    bot_archer: S3_BUCKET_URL + "/assets/models/skeleton_archer/scene.gltf",
    bot_king: S3_BUCKET_URL + "/assets/models/skeleton_king/scene.gltf",
    bot_mage: S3_BUCKET_URL + "/assets/models/skeleton_mage/scene.gltf",

    throwingAxe:
        S3_BUCKET_URL + "/assets/models/weapons/throwingAxe/scene.gltf",
    arrow:
        S3_BUCKET_URL +
        "/assets/models/weapons/arrow/overwatch_-_hanzos_arrow.glb",
    missile:
        S3_BUCKET_URL + "/assets/models/weapons/missile/hi-tech_missile.glb",
    stone:
        S3_BUCKET_URL + "/assets/models/weapons/stone/groundstone_sphere.glb",
};

export const FOREST_RADIUS = 35;

export const GAME_MODES = {
    Single: 0x01,
    Lobby: 0x02,
};

export const GAME_STATES = {
    NONE: 0x00,
    GAME_MENU: 0x01,
    PLAYING: 0x02,
    PAUSE: 0x03,
    WON: 0x04,
    LOST: 0x05,
    SETTING: 0x06,
    GAME_LOBBY: 0x07,
    TUTORIAL: 0x08,
};

export const CAMERA_POS = {
    sideView: new THREE.Vector3(40, 30, 0),
};

export const ROUND_TIME = 30;

export const START_GOLD_GEN = 50;

export const DAMAGE_TYPES = {
    Normal: 0x01,
    Piercing: 0x02,
    Magic: 0x03,
    Siege: 0x04,
    Chaos: 0x05,
};

export const DAMAGE_TYPES_TEXT = {
    0x01: "Normal",
    0x02: "Piercing",
    0x03: "Magic",
    0x04: "Siege",
    0x05: "Chaos",
};

export const ARMOR_TYPES = {
    Unarmored: 0x01,
    Light: 0x02,
    Medium: 0x03,
    Heavy: 0x04,
    Fortified: 0x05,
    Divine: 0x06,
};

export const ARMOR_TYPES_TEXT = {
    0x01: "Unarmored",
    0x02: "Light",
    0x03: "Medium",
    0x04: "Heavy",
    0x05: "Fortified",
    0x06: "Divine",
};

export const DAMAGE_TEXT_COLORS = {
    [DAMAGE_TYPES.Normal]: "#848C92",
    [DAMAGE_TYPES.Piercing]: "#cfbf46",
    [DAMAGE_TYPES.Magic]: "#66acc7",
    [DAMAGE_TYPES.Siege]: "#c7a166",
    [DAMAGE_TYPES.Chaos]: "#66c76a",
};

export const PLAYER_COLOR = [
    "#ee2d2d",
    "#2d63ee",
    "#2deecc",
    "#eed52d",
    "#ea7711",
    "#68ee2d",
    "#ac2dee",
    "#ee632d",
];
