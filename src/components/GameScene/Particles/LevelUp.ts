import {
    AdditiveBlending,
    DoubleSide,
    Group,
    MeshBasicMaterial,
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
    OrbitOverLife,
    ParticleSystem,
    PiecewiseBezier,
    PointEmitter,
    RenderMode,
    SizeOverLife,
    SphereEmitter,
} from "three.quarks";
import { TextureImage } from "../AssetsManager";

export function createLevelUp(
    renderer: BatchedRenderer,
    textures: TextureImage[]
) {
    const group = new Group();
    group.name = "LevelUp";

    const texture = textures[0].texture;

    const yellow = new Vector4(0.8, 0.8, 0.2, 1);

    const gatherParticles = new ParticleSystem({
        duration: 0.5,
        looping: false,
        startLife: new IntervalValue(0.3, 0.4),
        startSpeed: new IntervalValue(-100, -150),
        startSize: new IntervalValue(1, 2),
        startColor: new ConstantColor(yellow),
        worldSpace: false,

        emissionOverTime: new ConstantValue(100),
        shape: new SphereEmitter({
            radius: 60,
            thickness: 0.8,
            arc: Math.PI,
        }),
        material: new MeshBasicMaterial({
            map: texture,
            blending: AdditiveBlending,
            transparent: true,
            side: DoubleSide,
        }),
        startTileIndex: new ConstantValue(0),
        uTileCount: 10,
        vTileCount: 10,
        renderMode: RenderMode.StretchedBillBoard,
        speedFactor: 0.05,
        renderOrder: 2,
    });
    gatherParticles.addBehavior(
        new ColorOverLife(
            new ColorRange(
                new Vector4(0.2, 0.2, 0.2, 1),
                new Vector4(1, 1, 1, 1)
            )
        )
    );
    gatherParticles.emitter.name = "gatherParticles";
    group.add(gatherParticles.emitter);
    renderer.addSystem(gatherParticles);

    const glowParam = {
        duration: 2,
        looping: false,
        startLife: new ConstantValue(2.0),
        startSpeed: new ConstantValue(0),
        startSize: new IntervalValue(120, 160),
        startColor: new ConstantColor(yellow),
        worldSpace: false,

        emissionOverTime: new ConstantValue(0),
        emissionBursts: [
            {
                time: 0,
                count: 1,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            },
        ],

        shape: new PointEmitter(),
        material: new MeshBasicMaterial({
            map: texture,
            blending: AdditiveBlending,
            transparent: true,
            side: DoubleSide,
        }),
        startTileIndex: new ConstantValue(1),
        uTileCount: 10,
        vTileCount: 10,
        renderMode: RenderMode.Mesh,
        renderOrder: 0,
    };

    const glow = new ParticleSystem(glowParam);
    glow.addBehavior(
        new SizeOverLife(
            new PiecewiseBezier([
                [new Bezier(0, 0.75, 0.9, 1), 0],
                [new Bezier(1, 0.9, 0.75, 0), 0.5],
            ])
        )
    );
    glow.emitter.name = "glow";
    glow.emitter.rotation.x = -Math.PI / 2;
    group.add(glow.emitter);
    renderer.addSystem(glow);

    const glow2Param = {
        duration: 2,
        looping: false,
        startLife: new ConstantValue(2.0),
        startSpeed: new ConstantValue(0),
        startSize: new IntervalValue(60, 80),
        startColor: new ConstantColor(yellow),
        worldSpace: false,

        emissionOverTime: new ConstantValue(0),
        emissionBursts: [
            {
                time: 0,
                count: 1,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            },
        ],

        shape: new PointEmitter(),
        material: new MeshBasicMaterial({
            map: texture,
            blending: AdditiveBlending,
            transparent: true,
            side: DoubleSide,
        }),
        startTileIndex: new ConstantValue(1),
        uTileCount: 10,
        vTileCount: 10,
        renderMode: RenderMode.BillBoard,
        renderOrder: 0,
    };

    const glow2 = new ParticleSystem(glow2Param);
    glow2.addBehavior(
        new SizeOverLife(
            new PiecewiseBezier([
                [new Bezier(0, 0.75, 0.9, 1), 0],
                [new Bezier(1, 0.9, 0.75, 0), 0.2],
            ])
        )
    );
    glow2.emitter.name = "glow2";
    group.add(glow2.emitter);
    renderer.addSystem(glow2);

    const particleParam = {
        duration: 1.0,
        looping: false,
        startLife: new IntervalValue(0.6, 0.8),
        startSpeed: new IntervalValue(120, 180),
        startSize: new IntervalValue(2, 4),
        startColor: new ConstantColor(yellow),
        worldSpace: false,

        emissionOverTime: new PiecewiseBezier([
            [new Bezier(0, 0, 0, 0), 0],
            [new Bezier(50, 80, 80, 50), 0.4],
        ]),
        shape: new ConeEmitter({
            radius: 25,
            thickness: 0.2,
            angle: Math.PI / 100,
        }),
        material: new MeshBasicMaterial({
            map: texture,
            blending: AdditiveBlending,
            transparent: true,
            side: DoubleSide,
        }),
        startTileIndex: new ConstantValue(0),
        uTileCount: 10,
        vTileCount: 10,
        renderMode: RenderMode.BillBoard,
        renderOrder: 2,
    };

    const particle = new ParticleSystem(particleParam);
    particle.addBehavior(
        new SizeOverLife(
            new PiecewiseBezier([
                [new Bezier(0, 0.75, 0.9, 1), 0],
                [new Bezier(1, 0.9, 0.75, 0), 0.5],
            ])
        )
    );
    particle.addBehavior(
        new OrbitOverLife(
            new PiecewiseBezier([
                [
                    new Bezier(
                        0,
                        Math.PI * 4 * 0.75,
                        Math.PI * 4 * 0.9,
                        Math.PI * 4
                    ),
                    0,
                ],
            ])
        )
    );
    particle.emitter.name = "particle";
    particle.emitter.rotation.x = -Math.PI / 2;
    group.add(particle.emitter);
    renderer.addSystem(particle);
    return group;
}
