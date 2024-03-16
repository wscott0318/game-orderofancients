
// @ts-ignore
global.process = global.process || { env: {} };

export const Config = {
    demo: true,
    apiUrl: process.env.REACT_APP_API_URL ?? "http://localhost:3001/graphql",
    app: {
        name: process.env.REACT_APP_NAME ?? "Order Of Ancients",
        shortName: process.env.REACT_APP_SHORT_NAME ?? "OrderOfAncients",
    },
    socketServerUrl:
        process.env.REACT_APP_SOCKET_SERVER_URL ?? "ws://localhost:3001/",
    s3BucketUrl:
        process.env.REACT_APP_ENVIRONMENT === "development"
            ? ""
            : "https://pub-1ba5d42028314e148e3c88dc068c7618.r2.dev",
    showSinglePlay:
        Boolean(process.env.REACT_APP_SHOW_SINGLE_PLAY_OPTION) ?? false,
};
