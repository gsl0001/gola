# The Gola help site

One static page — `index.html`. No generator, no build step, no dependencies: it answers
setup and the handful of questions this app actually attracts, and that is all it needs to do.

## Publishing it

The page must end up at **https://gsl0001.github.io/gola/**, because `Config.SiteUrl` points
there and Settings → About links to it.

Do **not** publish this repository. It carries `launch-review/` and `design/`, which hold
competitive and trademark analysis. Publish only the contents of this folder:

```
gh repo create gola --public --description "Gola - a radial launcher for Windows"
cd site && git init && git add . && git commit -m "Help site"
git branch -M main
git remote add origin https://github.com/gsl0001/gola.git
git push -u origin main
```

Then in the new repo: **Settings → Pages → Source: deploy from branch, `main`, `/ (root)`**.
It goes live at the URL above within a minute or two.

## Keeping it honest

The page repeats things that live elsewhere. If any of these change, change it here too:

| Claim on the page | Source of truth |
|---|---|
| default chord, tools, Shelf, dictation behaviour | `README.md` |
| what the app can see, and the model download | `PRIVACY.md` |
| the privacy-policy link | the gist, `0c2ba872f82c192507a5e0ded852b368` |
| support email | `PRIVACY.md` |
