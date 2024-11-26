
module.exports = () => ({
    graphql: {
        shadowCRUD: true,
        enabled: true,
        config: {
            playgroundAlways: true,
            defaultLimit: 10,
            maxLimit: 20,
            apolloServer: {
                tracing: true,
                cache: 'bounded',
                plugins: [require('apollo-server-plugin-response-cache').default()],
            },
        }
    }
})