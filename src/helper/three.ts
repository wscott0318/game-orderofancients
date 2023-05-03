export const cleanMaterial = (material: any) => {
    material.dispose();

    // dispose textures
    for (const key of Object.keys(material)) {
        const value = material[key];
        if (value && typeof value === "object" && "minFilter" in value) {
            value.dispose();
        }
    }
};
