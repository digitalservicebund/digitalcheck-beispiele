"use strict";

const crypto = require("crypto");

/**
 * - Copy Absatz Component -> Absatz Collection type ✅
 *    - Paragraph Absatz Mapping ✅
 * - Beispielvorhaben (Regelungsvorhaben)
 *    - Relation to Paragraph ✅
 *       TODO: check one missing entry
 *    - Relation to Visualisierungen ✅
 * - Prinzip
 *    - Relation to Beispielvorhaben ✅
 *    - Relation to Beispiel (Absatz)
 *    - PrinzipAnwendung -> Relation to Beispiel (Absatz)
 *
 */

function generateDocumentId() {
  return crypto.randomBytes(12).toString("hex"); // 12 bytes = 24 hex chars
}

/** @param {import('knex').Knex} knex */
async function up(knex) {
  try {
    const now = Date.now();

    // Add relation from Beispielvorhaben -> Paragraph ---------------------------------------------
    const insertParagraphSelection = knex("paragraphs_digitalcheck_lnk")
      .innerJoin(
        "digitalchecks_regelungsvorhaben_lnk",
        "paragraphs_digitalcheck_lnk.digitalcheck_id",
        "digitalchecks_regelungsvorhaben_lnk.digitalcheck_id"
      )
      .select({
        id: "paragraphs_digitalcheck_lnk.id",
        paragraph_id: "paragraphs_digitalcheck_lnk.paragraph_id",
        regelungsvorhaben_id:
          "digitalchecks_regelungsvorhaben_lnk.regelungsvorhaben_id",
        paragraph_ord: "paragraphs_digitalcheck_lnk.paragraph_ord",
      })
      .toSQL();

    await knex.raw(
      `
      INSERT INTO "paragraphs_beispielvorhaben_lnk"
        ("id","paragraph_id","regelungsvorhaben_id","paragraph_ord")
      ${insertParagraphSelection.sql}
    `,
      insertParagraphSelection.bindings
    );

    // Add relation from Beispielvorhaben -> Visualisierungen --------------------------------------
    const insertVisualisierungLink = knex("visualisierungen_digitalcheck_lnk")
      .innerJoin(
        "digitalchecks_regelungsvorhaben_lnk",
        "visualisierungen_digitalcheck_lnk.digitalcheck_id",
        "digitalchecks_regelungsvorhaben_lnk.digitalcheck_id"
      )
      .select({
        id: "visualisierungen_digitalcheck_lnk.id",
        visualisierung_id:
          "visualisierungen_digitalcheck_lnk.visualisierung_id",
        regelungsvorhaben_id:
          "digitalchecks_regelungsvorhaben_lnk.regelungsvorhaben_id",
        visualisierung_ord:
          "visualisierungen_digitalcheck_lnk.visualisierung_ord",
      })
      .toSQL();

    await knex.raw(
      `
      INSERT INTO "visualisierungen_beispielvorhaben_lnk"
        ("id","visualisierung_id","regelungsvorhaben_id","visualisierung_ord")
      ${insertVisualisierungLink.sql}
    `,
      insertVisualisierungLink.bindings
    );

    // Copy Absatz Component -> Absatz Collection --------------------------------------------------
    const absatzRows = await knex("components_shared_absatzs as csa")
      .innerJoin("paragraphs_cmps as pc", "csa.id", "pc.cmp_id")
      .select(
        "csa.id",
        "pc.entity_id",
        "csa.text",
        knex.raw("ROW_NUMBER() OVER (PARTITION BY ?? ORDER BY ??.??) as ??", [
          "pc.entity_id",
          "pc",
          "order",
          "number",
        ])
      );
    // TODO:
    // - id raus aus order
    // - use order for nummer

    const lastAbsatzId = absatzRows[absatzRows.length - 1].id;
    const absatzIdMap = new Map();
    const insertAbsatzRows = absatzRows
      .map((row) => ({
        id: row.id,
        document_id: generateDocumentId(),
        nummer: row.number,
        text: row.text,
        created_at: now,
        updated_at: now,
        published_at: null,
        created_by_id: null,
        updated_by_id: null,
        locale: "de",
      }))
      .flatMap((newAbsatz, i) => {
        const id = lastAbsatzId + 1 + i;
        absatzIdMap.set(newAbsatz.id, id);

        const newRows = [
          { ...newAbsatz },
          { ...newAbsatz, published_at: now, id },
        ];
        return newRows;
      });

    // await knex("absaetze").insert(insertAbsatzRows);

    // Add Paragraph -> Absatz Collection relation
    const absatzParagraphRelationRows = await knex(
      "paragraphs_cmps as pc"
    ).select({
      absatz_id: "cmp_id",
      paragraph_id: "entity_id",
      absatz_ord: "order",
    });

    const insertAbsatzParagraphRelationRows =
      absatzParagraphRelationRows.flatMap((row) => [
        row,
        {
          ...row,
          absatz_id: absatzIdMap.get(row.absatz_id),
        },
      ]);
    await knex("absaetze_paragraph_lnk").insert(
      insertAbsatzParagraphRelationRows
    );

    // Add Absatz -> PrinzipErfuellung link
    const insertAbsatzLink = knex("components_shared_absatzs_cmps").toSQL();
    await knex.raw(
      `
      INSERT INTO "absaetze_cmps"
        ("id","entity_id","cmp_id","component_type","field","order")
      ${insertAbsatzLink.sql}
    `,
      insertAbsatzLink.bindings
    );

    // Add Prinzip -> Beispielvorhaben relation ----------------------------------------------------
    const insertPrinzipBeispielvorhabenRelation = knex(
      "prinzips_gute_umsetzungen_lnk"
    )
      .innerJoin(
        "digitalchecks_regelungsvorhaben_lnk",
        "prinzips_gute_umsetzungen_lnk.digitalcheck_id",
        "digitalchecks_regelungsvorhaben_lnk.digitalcheck_id"
      )
      .select({
        id: "prinzips_gute_umsetzungen_lnk.id",
        prinzip_id: "prinzips_gute_umsetzungen_lnk.prinzip_id",
        regelungsvorhaben_id:
          "digitalchecks_regelungsvorhaben_lnk.regelungsvorhaben_id",
        regelungsvorhaben_ord:
          "digitalchecks_regelungsvorhaben_lnk.digitalcheck_ord",
      })
      .toSQL();

    await knex.raw(
      `
      INSERT INTO "prinzips_beispielvorhaben_lnk"
        ("id","prinzip_id","regelungsvorhaben_id","regelungsvorhaben_ord")
      ${insertPrinzipBeispielvorhabenRelation.sql}
    `,
      insertPrinzipBeispielvorhabenRelation.bindings
    );

    // Add Prinzip -> Beispiel Absatz relation -----------------------------------------------------
    // const absatzIdColumnIdentifier = knex.ref("paragraphs_cmps.cmp_id")

    // const absatzSubquery = knex.("absaetze_paragraph_lnk").innerJoin(
    //   "absaetze",
    //   "absaetze.id",
    //   "absaetze_paragraph_lnk.absatz_id"
    // )

    // const exampleQuery = knex("prinzips_cmps")
    //   .innerJoin(
    //     "components_shared_example_absatzs"
    //   )
    //   .select({
    //     id: "id",
    //     prinzip_id: "entity_id",
    //     absatzExample_id: "cmp_id",
    //   })
    //   .where("field", "=", "Example")
    //   .toSQL();

    // await knex.raw(
    //   `
    //   INSERT INTO "prinzips_beispiel_lnk"
    //     ("id","prinzip_id","absatz_id")
    //   ${insertPrinzipExampleAbsatzRelation.sql}
    // `,
    //   insertPrinzipExampleAbsatzRelation.bindings
    // );

    // ---------------------------------------------------------------------------------------------
  } catch (error) {
    console.error(error);
    console.warn("Error occurred during migration. Skipping...");
  }
}

module.exports = { up };
