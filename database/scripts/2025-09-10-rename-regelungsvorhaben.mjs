import { GraphQLClient, gql } from "graphql-request";

const beispielvorhabenMap = new Map();

const copyRegelungsvorhabenToBeispielvorhaben = async (client) => {
  const getRegelungsvorhabens = gql`
    query Regelungsvorhaben {
      regelungsvorhabens(status: DRAFT) {
        documentId
        Titel
        Ressort
        NKRStellungnahmeLink
        DIPVorgang
        NKRNummer
        URLBezeichnung
        Rechtsgebiet
        VeroeffentlichungsDatum
        Digitalchecks {
          documentId
        }
        LinkRegelungstext
        GesetzStatus
        Manteltext
        Paragraphen {
          documentId
        }
        Visualisierungen {
          documentId
        }
        publishedAt
      }
    }
  `;

  const { regelungsvorhabens } = await client.request(getRegelungsvorhabens);

  const createBeispielvorhaben = gql`
    mutation CreateBeispielvorhaben($data: BeispielvorhabenInput!) {
      createBeispielvorhaben(data: $data) {
        documentId
        Titel
        Ressort
        NKRStellungnahmeLink
        DIPVorgang
        NKRNummer
        URLBezeichnung
        Rechtsgebiet
        VeroeffentlichungsDatum
        Digitalchecks {
          documentId
        }
        LinkRegelungstext
        GesetzStatus
        Manteltext
        Paragraphen {
          documentId
        }
        Visualisierungen {
          documentId
        }
        publishedAt
      }
    }
  `;

  for (const regelungsvorhaben of regelungsvorhabens) {
    const { documentId, ...rest } = regelungsvorhaben;

    const res = await client.request(createBeispielvorhaben, {
      data: {
        ...rest,
        Digitalchecks: regelungsvorhaben.Digitalchecks.map(
          ({ documentId }) => documentId
        ),
        Paragraphen: regelungsvorhaben.Paragraphen.map(
          ({ documentId }) => documentId
        ),
        Visualisierungen: regelungsvorhaben.Visualisierungen.map(
          ({ documentId }) => documentId
        ),
      },
    });

    beispielvorhabenMap.set(documentId, res.createBeispielvorhaben.documentId);
  }
};

/**
 * STRAPI_TOKEN=your_api_token node ./database/scripts/2025-09-10-rename-regelungsvorhaben.mjs [url]
 */
async function main() {
  const url = process.argv[2] || "http://localhost:1337/graphql";
  const client = new GraphQLClient(url, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`, // needs API token
    },
  });

  await copyRegelungsvorhabenToBeispielvorhaben(client);
}

main().catch(console.error);
