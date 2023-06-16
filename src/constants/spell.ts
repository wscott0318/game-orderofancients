import { ARMOR_TYPES, DAMAGE_TYPES } from ".";

export const SPELLS_INFO = {
    "Throwing Axes": {
        name: "Throwing Axes",
        propertyName: "Throwing_Axes",
        spellType: "Weapon",
        thumbnail: "/assets/images/spells/normal/throwingAxes.png",
        cost: 500,
        damageType: DAMAGE_TYPES.Normal,
        attackRange: 900,
        targetType: "single",
        targetPreference: ARMOR_TYPES.Medium,
        attackDamage: 75,
        dps: 75,
        cooldown: 1.0,
    },
};
