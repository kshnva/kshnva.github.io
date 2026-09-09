# kshnva.github.io

Personal portfolio site — [kshnva.github.io](https://kshnva.github.io).

Plain HTML, CSS and JavaScript with no build step.

```
index.html   page content
style.css    styling (light/dark via prefers-color-scheme)
script.js    project slider, filters, mobile nav
assets/      favicon, photo
cv/          CV PDF
```

## Updating

- **Projects** — edit the `<li class="card">` blocks in `index.html`. Each card has a `data-cat` of `sim`, `ml` or `finance` for the filter buttons.
- **Photo** — save a square image as `assets/photo.jpg` and remove the `hidden` attribute from `<figure class="hero-photo">`.
- **CV** — replace `cv/Kushnava_Singha_CV.pdf`.

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.
