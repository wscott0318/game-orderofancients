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
    ConstantColor,
    ConstantValue,
    IntervalValue,
    ParticleSystem,
    PiecewiseBezier,
    PointEmitter,
    RenderMode,
    SizeOverLife,
} from "three.quarks";
import { TextureImage } from "../../AssetsManager";

export function createRocketSmoke(
    renderer: BatchedRenderer,
    textures: TextureImage[]
) {
    const group = new Group();
    group.name = "RocketSmoke";

    const texture = textures[0].texture;

    const grey = new Vector4(0.5, 0.5, 0.5, 1);

    const smoke = new ParticleSystem({
        duration: 5,
        looping: true,
        startLife: new IntervalValue(0.15, 0.3),
        startSpeed: new IntervalValue(3, 5),
        startSize: new IntervalValue(5, 5),
        startColor: new ConstantColor(grey),
        worldSpace: true,

        emissionOverTime: new ConstantValue(100),
        shape: new PointEmitter(),
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
