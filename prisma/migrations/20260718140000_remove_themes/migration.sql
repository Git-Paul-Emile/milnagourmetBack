-- Suppression du systeme de themes.
--
-- La table "themes" n'a aucune cle etrangere entrante ni sortante :
-- sa suppression n'affecte aucune autre table.
--
-- ATTENTION : operation irreversible. Sauvegarder la base avant execution.
-- Pour conserver les donnees, remplacer par un renommage :
--   ALTER TABLE "themes" RENAME TO "themes_archive";

DROP TABLE IF EXISTS "themes";
