# Gola — site

The help and landing page for **Gola**, a radial launcher for Windows 10 and 11.

Live at **https://gsl0001.github.io/gola/** — GitHub Pages, serving `main` at root.

One static page. No generator and no build step:

```
index.html    the page
styles.css    the design system
app.js        interactive wheel, themes, clip lightbox, FAQ, waitlist
assets/       clips, posters, screenshots, trailer, favicon
```

The only external request is the Google Fonts stylesheet for Archivo and IBM Plex Mono. Body
text is set in Segoe UI Variable, which Windows visitors already have, so the page still reads
correctly if that request fails.

Open `index.html` in a browser to work on it. Anything pushed to `main` is live in a minute or so.

Clips are versioned by filename (`window-fanout-2.mp4`). GitHub Pages gives no control over
cache headers, so a corrected clip must get a new name — overwriting one in place leaves every
returning visitor on the old file.

## Contact

Questions or bugs: <gsl456789@gmail.com> ·
[Privacy policy](https://gist.github.com/gsl0001/0c2ba872f82c192507a5e0ded852b368)
