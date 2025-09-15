import { GraphQLClient, gql } from "graphql-request";
import Prinzipien from "../data/Prinzipien.json" with { type: "json" };
import Regelungsvorhabens from "../data/Regelungsvorhaben.json" with { type: "json" };

const regelungsvorhabens = Regelungsvorhabens.data.regelungsvorhabens;
const prinzipien = Prinzipien.data.prinzips;

const beispielvorhabenMap = new Map();

const copyRegelungsvorhabenToBeispielvorhabenAndUpdatePrinzipien = async (
  client
) => {
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
    await client.request(updatePrinzip, {
      documentId: prinzip.documentId,
      data: {
        Beispielvorhaben: prinzip.Beispielvorhaben.map(({ documentId }) =>
          beispielvorhabenMap.get(documentId)
        ),
      },
    });
  }
};

const copyPrinzipienAnwendungToPrinzipAspekt = async (client) => {
  const getPrinzips = gql`
    query Prinzips {
      prinzips(status: DRAFT) {
        documentId
        PrinzipienAnwendung {
          Title
          Text
          Questions
          WordingExample
          Beispiel {
            documentId
          }
        }
      }
    }
  `;
  const { prinzips } = await client.request(getPrinzips);

  const updatePrinzipAspekt = gql`
    mutation Prinzip($documentId: ID!, $data: PrinzipInput!) {
      updatePrinzip(documentId: $documentId, data: $data) {
        Aspekte {
          Titel
          Text
          Leitfragen
          Formulierungsbeispiel
          Beispiel {
            documentId
          }
        }
      }
    }
  `;

  for (const prinzip of prinzips) {
    await client.request(updatePrinzipAspekt, {
      documentId: prinzip.documentId,
      data: {
        Aspekte: prinzip.PrinzipienAnwendung.map((anwendung) => ({
          Titel: anwendung.Title,
          Text: anwendung.Text,
          Leitfragen: anwendung.Questions,
          Formulierungsbeispiel: anwendung.WordingExample,
          Beispiel: anwendung.Beispiel?.documentId,
        })),
      },
    });
  }
};

const copyWarumGutToErklärung = async (client) => {
  const getAbsaetze = gql`
    query Absatz {
      absaetze(status: DRAFT, pagination: { limit: 1000 }) {
        documentId
        PrinzipErfuellungen {
          Prinzip {
            documentId
          }
          WarumGut
        }
      }
    }
  `;

  const { absaetze } = await client.request(getAbsaetze);
  const updateAbsatz = gql`
    mutation UpdateAbsatz($documentId: ID!, $data: AbsatzInput!) {
      updateAbsatz(documentId: $documentId, data: $data) {
        PrinzipErfuellungen {
          Prinzip {
            documentId
          }
          Erklaerung
        }
      }
    }
  `;
  for (const absatz of absaetze) {
    await client.request(updateAbsatz, {
      documentId: absatz.documentId,
      data: {
        PrinzipErfuellungen: absatz.PrinzipErfuellungen.map((erfuellung) => ({
          Prinzip: erfuellung.Prinzip.documentId,
          Erklaerung: erfuellung.WarumGut,
          WarumGut: erfuellung.WarumGut,
        })),
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

  await copyRegelungsvorhabenToBeispielvorhabenAndUpdatePrinzipien(client);
  await copyPrinzipienAnwendungToPrinzipAspekt(client);
  await copyWarumGutToErklärung(client);
}

main().catch(console.error);
