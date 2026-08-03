# Gola — site

The help and landing page for **Gola**, a radial launcher for Windows 10 and 11.

Live at **https://gsl0001.github.io/gola/** — GitHub Pages, serving `main` at root.

One static page. No generator, no build step, no dependencies:

```
index.html    the page
styles.css    the design system
app.js        interactive wheel, clip lightbox, FAQ, waitlist
assets/       clips, posters, screenshots, trailer, favicon
```

Open `index.html` in a browser to work on it. Anything pushed to `main` is live in a minute or so.

Clips are versioned by filename (`window-fanout-2.mp4`). GitHub Pages gives no control over
cache headers, so a corrected clip must get a new name — overwriting one in place leaves every
returning visitor on the old file.

## Contact

Questions or bugs: <gsl456789@gmail.com> ·
[Privacy policy](https://gist.github.com/gsl0001/0c2ba872f82c192507a5e0ded852b368)
