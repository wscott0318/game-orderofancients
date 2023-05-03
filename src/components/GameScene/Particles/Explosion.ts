import {
    AdditiveBlending,
    Group,
    NormalBlending,
    MeshBasicMaterial,
    Texture,
    Vector4,
    DoubleSide,
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
    SphereEmitter,
} from "three.quarks";

export interface TextureImage {
    img: string;
    texture: Texture;
}

export function createBigExplosion(
    renderer: BatchedRenderer,
    textures: TextureImage[]
) {
    const group = new Group();
    group.name = "BigExplosion";
    const yellowColor = new Vector4(0.9, 0.6, 0.25, 1);
    const yellowColor2 = new Vector4(1, 0.95, 0.4, 1);

    const texture = textures[0].texture;
    const mainColor = yellowColor;
    const secColor = yellowColor2;

    const gatherParticles = new ParticleSystem({
        duration: 1,
        looping: false,
        startLife: new IntervalValue(0.3, 0.4),
        startSpeed: new IntervalValue(-100, -150),
        startSize: new IntervalValue(1, 3),
        startColor: new ConstantColor(new Vector4(1, 1, 1, 1)),
        worldSpace: false,

        emissionOverTime: new ConstantValue(0),
        emissionBursts: [
            {
                time: 0,
                count: 30,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            },
        ],
        shape: new SphereEmitter({
            radius: 40,
            thickness: 1,
            arc: Math.PI * 2,
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
    });
    gatherParticles.addBehavior(
        new ColorOverLife(
            new ColorRange(
                new Vector4(mainColor.x, mainColor.y, mainColor.z, 0.2),
                new Vector4(mainColor.x, mainColor.y, mainColor.z, 1)
            )
        )
    );
    gatherParticles.emitter.name = "gatherParticles";
    group.add(gatherParticles.emitter);
    renderer.addSystem(gatherParticles);

    const mainBeam = new ParticleSystem({
        duration: 2,
        looping: false,
        startLife: new IntervalValue(0.1, 0.3),
        startSpeed: new IntervalValue(100, 300),
        startSize: new IntervalValue(1.5, 12.5),
        startColor: new ConstantColor(new Vector4(1, 1, 1, 1)),
        worldSpace: false,

        emissionOverTime: new ConstantValue(0),
        emissionBursts: [
            {
                time: 0.4,
                count: 8,
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
            blending: AdditiveBlending,
            transparent: true,
            side: DoubleSide,
        }),
        startTileIndex: new ConstantValue(0),
        uTileCount: 10,
        vTileCount: 10,
        renderMode: RenderMode.BillBoard,
        renderOrder: 2,
    });
    mainBeam.addBehavior(
        new SizeOverLife(
            new PiecewiseBezier([[new Bezier(1, 0.25, 0.05, 0), 0]])
        )
    );
    mainBeam.emitter.name = "mainBeam";
    group.add(mainBeam.emitter);
    renderer.addSystem(mainBeam);

    const glowBeam = new ParticleSystem({
        duration: 1,
        looping: false,

        startLife: new IntervalValue(1, 1.6),
        startSpeed: new IntervalValue(20, 45),
        startSize: new IntervalValue(4, 8),
        startColor: new ConstantColor(mainColor),
        worldSpace: false,

        emissionOverTime: new ConstantValue(0),
        emissionBursts: [
            {
                time: 0.4,
                count: 8,
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
            blending: AdditiveBlending,
            transparent: true,
            side: DoubleSide,
        }),
        startTileIndex: new ConstantValue(0),
        uTileCount: 10,
        vTileCount: 10,
        renderMode: RenderMode.BillBoard,
        renderOrder: 2,
    });
    glowBeam.addBehavior(
        new SizeOverLife(
            new PiecewiseBezier([[new Bezier(1, 0.25, 0.05, 0), 0]])
        )
    );
    glowBeam.emitter.name = "glowBeam";
    group.add(glowBeam.emitter);
    renderer.addSystem(glowBeam);

    const smoke = new ParticleSystem({
        duration: 1,
        looping: false,
        startLife: new IntervalValue(0.5, 0.8),
        startSpeed: new IntervalValue(20, 50),
        startSize: new IntervalValue(10, 15),
        startRotation: new IntervalValue(0, Math.PI * 2),
        startColor: new ConstantColor(new Vector4(1, 1, 1, 0.5)),
        worldSpace: false,

        emissionOverTime: new ConstantValue(0),
        emissionBursts: [
            {
                time: 0.4,
                count: 12,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            },
        ],

        shape: new SphereEmitter({
            radius: 7.5,
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
                time: 0.4,
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

    const beam = new ParticleSystem({
        duration: 1,
        looping: false,

        startLife: new ConstantValue(0.2),
        startSpeed: new ConstantValue(0),
        startSize: new ConstantValue(100),
        startColor: new ConstantColor(secColor),
        worldSpace: false,

        emissionOverTime: new ConstantValue(0),
        emissionBursts: [
            {
                time: 0.35,
                count: 2,
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
        renderOrder: -2,
    });
    beam.emitter.name = "beam";
    beam.addBehavior(
        new SizeOverLife(
            new PiecewiseBezier([[new Bezier(1, 0.66666, 0.33333, 0), 0]])
        )
    );
    group.add(beam.emitter);
    renderer.addSystem(beam);

    const circle = new ParticleSystem({
        duration: 1,
        looping: false,
        startLife: new ConstantValue(0.4),
        startSpeed: new ConstantValue(0),
        startSize: new ConstantValue(40),
        startColor: new ConstantColor(secColor),
        worldSpace: false,

        emissionOverTime: new ConstantValue(0),
        emissionBursts: [
            {
                time: 0.4,
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
        startTileIndex: new ConstantValue(10),
        uTileCount: 10,
        vTileCount: 10,
        renderMode: RenderMode.BillBoard,
        renderOrder: 2,
    });
    circle.addBehavior(
        new SizeOverLife(
            new PiecewiseBezier([[new Bezier(0.3, 0.6, 0.9, 1), 0]])
        )
    );
    circle.addBehavior(
        new FrameOverLife(
            new PiecewiseBezier([[new Bezier(10, 13, 16, 19), 0]])
        )
    );
    circle.emitter.name = "circle";
    group.add(circle.emitter);
    renderer.addSystem(circle);
    return group;
}
