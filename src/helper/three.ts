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

export const disposeMesh = (mesh: any) => {
    mesh.traverse((object: any) => {
        if (!object.isMesh) return;

        object.geometry.dispose();

        if (object.material.isMaterial) {
            cleanMaterial(object.material);
        } else {
            for (const material of object.material) cleanMaterial(material);
        }
    });
};
