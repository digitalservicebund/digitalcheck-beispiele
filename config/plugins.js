const ApolloServerPluginCacheControl = require('@apollo/server/plugin/cacheControl').ApolloServerPluginCacheControl;

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
                        // Cache everything for 1 second by default.
                        defaultMaxAge: 3600,
                        // Don't send the `cache-control` response header.
                        // calculateHttpHeaders: false,
                      }),
                ]
            },
        },
    },
});
