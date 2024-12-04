const ApolloServerPluginCacheControl = require('@apollo/server/plugin/cacheControl').ApolloServerPluginCacheControl;
const apolloServerPluginResponseCache =
  require("@apollo/server-plugin-response-cache").default;

module.exports = () => ({
    graphql: {
        enabled: true,
        config: {
            playgroundAlways: true,
            defaultLimit: 20,
            apolloServer: {
                tracing: true,
                plugins: [
                    ApolloServerPluginCacheControl({
                        defaultMaxAge: 3333,
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
            },
        },
    },
});
