const { print, parse } = require("graphql");
const apolloServerPluginResponseCache = require("@apollo/server-plugin-response-cache").default;

module.exports = ({ env }) => ({
    graphql: {
        enabled: true,
        config: {
            playgroundAlways: true,
            defaultLimit: 20,
            maxLimit: -1,
            apolloServer: {
                plugins: [
                    apolloServerPluginResponseCache({
                        sessionId: async (requestContext) => {
                            // Use a global cache (returning null)
                            return null;
                        },
                        shouldReadFromCache: async (requestContext) => {
                            console.log("Checking cache read for query:", print(parse(requestContext.request.query)));
                            return true;
                        },
                        shouldWriteToCache: async (requestContext) => {
                            console.log("Checking cache write for query:", print(parse(requestContext.request.query)));
                            console.log("Response to cache:", requestContext.response.body);
                            return true;
                        },
                    }),
                ],
            },
        },
    },
});
