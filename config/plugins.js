const ApolloServerPluginCacheControl = require('@apollo/server/plugin/cacheControl').ApolloServerPluginCacheControl;
const ApolloServerPluginInlineTrace = require('@apollo/server/plugin/inlineTrace').ApolloServerPluginInlineTrace;
const responseCachePlugin = require('@apollo/server-plugin-response-cache').default;

module.exports = () => ({
    graphql: {
        enabled: true,
        config: {
            playgroundAlways: true,
            defaultLimit: 20,
            apolloServer: {
                tracing: true,
                plugins: [
                    ApolloServerPluginInlineTrace({
                        includeErrors: { transform: (err) => err },
                      }),
                    // ApolloServerPluginCacheControl({
                    //     defaultMaxAge: 3600,
                    // }),
                    responseCachePlugin(),
                ],
            },
        },
    },
});
