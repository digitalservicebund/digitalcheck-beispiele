const apolloServerPluginResponseCache =
    require("@apollo/server-plugin-response-cache").default;
const ApolloServerPluginCacheControl =
    require("apollo-server-core").ApolloServerPluginCacheControl;

module.exports = ({ env }) => {
    return {
        graphql: {
            enabled: true,
            config: {
                playgroundAlways: true,
                defaultLimit: 20,
                maxLimit: -1,
                apolloServer: {
                    tracing: true,
                    plugins: [
                        ApolloServerPluginCacheControl({
                            defaultMaxAge: 60,
                        }),
                        apolloServerPluginResponseCache({
                            shouldReadFromCache: async (requestContext) => {
                                return true;
                            },
                            shouldWriteToCache: async (requestContext) => {
                                return true;
                            },
                            extraCacheKeyData: async (requestContext) => {
                                return true;
                            },
                            sessionId: async (requestContext) => {
                                return null;
                            },
                        }),
                    ]
                }
            }
        }
    }
}