export const Config = {
    demo: process.env.REACT_APP_ENVIRONMENT === "demo",
    apiUrl: process.env.REACT_APP_API_URL ?? "http://localhost:3001/graphql",
    app: {
        name: process.env.REACT_APP_NAME ?? "Order Of Ancients",
        shortName: process.env.REACT_APP_SHORT_NAME ?? "OrderOfAncients",
    },
};
