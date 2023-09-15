import {
    ApolloClient,
    ApolloLink,
    ApolloProvider,
    HttpLink,
    InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import React, { useMemo } from "react";
import { useAlert } from "../utils/context/alert";
import { StorageManager } from "../utils/storage";
import { Config } from "../utils/config";

type ApolloClientProviderProps = {
    children: React.ReactNode;
};

export function ApolloClientProvider(props: ApolloClientProviderProps) {
    const { pushAlert } = useAlert();

    const client = useMemo(() => {
        const httpLink = new HttpLink({
            uri: Config.apiUrl,
        });

        const authLink = new ApolloLink((operation, forward) => {
            const context = operation.getContext();

            const headers = {
                ...context.headers,
            };

            const token = StorageManager.get("token");

            if (!!token) {
                headers["x-token"] = token;
            }

            if (Config.demo) {
                const demoEmail = StorageManager.get("demoEmail");
                const demoPhone = StorageManager.get("demoPhone");

                if (!!demoEmail) headers["x-demo-email"] = demoEmail;
                if (!!demoPhone) headers["x-demo-phone"] = demoPhone;
            }

            operation.setContext({ ...context, headers });

            return forward(operation);
        });

        const errorLink = onError(({ graphQLErrors, networkError }) => {
            const error = graphQLErrors?.[0] ?? networkError;

            if (error) {
                pushAlert({
                    type: "alert",
                    title: "Server Error",
                    message: error.message,
                });
            }
        });

        const link = ApolloLink.from([errorLink, authLink, httpLink]);
        const cache = new InMemoryCache();

        return new ApolloClient({
            link,
            cache,
            defaultOptions: {
                watchQuery: {
                    fetchPolicy: "no-cache",
                    nextFetchPolicy: "no-cache",
                    initialFetchPolicy: "no-cache",
                    notifyOnNetworkStatusChange: true,
                },
                query: {
                    fetchPolicy: "no-cache",
                    notifyOnNetworkStatusChange: true,
                },
                mutate: {
                    fetchPolicy: "no-cache",
                },
            },
        });
    }, []);

    return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
}
