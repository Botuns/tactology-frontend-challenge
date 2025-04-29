"use client";
import { type ReactNode, useMemo, useEffect } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { useAuth } from "./auth-provider";

export function ApolloWrapper({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  console.log("ApolloWrapper token:", token);

  // // Debug: Log the token when it changes
  // useEffect(() => {
  //   // console.log("Current auth token:", token);
  // }, [token]);

  const client = useMemo(() => {
    const httpLink = createHttpLink({
      uri: "https://tactology-department-api.onrender.com/graphql",
      // credentials: "include",
    });

    const authLink = setContext((_, { headers }) => {
      // Debug: Log the headers being set
      console.log(
        "Setting headers with token:",
        token ? "Bearer token exists" : "No token"
      );

      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    });

    const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
      // console.log("Operation headers:", operation.getContext().headers);

      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, extensions }) => {
          console.error(`[GraphQL error]: ${message}`);
          if (
            extensions?.code === "UNAUTHENTICATED" ||
            extensions?.code === "FORBIDDEN" ||
            message.includes("Unauthorized")
          ) {
            logout();
          }
        });
      }
      if (networkError) {
        console.error(`[Network error]:`, networkError);
      }
    });

    return new ApolloClient({
      link: from([errorLink, authLink, httpLink]),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "cache-and-network",
        },
      },
    });
  }, [token, logout]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
