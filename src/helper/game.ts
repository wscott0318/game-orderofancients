import { ARMOR_TYPES, DAMAGE_TYPES } from "../constants";

const PERCENT2VALUE = (value: number) => value / 100;

export const getDamageMultiplier = (damageType: any, armorType: any) => {
    if (damageType === DAMAGE_TYPES.Normal) return PERCENT2VALUE(100);

    if (damageType === DAMAGE_TYPES.Piercing) {
        if (armorType === ARMOR_TYPES.Light) return PERCENT2VALUE(150);
        if (armorType === ARMOR_TYPES.Medium) return PERCENT2VALUE(200);
        if (armorType === ARMOR_TYPES.Fortified) return PERCENT2VALUE(50);
    }

    if (damageType === DAMAGE_TYPES.Magic) {
        if (armorType === ARMOR_TYPES.Heavy) return PERCENT2VALUE(200);
        if (armorType === ARMOR_TYPES.Fortified) return PERCENT2VALUE(50);
    }

    if (damageType === DAMAGE_TYPES.Siege) {
        if (armorType === ARMOR_TYPES.Fortified) return PERCENT2VALUE(50);
        else if (armorType === ARMOR_TYPES.Divine) return PERCENT2VALUE(100);
        else return PERCENT2VALUE(150);
    }

    if (damageType === DAMAGE_TYPES.Chaos) {
        if (armorType === ARMOR_TYPES.Divine) return PERCENT2VALUE(0);
    }

    return PERCENT2VALUE(100);
};
