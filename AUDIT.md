# mac-launch audit (2026-10-29)

Scope: `index.html`, `mac/`, `buy/`, `styles.css`, `check-placeholders.js` on `mac-launch` (cc447ad).
Served locally with `python -m http.server` and checked in a browser at 375px, 800px and 1280px.

## Fixed

- **Canonical links.** `index.html` and `mac/index.html` had `og:url` but no `<link rel="canonical">`. Added, matching `og:url`.
- **/buy/ viewport.** The redirect page had no viewport meta, so its fallback link rendered at desktop scale on phones. Added.

No copy, prices or claims were changed.

## Checked and fine

- **Internal links and assets.** Every `href`, `src` and `#anchor` on all three pages resolves. There are no console errors.
- **/buy/ redirect.** `/buy/` lands on `/mac/#buy`. The relative path also works under the `/gola/` Pages prefix, and its canonical points to `/mac/`.
- **375px layout.** Neither page scrolls horizontally, and nothing overflows the viewport.
- **Contrast.** `--ink-dim` on the grounds measures 9.2–9.6:1, `--ink-faint` 5.5:1, blush 14:1 and the pill 16.6:1. All of them pass WCAG AA.
- **Headings.** Each page has one `h1` and then `h2`s. Sections are labelled.
- **Images.** All images have alt text. The theme tiles use `alt=""` because a visible label sits next to each one.
- **Focus and skip link.** The skip link works, and `:focus-visible` gives a blush outline that shows on every control.
- **Page weight.** `/mac/` is about 25 KB of HTML and CSS, plus Google Fonts and GoatCounter. `/` is about 37 KB, plus the 64 KB hero poster, the 320 KB hero loop and about 210 KB of lazy-loaded WebP images.

## `node check-placeholders.js`

It exits 1 with `mac/index.html: still contains LEMON_SQUEEZY_CHECKOUT_URL`. That is the expected result until the checkout exists, and the guard is doing its job.

## Needs your decision

1. **The Download button has nothing to download.** `github.com/gsl0001/gola-mac-releases` is public but has **0 releases**, so `/releases/latest` redirects to an empty releases page. Publish a release before merging, or point the buttons somewhere else. `check-placeholders.js` does not catch this.
2. **The Lemon Squeezy checkout URL** is still the placeholder (see above).
3. **The Mac hero leaves its right column empty above 860px.** The shared `.hero-in` grid reserves 1.2fr for footage, and the Mac page has none. Either add a Mac screenshot or recording (none is in `assets/`), or make the hero single-column on this page. This is a design call, so I left it alone.
4. **The OpenGraph image on `/mac/`** reuses the Windows `og.jpg`. A Mac-specific card would need a new image.
5. **Unused assets.** `assets/v107/gola-film*.mp4` (about 3 MB), `gola-film*.jpg`, `wheel.webp` and `tools-fan.webp` are not referenced by any page. They only add repo weight, not page weight. Delete them or keep them.
6. **Under 860px the top nav (Buy / Questions / Windows) is hidden**, the same as on the main page. On `/mac/` that removes the only header link back to the Windows page, although the footer still has one. This is probably fine.
