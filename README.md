# The Gola help site

One static page — `index.html`. No generator, no build step, no dependencies: it answers
setup and the handful of questions this app actually attracts, and that is all it needs to do.

## Published at

**https://gsl0001.github.io/gola/** — repo `gsl0001/gola`, Pages serving `main` at root.
`Config.SiteUrl` points there and Settings → About links to it, so the URL is fixed.

Do **not** publish this repository. It carries `launch-review/` and `design/`, which hold
competitive and trademark analysis. Only this folder's contents are public.

To update the live site, copy the changed files across and push:

```
cp site/index.html site/README.md <clone of gsl0001/gola>/
cd <clone> && git commit -am "Update help site" && git push
```

Pages rebuilds in a minute or so.

## Keeping it honest

The page repeats things that live elsewhere. If any of these change, change it here too:

| Claim on the page | Source of truth |
|---|---|
| default chord, tools, Shelf, dictation behaviour | `README.md` |
| what the app can see, and the model download | `PRIVACY.md` |
| the privacy-policy link | the gist, `0c2ba872f82c192507a5e0ded852b368` |
| support email | `PRIVACY.md` |
