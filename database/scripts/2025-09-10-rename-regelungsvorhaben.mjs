import { GraphQLClient, gql } from "graphql-request";
import Regelungsvorhabens from "../data/Regelungsvorhaben.json" assert { type: "json" };
import Prinzipien from "../data/Prinzipien.json" assert { type: "json" };

const regelungsvorhabens = Regelungsvorhabens.data.regelungsvorhabens;
const prinzipien = Prinzipien.data.prinzips;

console.log(regelungsvorhabens.length, prinzipien.length);

const beispielvorhabenMap = new Map();

const copyRegelungsvorhabenToBeispielvorhaben = async (client) => {
  // delete all beispielvorhaben
  const getBeispielvorhaben = gql`
    query Beispielvorhaben {
      beispielvorhabens {
        documentId
      }
    }
  `;
  const deleteBeispielvorhaben = gql`
    mutation DeleteBeispielvorhaben($documentId: ID!) {
      deleteBeispielvorhaben(documentId: $documentId) {
        documentId
      }
    }
  `;
  const { beispielvorhabens } = await client.request(getBeispielvorhaben);
  for (const documentId of beispielvorhabens.map(
    ({ documentId }) => documentId
  )) {
    await client.request(deleteBeispielvorhaben, { documentId });
  }

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
    console.log(publishedAt);

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

  const updatePrinzip = gql`
    mutation UpdatePrinzip($documentId: ID!, $data: PrinzipInput!) {
      updatePrinzip(documentId: $documentId, data: $data) {
        Beispielvorhaben {
          documentId
        }
      }
    }
  `;

  for (const prinzip of prinzipien) {
    console.log({
      documentId: prinzip.documentId,
      data: {
        Beispielvorhaben: prinzip.Beispielvorhaben.map(
          ({ documentId }) => beispielvorhabenMap.get(documentId)
        ),
      },
    });
    await client.request(updatePrinzip, {
      documentId: prinzip.documentId,
      data: {
        Beispielvorhaben: prinzip.Beispielvorhaben.map(
          ({ documentId }) => beispielvorhabenMap.get(documentId)
        ),
      },
    });
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
