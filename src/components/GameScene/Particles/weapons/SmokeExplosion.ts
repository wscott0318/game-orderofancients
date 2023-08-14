import {
    AdditiveBlending,
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
    FrameOverLife,
    IntervalValue,
    ParticleSystem,
    PiecewiseBezier,
    PointEmitter,
    RandomColor,
    RenderMode,
    RotationOverLife,
    SizeOverLife,
    SpeedOverLife,
    SphereEmitter,
} from "three.quarks";
import { TextureImage } from "../../AssetsManager";

export function createSmokeExplosion(
    renderer: BatchedRenderer,
    textures: TextureImage[]
) {
    const group = new Group();
    group.name = "SmokeExplosion";

    const yellowColor = new Vector4(0.9, 0.6, 0.25, 1);
    const yellowColor2 = new Vector4(1, 0.95, 0.4, 1);

    const texture = textures[0].texture;
    const mainColor = yellowColor;
    const secColor = yellowColor2;

    const smoke = new ParticleSystem({
        duration: 1,
        looping: false,
        startLife: new IntervalValue(0.8, 1.2),
        startSpeed: new IntervalValue(20, 50),
        startSize: new IntervalValue(10, 15),
        startRotation: new IntervalValue(0, Math.PI * 2),
        startColor: new ConstantColor(new Vector4(1, 1, 1, 0.5)),
        worldSpace: false,

        emissionOverTime: new ConstantValue(0),
        emissionBursts: [
            {
                time: 0,
                count: 12,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            },
        ],

        shape: new SphereEmitter({
            radius: 7.5,
            arc: Math.PI,
            thickness: 1,
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
        renderOrder: -2,
    });
    smoke.addBehavior(
        new SizeOverLife(
            new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])
        )
    );
    smoke.addBehavior(
        new ColorOverLife(new ColorRange(mainColor, new Vector4(0, 0, 0, 0)))
    );
    smoke.addBehavior(
        new RotationOverLife(
            new IntervalValue(-Math.PI * 2, Math.PI * 2),
            false
        )
    );
    smoke.addBehavior(
        new SpeedOverLife(
            new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])
        )
    );
    smoke.emitter.name = "smoke";
    group.add(smoke.emitter);
    renderer.addSystem(smoke);

    const particles = new ParticleSystem({
        duration: 1,
        looping: false,
        startLife: new IntervalValue(0.6, 1.2),
        startSpeed: new IntervalValue(40, 200),
        startSize: new IntervalValue(1, 4),
        startColor: new RandomColor(new Vector4(1, 1, 1, 1), mainColor),
        worldSpace: false,

        emissionOverTime: new ConstantValue(0),
        emissionBursts: [
            {
                time: 0,
                count: 12,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            },
        ],

        shape: new SphereEmitter({
            radius: 2,
            thickness: 1,
            arc: Math.PI * 2,
        }),
        material: new MeshBasicMaterial({
            map: texture,
            blending: NormalBlending,
            transparent: true,
            side: DoubleSide,
        }),
        startTileIndex: new ConstantValue(0),
        uTileCount: 10,
        vTileCount: 10,
        renderMode: RenderMode.StretchedBillBoard,
        speedFactor: 0.1,
        renderOrder: 0,
    });
    particles.addBehavior(
        new SizeOverLife(
            new PiecewiseBezier([[new Bezier(1, 0.25, 0.05, 0), 0]])
        )
    );
    particles.emitter.name = "particles";
    group.add(particles.emitter);
    renderer.addSystem(particles);

    return group;
}
