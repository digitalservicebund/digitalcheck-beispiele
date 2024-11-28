module.exports = {
    definition: `
    type Prinzip @cacheControl(maxAge: 300) {
      documentId: String @cacheControl(maxAge: 300)
      Nummer: String @cacheControl(maxAge: 300)
      Name: String @cacheControl(maxAge: 300)
      Beschreibung: String @cacheControl(maxAge: 300)
      URLBezeichnung: String @cacheControl(maxAge: 300)
    }
  `,
    query: `
    extend type Query {
      prinzips: [Prinzip] @cacheControl(maxAge: 300)
    }
  `,
    resolver: {},
};
