import {
    DoubleSide,
    Group,
    MeshBasicMaterial,
    NormalBlending,
    Vector4,
} from "three";
import {
    BatchedRenderer,
    Bezier,
    ColorOverLife,
    ColorRange,
    ConeEmitter,
    ConstantColor,
    ConstantValue,
    IntervalValue,
    ParticleSystem,
    PiecewiseBezier,
    RenderMode,
    SizeOverLife,
} from "three.quarks";
import { TextureImage } from "../AssetsManager";

export function createShipSmoke(
    renderer: BatchedRenderer,
    textures: TextureImage[]
) {
    const group = new Group();
    group.name = "ShipSmoke";

    const texture = textures[0].texture;

    const grey = new Vector4(0.5, 0.5, 0.5, 1);

    const smoke = new ParticleSystem({
        duration: 5,
        looping: true,
        startLife: new IntervalValue(1.5, 3),
        startSpeed: new IntervalValue(20, 30),
        startSize: new IntervalValue(10, 15),
        startColor: new ConstantColor(grey),
        worldSpace: true,

        emissionOverTime: new ConstantValue(20),
        shape: new ConeEmitter({
            radius: 10,
            thickness: 1,
            angle: 0.2,
        }),
        material: new MeshBasicMaterial({
            map: texture,
            blending: NormalBlending,
            transparent: true,
            side: DoubleSide,
        }),
        startTileIndex: new ConstantValue(2),
        uTileCount: 10,
        vTileCount: 10,
        renderMode: RenderMode.BillBoard,
        renderOrder: 2,
    });

    smoke.addBehavior(
        new ColorOverLife(
            new ColorRange(
                new Vector4(1, 1, 1, 1),
                new Vector4(0.8, 0.8, 0.8, 0)
            )
        )
    );
    smoke.addBehavior(
        new SizeOverLife(new PiecewiseBezier([[new Bezier(0.2, 1, 1, 1), 0]]))
    );
    smoke.emitter.name = "smoke";
    smoke.emitter.rotation.x = -Math.PI / 2;
    group.add(smoke.emitter);
    renderer.addSystem(smoke);
    return group;
}
