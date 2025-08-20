import { GraphQLClient, gql } from "graphql-request";

async function addAbsaetzeComponent(client) {
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

  const paragraphsWithAbsaetze = await client.request(
    getParagraphsWithAbsaetze
  );

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
      continue;
    }
    await client.request(addAbsatz, { data: absatz });
  }
}

async function addBeispielvorhabenVisualisierungRelation(client) {
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

  const visualisierungenAndRegelungsvorhaben = await client.request(
    getVisualisierungenAndRegelungsvorhaben
  );

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
    if (
      digitalcheck.Visualisierungen.length > 0 &&
      digitalcheck.Regelungsvorhaben
    ) {
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
}

async function addBeispielvorhabenParagraphRelation(client) {
  const getRegelungsvorhaben = gql`
    query Regelungsvorhaben {
      regelungsvorhabens(status: DRAFT) {
        documentId
        Digitalchecks {
          documentId
        }
      }
    }
  `;

  const regelungsvorhaben = await client.request(getRegelungsvorhaben);

  // To also include Paragraphs that are not published yet
  const getAllParagraphs = gql`
    query Paragraphen {
      paragraphs(status: DRAFT, pagination: { limit: 1000 }) {
        documentId
        Nummer
        Digitalcheck {
          documentId
        }
      }
    }
  `;

  const allParagraphs = await client.request(getAllParagraphs);

  const updateRegelungsvorhaben = gql`
    mutation Mutation($documentId: ID!, $data: RegelungsvorhabenInput!) {
      updateRegelungsvorhaben(
        documentId: $documentId
        data: $data
        status: DRAFT
      ) {
        Paragraphen {
          documentId
        }
      }
    }
  `;

  for (const vorhaben of regelungsvorhaben.regelungsvorhabens) {
    const paragraphs = allParagraphs.paragraphs.filter(
      (paragraph) =>
        paragraph.Digitalcheck?.documentId === vorhaben.Digitalchecks[0].documentId
    );
    if (paragraphs.length === 0) continue;
    await client.request(updateRegelungsvorhaben, {
      documentId: vorhaben.documentId,
      data: {
        Paragraphen: paragraphs
          .toSorted((a, b) => a.Nummer.localeCompare(b.Nummer))
          .map(({ documentId }) => documentId),
      },
    });
  }
}

async function addPrinzipRelations(client) {
  const getPrinzipien = gql`
    query Prinzipien {
      prinzips(status: DRAFT) {
        GuteUmsetzungen {
          Regelungsvorhaben {
            documentId
          }
        }
        documentId
        Example {
          Paragraph {
            documentId
          }
          AbsatzNumber
        }
        PrinzipienAnwendung {
          Title
          Example {
            Paragraph {
              documentId
            }
            AbsatzNumber
          }
          Text
          Questions
          WordingExample
        }
      }
    }
  `;

  const prinzipien = await client.request(getPrinzipien);

  const getParagraphs = gql`
    query Paragraphs {
      paragraphs(pagination: { limit: 1000 }, status: DRAFT) {
        Absatz {
          Nummer
          documentId
        }
        documentId
      }
    }
  `;

  const paragraphs = await client.request(getParagraphs);

  const updatePrinzipien = gql`
    mutation updatePrinzipien($documentId: ID!, $data: PrinzipInput!) {
      updatePrinzip(documentId: $documentId, data: $data, status: DRAFT) {
        Beispielvorhaben {
          documentId
        }
        Beispiel {
          documentId
        }
        PrinzipienAnwendung {
          Beispiel {
            documentId
          }
        }
      }
    }
  `;

  const getAbsatzDocumentId = ({ Paragraph, AbsatzNumber }) => {
    return paragraphs.paragraphs
      .find((paragraph) => paragraph.documentId === Paragraph.documentId)
      .Absatz.find((absatz) => absatz.Nummer === AbsatzNumber).documentId;
  };

  for (const prinzip of prinzipien.prinzips) {
    await client.request(updatePrinzipien, {
      documentId: prinzip.documentId,
      data: {
        Beispielvorhaben: prinzip.GuteUmsetzungen.map(
          (digitalcheck) => digitalcheck.Regelungsvorhaben.documentId
        ),
        ...(prinzip.Example
          ? {
              Beispiel: getAbsatzDocumentId(prinzip.Example),
            }
          : {}),
        // As we need to update a nested field (PrinzipienAnwendung) that we don't have direct access to,
        // we need to provide the full list of this object as it overwrites the existing one.
        // This is achieved by spreading the existing object and adding the new values.
        PrinzipienAnwendung: prinzip.PrinzipienAnwendung.map((anwendung) => ({
          ...anwendung,
          ...(anwendung.Example
            ? {
                Example: {
                  ...anwendung.Example,
                  Paragraph: anwendung.Example.Paragraph.documentId,
                },
                Beispiel: getAbsatzDocumentId(anwendung.Example),
              }
            : {}),
        })),
      },
    });
  }
}

/**
 * STRAPI_TOKEN=your_api_token npm run add-absatz-as-collection [url]
 */
async function main() {
  const url = process.argv[2] || "http://localhost:1337/graphql";
  const client = new GraphQLClient(url, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`, // needs API token
    },
  });

  await addAbsaetzeComponent(client);
  await addBeispielvorhabenVisualisierungRelation(client);
  await addBeispielvorhabenParagraphRelation(client);
  await addPrinzipRelations(client);
}

main().catch(console.error);
