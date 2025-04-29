"use client"

import { type ReactNode, useMemo } from "react"
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, from } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { onError } from "@apollo/client/link/error"
import { useAuth } from "./auth-provider"

export function ApolloWrapper({ children }: { children: ReactNode }) {
  const { token, logout } = useAuth()

  const client = useMemo(() => {
    const httpLink = createHttpLink({
      uri: "https://tactology-department-api.onrender.com/graphql",
    })

    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      }
    })

    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, extensions }) => {
          console.error(`[GraphQL error]: ${message}`)

          // Handle authentication errors
          if (
            extensions?.code === "UNAUTHENTICATED" ||
            extensions?.code === "FORBIDDEN" ||
            message.includes("Unauthorized")
          ) {
            logout()
          }
        })
      }

      if (networkError) {
        console.error(`[Network error]: ${networkError}`)
      }
    })

    return new ApolloClient({
      link: from([errorLink, authLink, httpLink]),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "cache-and-network",
        },
      },
    })
  }, [token, logout])

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
