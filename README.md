# Karthik Portfolio

Karthik Sreenivasan's interactive portfolio, built with React and hosted entirely on GitHub Pages.

## Website

https://yakuza1011011.github.io/karthik-portfolio/

## Build locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run build
```

The static website is generated in `dist/`. Serve that directory with any static web server. Images and fonts are bundled into the page, so it works under the GitHub Pages repository path without an asset-base configuration.

## Deployment

Every push to `main` builds and publishes the site with GitHub Actions. In repository Settings → Pages, the publishing source is GitHub Actions. No external hosting account, runtime server, database, or deployment secret is required.

## Features

- Animated introduction and responsive About section
- Expandable Skills menus
- Three static, flippable project cards with external project links
- Contact links and a smooth return to the About page
- Responsive phone, tablet, and desktop layouts
- Reduced-motion handling in the animation components

## Stack and credits

React, Motion, GSAP, React Icons, and esbuild. Components are adapted from React Bits; TextPressure retains its source attribution. Bundled font licences are in `src/fonts/`. Portraits, project artwork, and portfolio content are included for this portfolio.
