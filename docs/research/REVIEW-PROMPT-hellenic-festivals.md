# Review prompt — Hellenic festivals data vs. Parke

Paste this entire file as your first message in a fresh Claude Code session
with the Horologium project open. Delete this header block before pasting.

---

## Task

Cross-reference every festival entry in `utils/atticCalendarData.ts` against
H. W. Parke, *Festivals of the Athenians* (Thames & Hudson, 1977).
The PDF is at `~/Downloads/festivals-of-the-athenians_compress.pdf` — it is a
scanned book, so use the Read tool with the `pages` parameter to read it.

## What already happened (do not redo this)

The Thesmophoria entries (Pyanepsion 11–13) and the Skira (Skiraphorion 12) were
already reviewed and corrected in a previous session. Their sources are documented
in `docs/research/hellenic-festivals-sources.md`. Skip those four entries.

## PDF page offset

The PDF has ~14 pages of front matter before printed page 1.
**PDF page = printed page + 14.**

Chapter locations in the book (printed page → PDF page):

| Month | Printed p. | PDF p. |
|---|---|---|
| Hecatombaion | 29 | 43 |
| Metageitnion | 51 | 65 |
| Boedromion | 53 | 67 |
| Pyanepsion | 73 | 87 | ← already reviewed |
| Maimakterion | 95 | 109 |
| Poseideon | 97 | 111 |
| Gamelion | 104 | 118 |
| Anthesterion | 107 | 121 |
| Elaphebolion | 125 | 139 |
| Munichion | 137 | 151 |
| Thargelion | 146 | 160 |
| Skiraphorion | 156 | 170 | ← Skira already reviewed |
| Other / Unplaced | 171 | 185 |

## How to proceed

For each festival entry in `atticCalendarData.ts` (except the four already done):

1. Find the festival in the Parke PDF (read ±10 pages around the chapter start
   for that month; read more if needed). Use 10-page chunks per Read call.
2. Compare the entry's `festivalDesc`, `aition`, `deity`, `participants`,
   `ritualOffering`, `pannychisDesc`, `agonDesc` against what Parke says.
3. Record findings in the format below.

## What to look for

- **Wrong day**: Parke gives a different day of the month than what the code uses.
- **Wrong deity or epithet**: code uses a generic name where Parke gives a specific
  cult title, or vice versa.
- **Invented or unverified aition**: the code's aition narrative is not found in
  Parke and has no cited source. (This is the main issue found in the previous
  review — one aition turned out to be a late dictionary invention Parke explicitly
  calls a probable fiction.)
- **Missing ritual detail**: a significant ritual described by Parke is absent from
  the code entry (e.g. a procession, an offering, a specific agonistic event).
- **Missing festival**: Parke describes a festival for that month that has no entry
  at all in the code.
- **Correct and complete**: nothing to add.

## Output format

Produce a markdown report. For each entry use this structure:

```
### [Month name] [day] — [festivalName]
**Status**: CORRECT | MINOR GAP | SIGNIFICANT GAP | WRONG | MISSING
**Parke**: printed p. [X]–[Y] / PDF p. [X]–[Y]
**Issues found**:
- (one bullet per issue, or "None" if correct)
**Suggested fix** (only if issues found):
- (concrete change to festivalDesc / aition / etc.)
```

If you find a verbatim Parke passage that directly supports or contradicts the
code, quote it in a block quote under the finding.

## After the review

- Save the full report as `docs/research/hellenic-festivals-review-[YYYY-MM-DD].md`.
- Do NOT edit `atticCalendarData.ts` directly. The report is for human review first.
- Append a summary section at the end of the report:
  - Number of entries reviewed
  - Number correct, minor gaps, significant gaps, wrong, missing
  - Top 3 most urgent fixes

## Context about the project

- `utils/atticCalendarData.ts` is a TypeScript file with one large function
  `getAtticFestivalInfo(monthIndex, dayOfMonth)` returning festival objects.
  monthIndex 0 = Hecatombaion … 11 = Skiraphorion.
- The festival data was originally created using Parke as the primary source,
  but some entries have drifted (wrong aitiā, embellishments, unverified details).
- The UI is in Spanish; Parke is in English. Translate festival names and ritual
  terms to Spanish where quoting into the suggested fix, but keep ancient Greek
  terms (Nesteia, Anodos, etc.) untranslated.
- Do not add comments to the code. All source notes go in the docs/research/ file.
