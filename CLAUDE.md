# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is **not a software project** — it's the teaching material repository for the
"Teledetección" (Remote Sensing) graduate course at Universidad del Magdalena
(Maestría en Ingeniería), taught by Miguel Ángel Polo Castañeda. It contains
slide-generation prompts, Jupyter notebooks, Google Earth Engine (GEE) scripts,
SNAP lab guides, and research-paper analysis scripts, all built around one
recurring study area: the **Sierra Nevada de Santa Marta (SNSM)** and the
**Ciénaga Grande / Magdalena department** in the Colombian Caribbean, tracking
the café → cacao land-cover transition (2000–2025).

Most "commands" in this repo are conceptual (run this cell in Colab, click
this button in SNAP) rather than CI/build commands. There is no test suite,
linter config, or build pipeline — treat this as an editorial/content
repository, not an application codebase.

## Environment setup (Python side only)

Dependencies are managed with `uv` (there's a `uv.lock`) and mirrored in
`requirements.txt` for plain pip:

```bash
uv sync                        # preferred
# or
python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
```

Key libraries: `earthengine-api` + `geemap` (GEE from Python), `rasterio` +
`geopandas` + `shapely` (raster/vector geodata), `pymannkendall` (trend
analysis), `scikit-learn`/`xgboost` (classification). Python is only used for
`code/*.py` (research scripts) and locally-run notebooks — the `colab/*.ipynb`
notebooks are designed to run in Google Colab with `!pip install geemap` in
their first cell, not against this venv.

Running a research script:
```bash
cd code
python3 02_analisis_mann_kendall.py   # reads datos/, writes CSV + PNG back to datos/resultados/
```

## Repository structure and how the pieces relate

```
sesiones/sesion-0N/     — one folder per course session (N = 1..4, weekends July-Aug 2026)
articulos/               — write-ups of the 4 research papers the course is built around
code/                    — standalone GEE+Python pipeline for Artículo 1 (NDVI trend analysis)
datos/                   — shared datasets (DEM, shapefiles, sample Sentinel-2 .SAFE products)
referencia/              — prior instructor's (Dra. Claudia Imbett) original notebooks — read-only inspiration, not maintained
00-Curso/                — the master syllabus (docx) driving session-by-session pacing
```

### Session folder anatomy (`sesiones/sesion-0N/`)

Each session folder follows the same internal pattern — understanding it once
lets you navigate any session:

- **`README.md`** — the operational, day-of schedule (block-by-block timing,
  which notebook/script goes with which block). This is the source of truth
  for "what happens when" — always check it before changing a schedule or
  adding a new activity.
- **`clase{N}_base_conocimiento.md`** — the instructor's private reference doc:
  analogies to use, exact numbers to cite, FAQ answers. Denser and more
  complete than the README.
- **`prompts/0N.md`** — the *original* prompts once fed to NotebookLM to
  generate the slide decks in `teoria/`. They are historical source-of-truth
  for what each slide block is supposed to teach, but the slides already
  exist as PDFs — editing a prompt file does **not** regenerate the deck. Only
  edit these to fix factual errors for future re-generation (see the 2015→2018
  Sentinel-2-launch-date correction already applied across Session 2 as a
  precedent).
- **`teoria/`** — the finished slide decks (PDF), one per block.
- **`colab/`** — notebooks **students run themselves**, hands-on, individually.
- **`gee/`** — GEE Code Editor scripts that are usually a JS port of a student
  Colab notebook (an alternative entry point for students who prefer the
  browser IDE over Python).
- **`docente/`** (session 2 onward) — demos **only the instructor runs and
  projects** during lecture blocks (not something students execute live).
  Each docente demo exists in a matched pair: `docente/gee/0N_x.js` +
  `docente/colab/0N_x.ipynb`, same logic, same study area, same narrative —
  keep both in sync if you edit one. `docente/COMO_DESCARGAR_DATOS_COPERNICUS.md`
  is the step-by-step for the instructor to fetch source imagery before class.
- **`snap/guia_snap_paso_a_paso.md`** (session 2) — a SNAP (ESA desktop tool)
  lab guide that students replicate step-by-step on their own machines during
  class, using imagery the instructor distributes via USB beforehand (SNAP
  needs local `.SAFE` files, not a live Copernicus connection in the room).

### The two-tier lab model (important, easy to get wrong)

This course draws a hard line between two categories of hands-on material —
when adding new labs, always decide which tier a new asset belongs to and
label it accordingly in the session README:

1. **Instructor demo, students replicate live** — SNAP guide steps, and any
   `docente/gee` + `docente/colab` pair. The instructor projects it, explains
   analogies while running it, and students follow along on their own
   machines/data. Time-boxed loosely; falling behind the group is fine.
2. **Student does it solo** — the numbered `colab/0N_*.ipynb` notebooks,
   worked through individually with the instructor circulating for questions.

Session 1 is the exception: it is **100% conceptual for students** (no
hands-on lab at all — that starts in Session 2). The `docente/` demo pattern
still applies there (`sesiones/sesion-01/gee/0N_*.js` are instructor-only
demos run during lecture blocks), it's just that Session 1 has no `colab/`
student notebooks and no `docente/` subfolder split (everything instructor-run
lives directly under `gee/`).

### Data conventions used throughout

- **Study area (cacao zone):** `ee.Geometry.Rectangle([-74.2, 10.5, -73.8, 11.0])`
  — Ciénaga/Fundación, Magdalena. Reused verbatim across almost every GEE
  script and notebook in sessions 1–3; keep new demos consistent with it
  unless there's a specific reason to use a different bbox (e.g. the wider
  `[-74.5, 10.2, -73.2, 11.2]` "norte del Magdalena" box used for
  cloud/optical-vs-SAR comparisons that need more scene variety).
- **Imagery source of truth:** always Sentinel-2 **L2A** (`COPERNICUS/S2_SR_HARMONIZED`
  in GEE) for any quantitative analysis or multi-date comparison; L1C
  (`COPERNICUS/S2_HARMONIZED`) is used *only* deliberately, in the TOA-vs-BOA
  teaching demo, to show why L2A is required.
- **Multitemporal comparison year pair:** 2018 vs. 2024 (dry season,
  Jan–Mar), standardized across all notebooks/scripts. **Never use 2015** as a
  comparison year — Sentinel-2A launched June 23, 2015, so no Jan–Mar 2015
  imagery can exist; this was a real bug found and fixed in the original
  session-2 prompts.
- **Cloud masking:** always via the Sentinel-2 `SCL` (Scene Classification
  Layer) band, excluding classes 3 (cloud shadow), 8 (cloud medium
  probability), 9 (cloud high probability), 10 (cirrus) — this exact
  `scl.neq(3).and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10))` pattern repeats
  in every script that touches L2A data.
- **Spectral indices** (formulas used consistently, Sentinel-2 bands):
  NDVI `(B8-B4)/(B8+B4)`, NDWI `(B8-B11)/(B8+B11)`, NDRE `(B8A-B5)/(B8A+B5)`,
  SAVI `1.5*(B8-B4)/(B8+B4+0.5)`, EVI `2.5*(B8-B4)/(B8+6*B4-7.5*B2+1)`
  (reflectance bands divided by 10000 first), NDMI `(B8A-B11)/(B8A+B11)`,
  CLre `(B7/B5)-1`.
- **GEE script style:** all `.js` files use `var` (not `let`/`const`) and a
  banner-comment header (purpose, author, session, "cómo usarlo en clase"
  instructions) — match this style in any new script rather than introducing
  modern JS syntax, since these are meant to be copy-pasted into the GEE
  Code Editor by the instructor.
- Notebooks authenticate GEE the same way every time: `!pip install geemap
  --quiet` → `ee.Authenticate()` → `ee.Initialize(project='tu-proyecto-gee')`
  — the `'tu-proyecto-gee'` placeholder is intentional, meant to be replaced
  by whoever runs the notebook with their own GEE project ID.

## Editing notebooks

`.ipynb` files must be edited with the notebook-aware edit tool (not raw text
edits) — read the notebook first to get cell IDs, then edit/insert/delete by
cell. When a change to a `colab/0N_*.ipynb` notebook also affects its `gee/`
JS counterpart (or vice versa), update both to keep the docente demo pairs in
sync.
