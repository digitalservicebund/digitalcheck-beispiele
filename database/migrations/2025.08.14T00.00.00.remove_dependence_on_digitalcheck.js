"use strict";

const crypto = require("crypto");

/**
 * - Copy Absatz Component -> Absatz Collection type
 *    - Paragraph Absatz Mapping
 * - Beispielvorhaben (Regelungsvorhaben)
 *    - Relation to Paragraph ✅
 *       TODO: check one missing entry
 *    - Relation to Visualisierungen
 * - Prinzip
 *    - Relation to Beispielvorhaben
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
    // Add relation from Beispielvorhaben -> Paragraph
    await knex("paragraphs_beispielvorhaben_lnk").insert(
      knex("paragraphs_digitalcheck_lnk")
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
    );

    // Copy Absatz Component -> Absatz Collection
    const rows = await knex("components_shared_absatzs as csa")
      .innerJoin("paragraphs_cmps as pc", function () {
        this.on("csa.id", "=", "pc.cmp_id").onIn("pc.component_type", [
          "shared.absatz",
        ]);
      })
      .select(
        "csa.id",
        "pc.entity_id",
        "csa.text",
        knex.raw(
          "ROW_NUMBER() OVER (PARTITION BY ?? ORDER BY ??.??, ??.??) as ??",
          ["pc.entity_id", "csa", "id", "pc", "order", "number"]
        )
      );

    const now = new Date().toISOString();

    const insertRows = rows.map((row) => ({
      id: row.id,
      document_id: generateDocumentId(),
      nummer: row.number,
      text: row.text,
      created_at: now,
      updated_at: now,
      published_at: now,
      created_by_id: null,
      updated_by_id: null,
      locale: null,
    }));

    await knex("absaetze").insert(insertRows);

    // Add Paragraph -> Absatz Collection relation
    const absatzSelection = knex("paragraphs_cmps as pc")
      .select({
        id: "id",
        absatz_id: "cmp_id",
        paragraph_id: "entity_id",
        absatz_ord: "order",
      })
      .toSQL();

    await knex.raw(
      `
      INSERT INTO "absaetze_paragraph_lnk"
        ("id","absatz_id","paragraph_id","absatz_ord")
      ${absatzSelection.sql}
    `,
      absatzSelection.bindings
    );
  } catch (error) {
    console.error(error);
    console.warn("Error occurred during migration. Skipping...");
  }
}

module.exports = { up };
