import React from "react";
import App from "./app/App";
import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    ApolloProvider,
    ApolloLink,
    split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = createHttpLink({
    uri: "http://localhost:5000",
});

const authLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem("token");
    operation.setContext({
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
    });
    return forward(operation)
});

const wsLink = new WebSocketLink({
    uri: `ws://localhost:5000`,
    options: {
        reconnect: true,
        connectionParams: {
            authToken: localStorage.getItem("token"),
        },
    },
});

const link = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === "OperationDefinition" && definition.operation === "subscription";
    },
    wsLink,
    authLink.concat(httpLink),
);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});

export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);
