const ApolloServerPluginCacheControl = require('@apollo/server/plugin/cacheControl').ApolloServerPluginCacheControl;
const ApolloServerPluginInlineTrace = require('@apollo/server/plugin/inlineTrace').ApolloServerPluginInlineTrace;

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
                //     ApolloServerPluginCacheControl({
                //         defaultMaxAge: 3333,
                //         calculateHttpHeaders: true,
                //     }),
                ],
            },
        },
    },
});
