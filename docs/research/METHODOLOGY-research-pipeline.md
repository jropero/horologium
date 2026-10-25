# Research Pipeline Methodology
## Scholarly validation of festival data against PDF sources

*Written after the Hellenic festival review (2026-10-25). Use as a template for future civilizations.*

---

## Overview

The goal was to cross-reference every festival entry in `utils/atticCalendarData.ts` against three scholarly PDFs and produce a prioritized list of corrections. The same approach applies to any civilization with static festival data.

The key insight: **extract first, compare second**. Trying to read a PDF and compare it to app data in the same agent bloats context fast and produces shallow work. Splitting into phases keeps each agent's job small and reproducible.

---

## Phase structure

### Phase 0 — Preparation

Before spawning anything:

1. **Verify the PDF has a text layer**: run `pdftotext -f 1 -l 3 <file> - 2>/dev/null` and check the output is readable text, not garbage or empty. OCR'd scans sometimes have no extractable text.
2. **Establish the page offset**: printed page numbers ≠ PDF page numbers. Find a landmark (table of contents, chapter heading) and compute the delta. Document it clearly.
   - Parke (1977): `PDF = printed − 2`
   - Mikalson (1975): `PDF = printed + 14`
   - Deubner (1932): non-linear offset; must search headings manually
3. **Check file size**: the Read tool has a ~100 MB limit. Files over that must use `pdftotext` via Bash. Add `"Bash(pdftotext *)"` to `~/.claude/settings.json` permissions to avoid repeated prompts.
4. **Read the table of contents**: understand how the book is organized (by month? by deity? by topic?). This determines whether a reindex phase is needed.

---

### Phase 1 — Source extraction (parallel)

**One agent per source per month (or per chapter section).**

Each agent:
- Reads a defined page range from the PDF
- Extracts all festival data for its assigned scope
- Writes to a dedicated output file (e.g. `docs/research/extracts/parke/boedromion.md`)

**Never have two agents write to the same file** — no locking mechanism exists.

Launch all agents in a single message to run in parallel. For a 12-month calendar with 2 sources, that is ~24 agents at once.

**Agent prompt must include:**
- Exact PDF path
- Page range (derived from the page offset)
- Output file path
- Format instructions (structured markdown: festival name, day, deity, ritual, aition, participants, sources cited)
- What to skip (e.g. festivals already reviewed in a prior session)
- The page offset formula, explicitly stated

**Model**: use `sonnet` not `haiku`. The extraction quality difference is significant for scholarly text.

---

### Phase 2 — Reindex (if needed)

Some sources are organized differently from the app. Deubner (1932) groups content by deity (Athena chapter, Demeter chapter, Dionysus chapter…) rather than by month. A single reindex agent reads all deity-chapter extract files and rewrites their content organized by Attic month/day into one `by-month.md` file.

This phase runs only when source organization doesn't match app organization. For month-organized sources (Parke, Fowler, Scullard) it is unnecessary.

---

### Phase 3 — Per-month comparison (parallel)

**One agent per month.**

Each agent:
- Reads the app's source file (e.g. `utils/atticCalendarData.ts`) for its assigned month
- Reads the relevant source extract files (Phase 1 output)
- Produces a structured comparison in `docs/research/extracts/review/<month>.md`

Finding categories to use consistently:
- `WRONG_DATE` — festival on wrong day vs. sources
- `WRONG_DEITY` — wrong deity name or epithet
- `INVENTED_AITION` — aition not found in any source
- `WRONG_RITUAL` — ritual description contradicts sources
- `MISSING_FESTIVAL` — festival attested in sources, absent from app
- `MINOR` — debatable, single-source, or small inaccuracies

Each finding should quote exactly what the app says and exactly what the source says.

Launch all 12 agents in parallel.

---

### Phase 4 — Collation (single agent)

One agent reads all 12 comparison files and produces the final report:

- Executive summary with finding counts by category
- Top N most urgent fixes
- Month-by-month findings (all categories)
- Any cross-source date conflicts resolved (e.g. Mikalson vs. Parke vs. Deubner)
- **Concrete code changes**: for every firmly attested WRONG_DATE / WRONG_DEITY / WRONG_RITUAL, give exact field, old value → new value

`INVENTED_AITION` findings are flagged in the report but excluded from the mandatory code-change list — they are flavor text and the fix is editorial.

---

## Problems encountered and solutions

### Problem: Wrong page offset in initial prompts

**What happened**: The Parke offset was incorrectly stated as `PDF = printed + 14` (Mikalson's formula) in the first prompt. Several agents extracted the wrong pages.

**Solution**: Most agents self-corrected when the text didn't match expected content. For those that didn't, re-run with the correct formula. Always verify by checking the first page of the extracted range against a known landmark (chapter title, festival name).

**Prevention**: Before writing any agent prompt, open the PDF manually and confirm the offset with a spot-check at 2–3 different pages.

---

### Problem: Content landed in the wrong month's file

**What happened**: The Thargelion extraction agent was given the wrong page range and captured Skiraphorion content. The Skiraphorion agent captured the "Other Festivals" chapter.

**Solution**: Each file was annotated with a scope note explaining what it actually contains. The Phase 3 agents were directed to read the correct file for the correct chapter regardless of filename. In a future run, detect this early by having Phase 1 agents report the first festival name they see as a sanity check.

**Prevention**: After each extraction, confirm the output file's first and last festival name against expectations before launching Phase 3.

---

### Problem: Large PDF exceeds Read tool limit

**What happened**: Deubner (1932) is 108 MB — too large for the Read tool.

**Solution**: Use `pdftotext -f <start> -l <end> <path> - 2>/dev/null` via Bash instead. This extracts a page range as plain text. Add `"Bash(pdftotext *)"` to the global permissions allowlist once to avoid per-call prompts.

**Boundary**: Files under ~80 MB: use the Read tool. Files over: use pdftotext. Mikalson (8.7 MB) and Parke (~60 MB) used Read; Deubner (108 MB) used pdftotext.

---

### Problem: Source organized by deity, not by month

**What happened**: Deubner organizes content into deity chapters (Athena, Demeter, Dionysus, Zeus…). An agent reading only the "Demeter" chapter misses Demeter-adjacent festivals in other chapters, and can't directly answer "what does Deubner say about Boedromion day 5?"

**Solution**: Phase 2 reindex. A single agent reads all deity-chapter extracts and reorganizes them into a single `by-month.md` keyed by month and day. All Phase 3 agents then read this single file instead of 8 separate ones.

---

### Problem: Context bloat in long-running sessions

**What happened**: Early in the session, a single agent was trying to read multiple PDFs, compare them to the app, and write findings — all in one context. After a few months it had consumed too many tokens to continue reliably.

**Solution**: Never read raw PDF content in the main session. All PDF reading happens inside spawned agents whose tool output stays out of the main context. The main session only reads the structured markdown output files.

---

### Problem: Session model default was haiku

**What happened**: The global `~/.claude/settings.json` had `"model": "haiku"`. Extraction agents using haiku produced shorter, less accurate extracts than sonnet.

**Solution**: Override with `model: "sonnet"` on every Agent call. The quality difference for scholarly extraction and comparison is substantial. Haiku is fine for simple file operations; not for reading dense academic prose.

---

### Problem: Concurrent agent file writes

**What happened (potential)**: If two agents write to the same file, one overwrites the other with no error.

**Solution**: One dedicated output file per agent, named to avoid collisions (source + month). Never assign two agents the same output path.

---

## File naming convention

```
docs/research/
  extracts/
    <source>/
      <month>.md          # Phase 1 output
    review/
      <month>.md          # Phase 3 output
  <review-date>.md        # Phase 4 output (final report)
  REVIEW-PROMPT-<topic>.md  # The original prompt used to launch Phase 3 agents
  METHODOLOGY-research-pipeline.md  # This file
```

---

## Permissions to add before starting

In `~/.claude/settings.json` → `permissions.allow`:

```json
"Bash(pdftotext *)"
```

This is enough for all PDF extraction. No other special permissions needed beyond standard file read/write.

---

## Agent spawn summary (Hellenic review, for reference)

| Phase | Agents | Parallel? | Model |
|---|---|---|---|
| 1 — Parke extraction | 12 (one per month) | Yes | sonnet |
| 1 — Deubner extraction | 8 (one per deity chapter) | Yes | sonnet |
| 1 — Mikalson extraction | 1 (full calendar) | — | sonnet |
| 2 — Deubner reindex | 1 | — | sonnet |
| 3 — Per-month comparison | 12 | Yes | sonnet |
| 4 — Collation | 1 | — | sonnet |
| **Total** | **35** | | |

Total agent-tokens consumed: ~450k across all phases. Wall-clock time: ~3 hours (most of it waiting for parallel batches).

---

## Applying this to Roman calendar data

The Roman review would target `utils/romanCalendarData.ts`. Suggested sources and their roles:

| Role | Source | Format | Offset |
|---|---|---|---|
| Primary festival descriptions | Scullard, *Festivals and Ceremonies of the Roman Republic* (1981) | PDF | TBD |
| Detailed ritual attestation | Fowler, *The Roman Festivals of the Period of the Republic* (1899) | PDF (public domain scan) | TBD |
| Date/day attestation | Michels, *The Calendar of the Roman Republic* (1967) | PDF | TBD |
| Ancient primary source for aitia | Ovid, *Fasti* | freely available text | — |

The Roman calendar is fixed (not lunar), so page-offset errors propagate less. The main complication is that Roman festivals span the Julian calendar year (January–December) rather than 12 named Attic months — the month mapping to `monthIndex` will need to be verified before writing Phase 3 prompts.

---

*This document describes the process as executed in October 2026. Update it if the approach changes for subsequent civilizations.*
