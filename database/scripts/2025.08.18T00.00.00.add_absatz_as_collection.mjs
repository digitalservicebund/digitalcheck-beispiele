import { GraphQLClient, gql } from "graphql-request";

async function addAbsaetze(client) {
  // Get all absatz component entries
  const getParagraphsWithAbsaetze = gql`
    query GetParagraphsWithAbsaetze {
      paragraphs(status: DRAFT, pagination: { limit: 1000 }) {
        documentId
        Absaetze {
          Text
          PrinzipErfuellungen {
            WarumGut
            Prinzip {
              documentId
            }
          }
        }
      }
    }
  `;

  let paragraphsWithAbsaetze;
  try {
    paragraphsWithAbsaetze = await client.request(getParagraphsWithAbsaetze);
  } catch (error) {
    console.error("Error fetching paragraphs:", error);
    throw error;
  }

  // Add number to absaetze
  const absaetze = paragraphsWithAbsaetze.paragraphs.flatMap((paragraph) =>
    paragraph.Absaetze.map((absatz, index) => ({
      ...absatz,
      Nummer: index + 1,
      Paragraph: paragraph.documentId,
      PrinzipErfuellungen: absatz.PrinzipErfuellungen.map((erfuellung) => ({
        ...erfuellung,
        Prinzip: erfuellung.Prinzip?.documentId,
      })),
    }))
  );

  // Add absatz as collection
  const addAbsatz = gql`
    mutation AddAbsatz($data: AbsatzInput!) {
      createAbsatz(data: $data) {
        Nummer
        Text
        Paragraph {
          documentId
        }
        PrinzipErfuellungen {
          WarumGut
          Prinzip {
            documentId
          }
        }
      }
    }
  `;

  // Check that absatz does not exist
  const absatzExists = gql`
    query absatz($filters: AbsatzFiltersInput!) {
      absaetze(filters: $filters) {
        documentId
      }
    }
  `;

  for (const absatz of absaetze) {
    const result = await client.request(absatzExists, {
      filters: {
        Paragraph: {
          documentId: {
            eq: "fwgcenmn8dt9d7uyt7nf30d1",
          },
        },
        Nummer: {
          eq: 1,
        },
      },
    });
    if (result.absaetze.length > 0) {
      console.log(`Absatz already exists`);
      continue;
    }
    await client.request(addAbsatz, { data: absatz });
  }
}

async function addBeispielvorhabenVisualisierungReference(client) {
  const getVisualisierungenAndRegelungsvorhaben = gql`
    query Digitalchecks {
      digitalchecks {
        Visualisierungen {
          documentId
        }
        Regelungsvorhaben {
          documentId
        }
      }
    }
  `;

  let visualisierungenAndRegelungsvorhaben;
  try {
    visualisierungenAndRegelungsvorhaben = await client.request(
      getVisualisierungenAndRegelungsvorhaben
    );
  } catch (error) {
    console.error("Error fetching paragraphs:", error);
    throw error;
  }

  const updateRegelungsvorhaben = gql`
    mutation Mutation($documentId: ID!, $data: RegelungsvorhabenInput!) {
      updateRegelungsvorhaben(documentId: $documentId, data: $data) {
        Visualisierungen {
          documentId
        }
      }
    }
  `;

  for (const digitalcheck of visualisierungenAndRegelungsvorhaben.digitalchecks) {
    await client.request(updateRegelungsvorhaben, {
      documentId: digitalcheck.Regelungsvorhaben.documentId,
      data: {
        Visualisierungen: digitalcheck.Visualisierungen.map(
          ({ documentId }) => documentId
        ),
      },
    });
  }
}

async function addBeispielvorhabenPrinzipReference(client) {
  const getPrinzipienAndRegelungsvorhaben = gql`
    query QueryPrinzipien {
      prinzips {
        GuteUmsetzungen {
          Regelungsvorhaben {
            documentId
          }
        }
        documentId
      }
    }
  `;

  let prinzipienAndRegelungsvorhaben;
  try {
    prinzipienAndRegelungsvorhaben = await client.request(
      getPrinzipienAndRegelungsvorhaben
    );
  } catch (error) {
    console.error("Error fetching paragraphs:", error);
    throw error;
  }

  const updatePrinzipien = gql`
    mutation Mutation($documentId: ID!, $data: PrinzipInput!) {
      updatePrinzip(documentId: $documentId, data: $data) {
        Beispielvorhaben {
          documentId
        }
      }
    }
  `;

  for (const prinzip of prinzipienAndRegelungsvorhaben.prinzips) {
    await client.request(updatePrinzipien, {
      documentId: prinzip.document_id,
      data: {
        Beispielvorhaben: prinzip.GuteUmsetzungen.map(
          (digitalcheck) => digitalcheck.Regelungsvorhaben.document_id
        ),
      },
    });
  }
}

/**
 * STRAPI_TOKEN=your_api_token npm run add-absatz-as-collection
 */
async function main() {
  const client = new GraphQLClient("http://localhost:1337/graphql", {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`, // needs API token
    },
  });

  await addAbsaetze(client);
  await addBeispielvorhabenVisualisierungReference(client);
  await addBeispielvorhabenPrinzipReference(client);
}

main().catch(console.error);
