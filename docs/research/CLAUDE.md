# docs/research/CLAUDE.md

Guidance for working in this directory. Data quality rules per civilization are in `utils/CLAUDE.md`. Component notes are in `components/CLAUDE.md`.

---

## How to run a festival scholarly review

Use this procedure whenever festival data needs a quality pass — for any civilization. It has been run for Rome (2026-10-25), Hellas (2026-10-25), Aegyptus (2026-10-25), and Babylonia (2026-10-25).

### Phase pipeline

Run phases sequentially; each agent's output feeds the next.

**Phase 0 — Read current app data**
Spawn an agent to read the relevant data file(s) and produce a structured list of every festival entry: key, name, description, deity, sources cited (if any). This is the baseline.

**Phase 1 — Source extraction**
For each primary source PDF in `docs/research/` (or user-supplied), spawn one agent per source to extract festival/calendar data month by month. Save output to `docs/research/extracts/<source>/`. Use consistent month headings so Phase 2 can diff them.

**Phase 2 — Month-by-month comparison**
One agent compares the app baseline (Phase 0) against all source extracts (Phase 1) for each month. Output: `docs/research/extracts/review/month-N.md` per month with MATCH / WRONG / MISSING / EXTRA annotation per entry.

**Phase 3 — Consolidated review report**
Aggregate all month files into a single `docs/research/<civ>-festivals-review-<date>.md`. Categorise findings:

- `WRONG_DATE` — attested date differs from app
- `WRONG_DEITY` — wrong deity assigned
- `WRONG_RITUAL` — ritual description contradicts sources
- `INVENTED_AITION` / `INVENTED` — no source supports the claim
- `MISSING` — festival in sources but not in app
- `MINOR` — wording, uncertainty markers, secondary sources

Assign severity: HIGH (factual error), MEDIUM (sourcing issue), MINOR/LOW (wording).

**Phase 4 — Apply corrections**
Apply HIGH and MEDIUM findings first in one pass, then MINOR/LOW in a second pass. For each change, cite the source inline in the data file comment or field. Commit each pass separately.

### Book of the Dead cross-reference (Aegyptus only)

After Phase 4, run a separate agent to read `docs/research/extracts/book-of-the-dead/extract.md` and map each BoD spell to its calendar date. For spells that map unambiguously, add a `fonte: FestivalFonte` to the corresponding `CIVIL_FESTIVALS` or `LUNAR_FESTIVALS` entry. Save the extract file before this step.

### Primary text fonte pass (Babylonia only)

After Phase 4, add `fonte: BabylonianFonte` entries to `dayEvents` in `babylonianLoreData.ts`. Only add a fonte where a verbatim primary-text passage (Akkadian ritual tablet, Sumerian poem, creation epic) is directly linked to the rite of that day. Sources already used: King 1902 (Enūma Eliš), Thureau-Dangin 1921 (Akītu tablets), Rogers 1908 (Descent of Ištar), Jacobsen 1976 (sacred marriage hymns), Abusch 2016 (Maqlu). Future pass: Sachs & Hunger _Astronomical Diaries_ for `BabylonianSkyDiary`.

### Output files to commit

- `docs/research/extracts/<source>/*.md` — raw extracts
- `docs/research/extracts/review/*.md` — month comparisons (optional, useful for audit trail)
- `docs/research/<civ>-festivals-review-<date>.md` — consolidated report
- The corrected data file (`romanYearData.ts`, `atticCalendarData.ts`, `egyptianFestivalsData.ts`, etc.)
