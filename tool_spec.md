# pipette-calibration

Unified ISO 8655 pipette-calibration tool: enter gravimetric readings → environmental-corrected stats
+ pass/fail → printable certificate. Merges the Platinum and Basic apps behind a service-level selector.

## Archetype
`calculator` (calibration certificate generator) — the core is readings-in → computed-cert-out. Session
history (recall past calibrations) is a secondary, tracker-style feature on top, not the dominant shape.
Reverse-engineered from the existing `Platinum-Calibration/index.html`.

## Overview
A calibration technician enters session info + environmental conditions, adds one or more pipettes,
records four gravimetric readings at LOW/MID/HIGH (both **As Found** and **As Left**), and the tool
validates each against ISO 8655 specs in real time and generates a printable certificate. **Scope v1:
pipettes only** (balances, timers, centrifuges, temperature devices deferred to later versions; inventory
+ labels split to a separate tool). Single self-contained `.html`, no server, runs offline from disk or
GitHub Pages; auto-saves so an in-progress session survives a refresh. Used on a bench laptop/tablet; the
certificate must print cleanly.

## Data model
Two persisted objects: the **session** and its **pipettes[]**.

**Session info**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| serviceLevel | enum(platinum, basic) | yes | platinum = full gravimetric + env correction; basic = quick pass/fail |
| technician | string | yes | initials feed the invoice number |
| piName / client | string | yes | last name feeds the work-order number |
| location | string | no | |
| serviceDate / calibrationDate | date | yes | fall back service→calibration→today for auto-numbering |
| workOrder | string (derived) | auto | `LastName MM-DD counter#frequency` (e.g. `Doerksen 12-31 1#A`) |
| invoice | string (derived) | auto | `INITIALS+DAY+MONTH+YEAR+COUNTER+FREQ` (e.g. `TSD31122501A`) |
| temperature | number °C | platinum | env correction input; valid 15–30 (optimal 20–25) |
| pressure | number kPa | platinum | valid 95–105 (optimal 98–102) |
| humidity | number %RH | platinum | valid 30–80 (optimal 40–60) |
| balanceInfo | string | no | traceability reference |

**Pipette** (one per row in `pipettes[]`)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | number | auto | record key |
| serviceLevel | enum(platinum, basic) | yes | inherited from session at add time |
| brandModel | string | yes | combined autocomplete field (100+ brands); model selects the ISO spec table |
| serial | string | yes | duplicate-serial warning |
| channelType | enum(single, multi) | yes | multi expands per-channel readings |
| measurements | object | yes | `asFound`/`asLeft` × `low`/`mid`/`high` × 4 readings (array of 4) |
| statusAsFound / statusAsLeft | enum(pending, pass, fail) | derived | per-condition overall result |

Derived (recomputed, not stored): per test-point `mean`, `SD`, `CV%`, `zFactor`, corrected readings,
`accuracyPass`, `cvPass`, `sdPass`, `precisionPass`, and the per-condition overall status.
The nominal volume for each LOW/MID/HIGH point comes from the selected model's spec table.

**Basic-mode pipette fields** (`serviceLevel='basic'`): `model` (ISO class), `basic.asFoundSpec`
(`''|in|out`, manual), `basic.outOfSpecReason` (enum, **required when `out`**), `basic.reasonNote`,
`basic.adjustments` (object keyed by code → `{on, val, other}`; codes `SE/COR/G/SH/FR` with the value
lists above), `basic.readings100` (4 values), `basic.reading20` (1 value). Overall result derived from
the final readings only. **Top-level `comments`** (free-text) applies to **both** Platinum and Basic.

## Inputs & computations
All formulas captured verbatim from the existing app (ISO 8655-6). `build-tool` makes one JS function per
row.

| Output | Formula | Notes |
|--------|---------|-------|
| mean | `Σreadings / n` | n = 4 per point |
| SD | `sqrt(Σ(x−mean)² / (n−1))` | sample SD per ISO 8655 (changed from the app's population ÷n) |
| CV% | `(SD / mean) × 100` | display/reference only — **not** a pass criterion (see precision pass) |
| water density ρ_w(T) | `999.85308 + 6.32693e-2·T − 8.523829e-3·T² + 6.943248e-5·T³ − 3.821216e-7·T⁴` | kg/m³, valid 15–30°C |
| air density ρ_a | Magnus: `Psat=611.2·exp(17.67T/(T+243.5))`; `Pw=RH·Psat`; `ρ_a=(P−Pw)/(Rd·T_K)+Pw/(Rv·T_K)` | Rd=287.05, Rv=461.495, T_K=T+273.15, P in Pa |
| Z-factor | `(1 − ρ_a/8000) / (1 − ρ_a/ρ_w)` | ρ_weights=8000 kg/m³ (stainless) |
| corrected reading | `raw × Z` | only when temp+pressure+humidity all present; else Z=1, raw used |
| accuracy pass | mean within `[spec.accuracy.from, spec.accuracy.to]` | systematic error per ISO 8655 — **mean-in-range everywhere** (the legacy per-reading cert check is dropped) |
| precision pass | `SD ≤ spec.precision.ul` | **strict ISO** single random-error limit (the legacy `cvPass OR sdPass` is dropped; CV% is display-only) |
| overall point pass | `accuracyPass AND precisionPass` | |
| volume precision | `≤25 µL → 2 decimals/step 0.01; >25 µL → 1 decimal/step 0.1` | display + input step |

**Spec source:** `isoSpecs` (single-channel) and `isoSpecsMulti` (multi), keyed `model → volume →
{accuracy:{from,to}, precision:{percent, ul}}`, looked up via `getSpecifications(model, volume,
isMultiChannel)`. Port these tables verbatim — they are the tolerance database.

**Basic service level (quick check, bench-ordered):** no environmental correction, no precision/SD —
accuracy only, graded against the same `isoSpecs` tables (Basic also picks an ISO model). The card
follows the real bench workflow, in order:
1. **As-Found — In Spec / Out of Spec:** a **manual toggle** the tech sets (the as-found reading volume
   varies pipette-to-pipette, so no fixed as-found reading is stored). When **Out of Spec**, a **reason is
   required**: `Low | High | Leaks | Sticky-Stiff | Broken | Other` + free-text note. This is
   documentation and is **decoupled from** the pass/fail result.
2. **Adjustments** — each a checkbox that reveals a detail control when ticked:
   `SE` Seal → `Has but not replaced | Replaced | Silicone | Other`(+text); `COR` Corrosion → `1|2|3`;
   `G` Grease → `K|D`; `SH` Shaft → `Replaced | Other`(+text); `FR` Friction ring → `Skinny|Regular|Fat`.
3. **Final readings (after calibration):** 100% (`high` volume, 4 readings → mean) + 20% (`low` volume,
   1 reading), each checked within its ISO accuracy range.
4. **Comments / Other:** free-text (damage, observations).

**Overall result = final readings ONLY:** PASS iff both final points are in range; pending until both are
entered. No manual override. The As-Found In/Out call does not affect the result.

## Views & layout
1. **Session card** — service-level selector (badge), technician/client/dates, auto work-order + invoice,
   environmental inputs (with in-range warnings), balance traceability.
2. **Pipette entry** (repeated per pipette) — brand/model autocomplete, serial, single/multi toggle; an
   As Found and an As Left table, each LOW/MID/HIGH row × 4 reading inputs + a live status badge; a live
   per-point calculation panel (readings, Z-factor, accuracy/CV/SD with ✓/✗).
3. **Summary table** — all pipettes, As Found vs As Left status at a glance.
4. **Certificate / Report tab** — the printable ISO certificate (one pipette per page).
5. **Session history** — list + recall past calibrations (secondary tracker view).

## Interactions
- Add / remove / **duplicate** pipette (copy previous config); single↔multi toggle.
- Enter readings → live recompute + pass/fail on every change; re-run all when environmental inputs change.
- **Auto-grade BOTH conditions** — As Found *and* As Left each get their own live evaluation panel + status
  badge (legacy graded both; the first rebuild only did As Left — restore As Found).
- **Basic flow** — manual As-Found In/Out toggle (reason required when Out) first; detailed adjustments
  with per-code sub-fields (SE/COR/G/SH/FR); final 100%(4)+20%(1) readings auto-compute the pass/fail
  result, **decoupled** from the As-Found call. Comments/Other free-text in both modes.
- **Data-quality automation (restore from legacy):**
  - **Outlier highlight** — flag any reading > 2 SD from its point mean.
  - **CV% color coding** — green < 1% / yellow 1–2% / red > 2% (display cue only; not the pass rule).
  - **Duplicate-serial warning** — warn if a serial is entered on more than one pipette in the session.
- Service-level toggle (warns when switching with existing pipettes).
- **Bulk select → mark all Pass/Fail.**
- **Brand/model autocomplete** — 100+ list **+ smart history**: custom brand/model entries saved to
  localStorage and offered next time (restore from legacy).
- **Voice input** — speak the readings, auto-advance; voice commands ("next pipette", "mark pass/fail").
- **Keyboard shortcuts** — Ctrl+N new, Ctrl+D duplicate, Ctrl+S save.
- Import JSON (round-trip a saved session); export CSV; print / save-PDF certificate; save & recall session.

## Persistence & export
- **Persistence:** localStorage, `platinum`-prefixed keys — session autosave (on every change),
  `platinumPipetteTemplates` (saved configs), `platinumDarkMode`, backup-reminder keys. Port the existing
  key strings verbatim so a user's saved data still loads. localStorage is single-device — JSON
  export/import is the cross-machine path.
- **Export:** JSON (full session, re-importable round-trip); formatted CSV (the results sheet).
- **Print:** the certificate, one pipette per page; `@media print` hides the entry chrome/buttons and
  shows the certificate; brand logo in the header.

## Styling & theme
Calibrations International branding (logo.png header), light + **dark mode**. **Colorblind-safe pass/fail
— symbols (✓/✗) plus color, never color alone** (carry over the existing accessibility). Responsive for
tablet/phone bench use; print-optimized certificate on standard paper.

## House patterns to reuse
This tool *is* the house exemplar for calibration patterns — `build-tool` should mirror the existing
`Platinum-Calibration/index.html` directly, and these are also distilled in `references/html-patterns.md`.

| Mechanism | Source pattern |
|-----------|----------------|
| localStorage autosave + restore | existing `index.html` `autoSave()` (key family `platinum*`) |
| JSON export/import round-trip | existing `index.html` `importFromFile()` / export |
| formatted CSV export | existing `index.html` `exportFormattedCSV()` |
| printable ISO certificate | existing `index.html` `printReport()` / `downloadPDF()` |
| brand/model autocomplete (+history) | existing `index.html` autocomplete + `platinumPipetteTemplates` |
| voice input + commands | existing `index.html` Speech API entry |
| live stats / CV% / outlier coloring | existing `index.html` `calculateCV` / `calculateSD` / display |
| colorblind-safe status | existing `index.html` ✓/✗ + color badges |

## Open questions
_All non-blocking. The three math review items are **resolved** and intentionally differ from the legacy
app: sample SD (÷n−1); strict ISO precision (`SD ≤ µL limit`, OR dropped); accuracy on the mean
everywhere. The build follows the spec, not the legacy code, where they differ._
- Balances / timers / centrifuges / temperature-device calibration → **deferred to v2** (data model
  leaves room; not in this build).
- Inventory + labels → **separate tool** (planned next, not here).

## Readiness checklist
- [x] 1. Archetype chosen
- [x] 2. Data model / input fields defined
- [x] 3. Computations & logic defined
- [x] 4. Views & layout sketched
- [x] 5. Persistence & export decided
- [x] 6. House pattern identified for each non-trivial mechanism
