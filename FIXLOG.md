# RuhXam — FIXLOG

**App:** RuhXam by Hasnain Khan (10th app) — RRB NTPC + Group D exam prep
**Package:** `com.ruhxam.app` | **versionName:** "1.0" | **versionCode:** 1
**Source:** `~/workspace/ruhxam/` (www/ + android/) | **Repo (to create):** `Ruhvibes/ruhxam`
**Build date:** 2026-10-11 | **APK:** NOT built by agent — parent builds.

## Content inventory (final)
| Part | Chapters | Format |
|---|---|---|
| भाग 1: गणित Short Tricks | 22 (m01–m22) | concept + 3–5 tricks + 2 examples + 5 MCQs |
| भाग 2: तर्कशक्ति Short Tricks | 17 (r01–r17) | concept + 3–5 tricks + 2 examples + 5 MCQs |
| भाग 3: विज्ञान Quick Revision | 3 (s01–s03) | 3 memory tricks + 15 fact cards + 5 MCQs |
| भाग 4: GK Quick Facts | 6 (g01–g06) | 3 memory tricks + 12 fact cards + 5 MCQs |
| भाग 5: Current Affairs | 3 (c01–c03) | 3 revision tricks + fact cards + 5 MCQs |
| **Total** | **51 chapters** | **255 MCQs** (all with answer + bilingual explanation) |

Every MCQ was math/logic-verified during writing (self-caught bugs fixed: m14 Q2/Q5, m14 ex2, r01 Q5, r07 Q5, r11 Q4, r14 Q4).

## Features (all working, all tested headless)
- 7 tabs: Home (hero, stats, daily trick, continue learning, search, 5 part cards), Study, Practice, Mock, Notes, Progress, Profile
- Chapter view: gradient hero banner + progress ring, concept + SVG diagrams, trick cards (Arihant-style, highlighter), solved examples with green answer box, bookmarks (chapter + trick), TTS (device, offline)
- Practice: chapter-wise + daily (5Q), instant feedback (green glow / red shake), expandable explanations, confetti on 100%
- Mock: NTPC (30M+30R, 60Q) / Group D (25M+30R+15Sci, 70Q), 90-min timer, palette, configurable negative marking (default −1/3), submit confirm, score + review; labeled unofficial
- Notes: create/edit/autosave/search/favorites/delete, export to PDF (print)
- PDF resources: verified official links (RRB, Employment News, NCERT, PIB, India Code, Census)
- Progress: completed chapters, attempted Qs, accuracy, mock history, weak topics (<50%)
- Profile: HI/EN, exam target (NTPC/Group D toggle), dark mode, neg-marking config, CDN update check + version, HF token field, clear data, about
- 16 inline SVG diagram types (geometry, clock, calendar, Venn 2/3, compass, bar/pie charts, number line, mirror, seating circle/row, family tree, India outline, history timeline) — bilingual, dark-mode safe
- Logo: Hasnain's logo.png → launcher icons (mdpi–xxxhdpi, square+round), splash screen, hero + about

## CDN content update system (no new APK needed)
- `cdn/` in repo: `content-version.json` + `maths.json`, `reasoning.json`, `science.json`, `gk.json`, `current-affairs.json`
- `tools/build-cdn.js`: `node tools/build-cdn.js [version]` — validates every chapter (5 MCQs, 2–4 options, valid answer index, explanation present) then writes JSON
- App: on launch (silent) + Settings → "🔄 अपडेट जाँचें" fetches `https://cdn.jsdelivr.net/gh/Ruhvibes/ruhxam@main/cdn/content-version.json`; if newer → downloads, validates, caches in localStorage, toast "✨ नया कंटेंट अपडेट हो गया!"; offline → bundled content, never blocks/errors
- **Hasnain's flow to add a chapter:** edit the JSON (or re-run build-cdn.js), bump `version` in content-version.json, push to repo → installed apps auto-update. Monthly CA refresh works the same way.

## AdMob
- App ID: `ca-app-pub-1457912071506893~7592754757` (manifest meta-data) — **shared with RuhStudy for now**
- Banner unit: `ca-app-pub-1457912071506893/4479331241`, `play-services-ads:23.2.0`
- Child-directed TRUE, max rating G; retry ×5 with backoff; banner on home/study/notes/progress (hidden on quiz/mock via `Android.setAdsVisible` bridge); offline-safe (no fill → stays hidden)
- ⏳ **TODO for Hasnain:** create a dedicated RuhXam App ID in the AdMob console and replace the App ID above (same open item as RuhTools/RuhStudy).

## Design system
- Arihant-style: gradient chapter banners, per-trick accent colors, yellow highlighter marks, green answer boxes, letter-badged MCQ options, section dividers, card entry animations, confetti, animated progress rings/bars; full dark-mode support; 360px-first.

## Known limitations (honest)
- Practice/mock sets are **unofficial** (labeled in-app); not RRB papers
- No account/cloud sync, no leaderboard (blueprint Phase 3–5)
- CA bundled for Aug–Oct 2026; refreshes via CDN monthly
- TTS uses device speech engine (offline); HF token field reserved for future online features
- Question count is exactly 255 — never advertised as thousands

## Test report (headless Chrome, 360px, 40 checks)
**40/40 PASS.** Covers TEST_CHECKLIST.md: home loads, HI/EN toggle, subject→chapter filter, search, chapter detail (concept/tricks/examples/diagrams), correct→green glow + explanation, wrong→red shake + correct answer, completion persists after refresh, bookmark persists, mock score with −1/3 (verified: 5✓ 5✗ → 3.33), progress lists chapters + mock history, notes autosave + print-to-PDF path, dark mode, NTPC/Group D toggle (60Q/70Q pools), science chapter tricks section, TTS button, zero external requests (CDN-only), zero JS errors, CDN-offline fallback intact.
- Note: sandbox proxy blocks cdn.jsdelivr.net (ERR_TUNNEL) — app handles gracefully (bundled content, no crash); treated as expected in tests.
- Full log: `/tmp/rxtest/test.js` (harness, rerunnable).

## Diagrams (18 builders, 10 categories, all <5KB, HI/EN, dark-mode safe)
Geometry (triangle types, circle parts, square/rectangle, angle types), analog clock, calendar grid, Venn 2/3, 8-direction compass, bar chart, pie chart, number line, mirror image, seating circle/row, family tree, India outline, history timeline.
