import { GraphQLClient, gql } from "graphql-request";

async function main() {
  const client = new GraphQLClient("http://localhost:1337/graphql", {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`, // needs API token
    },
  });

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

  console.log(absaetze.length);

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

  for (const absatz of absaetze) {
    console.log(JSON.stringify(absatz, null, 2));
    await client.request(addAbsatz, { data: absatz });
  }
}

main().catch(console.error);
