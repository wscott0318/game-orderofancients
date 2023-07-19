import { ARMOR_TYPES } from ".";

export const BOT_TYPE = {
    grunt: 0x01,
    swordsman: 0x02,
    archer: 0x03,
    king: 0x04,
    mage: 0x05,
} as any;

export const ANIMATION_TYPE = {
    walk: 0x01,
    attack: 0x02,
    dead: 0x03,
} as any;

export const BOT_STATUS = {
    walk: 0x01,
    attack: 0x02,
    dead: 0x03,
    stun: 0x04,
} as any;

export const BOT_ANIMATION_CLIPS = {
    [BOT_TYPE["grunt"]]: {
        walk: {
            startFrame: 1280,
            endFrame: 1350,
        },
        attack: {
            startFrame: 684,
            endFrame: 763,
        },
        dead: {
            startFrame: 72,
            endFrame: 99,
        },
    },
    [BOT_TYPE["swordsman"]]: {
        walk: {
            startFrame: 1048,
            endFrame: 1104,
        },
        attack: {
            startFrame: 122,
            endFrame: 200,
        },
        dead: {
            startFrame: 201,
            endFrame: 231,
        },
    },
    [BOT_TYPE["archer"]]: {
        walk: {
            startFrame: 940,
            endFrame: 1011,
        },
        attack: {
            startFrame: 72,
            endFrame: 108,
        },
        dead: {
            startFrame: 172,
            endFrame: 199,
        },
    },
    [BOT_TYPE["king"]]: {
        walk: {
            startFrame: 748,
            endFrame: 864,
        },
        attack: {
            startFrame: 517,
            endFrame: 560,
        },
        dead: {
            startFrame: 1042,
            endFrame: 1112,
        },
    },
    [BOT_TYPE["mage"]]: {
        walk: {
            startFrame: 1136,
            endFrame: 1206,
        },
        attack: {
            startFrame: 0,
            endFrame: 108,
        },
        dead: {
            startFrame: 108,
            endFrame: 135,
        },
    },
};

export const BOT_PROPS = {
    attackRange: {
        [BOT_TYPE["grunt"]]: 1.5,
        [BOT_TYPE["swordsman"]]: 0.2,
        [BOT_TYPE["archer"]]: 5,
        [BOT_TYPE["king"]]: 0.9,
        [BOT_TYPE["mage"]]: 4,
    },
    healthPoint: {
        [BOT_TYPE["grunt"]]: 550,
        [BOT_TYPE["swordsman"]]: 450,
        [BOT_TYPE["archer"]]: 300,
        [BOT_TYPE["king"]]: 750,
        [BOT_TYPE["mage"]]: 280,
    },
    modelHeight: {
        [BOT_TYPE["grunt"]]: 3,
        [BOT_TYPE["swordsman"]]: 2.8,
        [BOT_TYPE["archer"]]: 2,
        [BOT_TYPE["king"]]: 3,
        [BOT_TYPE["mage"]]: 2,
    },
    attackSpeed: {
        [BOT_TYPE["grunt"]]: 60,
        [BOT_TYPE["swordsman"]]: 45,
        [BOT_TYPE["archer"]]: 54,
        [BOT_TYPE["king"]]: 90,
        [BOT_TYPE["mage"]]: 60,
    },
    attackDamage: {
        [BOT_TYPE["grunt"]]: 25,
        [BOT_TYPE["swordsman"]]: 10,
        [BOT_TYPE["archer"]]: 17,
        [BOT_TYPE["king"]]: 35,
        [BOT_TYPE["mage"]]: 15,
    },
    gold: {
        [BOT_TYPE["grunt"]]: 20,
        [BOT_TYPE["swordsman"]]: 10,
        [BOT_TYPE["archer"]]: 5,
        [BOT_TYPE["king"]]: 30,
        [BOT_TYPE["mage"]]: 8,
    },
    armorTypes: {
        [BOT_TYPE["grunt"]]: ARMOR_TYPES.Divine,
        [BOT_TYPE["swordsman"]]: ARMOR_TYPES.Medium,
        [BOT_TYPE["archer"]]: ARMOR_TYPES.Light,
        [BOT_TYPE["king"]]: ARMOR_TYPES.Heavy,
        [BOT_TYPE["mage"]]: ARMOR_TYPES.Unarmored,
    },
};
