const {KeyvAdapter} = require("@apollo/utils.keyvadapter");
const { default: Keyv } = require('keyv');

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
                cache: new KeyvAdapter(new Keyv()),
                plugins: [
                    require('apollo-server-plugin-response-cache').default(),
                ],
            },
        }
    }
})