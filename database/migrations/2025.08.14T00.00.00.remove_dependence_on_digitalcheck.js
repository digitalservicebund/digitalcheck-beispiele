"use strict";

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

/** * @param {import('knex').Knex} knex */
async function up(knex) {

  try {
    await knex("paragraphs_beispielvorhaben_lnk").insert(
      knex("paragraphs_digitalcheck_lnk").innerJoin("digitalchecks_regelungsvorhaben_lnk", "paragraphs_digitalcheck_lnk.digitalcheck_id", "digitalchecks_regelungsvorhaben_lnk.digitalcheck_id").select({
        id: "paragraphs_digitalcheck_lnk.id",
        paragraph_id: "paragraphs_digitalcheck_lnk.paragraph_id",
        regelungsvorhaben_id: "digitalchecks_regelungsvorhaben_lnk.regelungsvorhaben_id",
        paragraph_ord: "paragraphs_digitalcheck_lnk.paragraph_ord",
      })
    );
  } catch (error) {
    console.error(error);
    console.warn("Error occurred during migration. Skipping...");
  }
}

module.exports = { up };
