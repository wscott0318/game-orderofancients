
import { MODEL_URLS, S3_BUCKET_URL } from "../../../constants";

//

export const AssetsList = {

    textures: [
        { name: 'Particles1', path: "/assets/new/textures/texture1.ktx2" },
        { name: 'Particles2', path: "/assets/new/textures/texture2.ktx2" }
    ],

    models: [
        { name: 'Environment', path: MODEL_URLS["environment"] },
        { name: 'Buildings', path: MODEL_URLS["buildings"] },
        { name: 'BotGrunt', path: MODEL_URLS["bot_grunt"] },
        { name: 'BotSwordsman', path: MODEL_URLS["bot_swordsman"] },
        { name: 'BotArcher', path: MODEL_URLS["bot_archer"] },
        { name: 'BotKing', path: MODEL_URLS["bot_king"] },
        { name: 'BotMage', path: MODEL_URLS["bot_mage"] },
        { name: 'ThrowingAxe', path: MODEL_URLS["throwingAxe"] },
        { name: 'Arrow', path: MODEL_URLS["arrow"] },
        { name: 'Missile', path: MODEL_URLS["missile"] },
        { name: 'Stone', path: MODEL_URLS["stone"] }
    ]

};
