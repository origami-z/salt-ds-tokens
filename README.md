Visualize Salt Design System design tokens: https://origami-z.github.io/salt-ds-tokens/.

By default, tokens are loaded from a local copy ([`salt-ds.ts`](https://github.com/origami-z/salt-ds-tokens/blob/main/docs/visualizer/src/controllers/salt-data.ts)). 
Alternatively, different set of data can be loaded from remote URL via URL param `remoteJsonUrl`, e.g. from a PR - Sample [Salt Theme Next token structure](https://origami-z.github.io/salt-ds-tokens/?filter=light%2Cmedium&remoteJsonUrl=https%253A%252F%252Fraw.githubusercontent.com%252Fjpmorganchase%252Fsalt-ds%252Fcae97dfe8b05fb91baef578f8ca04b25315fdc5e%252Fpackages%252Ftheme%252Fjson%252Ftheme.json&token=palette%2Cneutral) from [Salt#3143](https://github.com/jpmorganchase/salt-ds/pull/3143).

Sample 2: https://origami-z.github.io/salt-ds-tokens/?filter=light%2Cmedium&remoteJsonUrl=https%3A%2F%2Fraw.githubusercontent.com%2Fjpmorganchase%2Fsalt-ds%2Frefs%2Fheads%2Ftheme-json-2%2Fpackages%2Ftheme%2Fjson%2Ftheme.json from `theme-json-2` branch

TODO

- [ ] Fonts control use different display name
- [ ] Support `groupKey` shared between different `layerKey`, e.g. text
- [ ] Check node `valueHtml` supports double condition, e.g. accent & mode

---


Note: for [Spectrum 2](https://s2.spectrum.adobe.com/) token data has been graduated to the `main` branch. If you need access to the S1 data, use the [`s1-legacy` branch](https://github.com/adobe/spectrum-tokens/tree/s1-legacy) and `v12.x.x` packages on [NPM](https://www.npmjs.com/package/@adobe/spectrum-tokens?activeTab=versions).

The [Spectrum token visualizer](https://opensource.adobe.com/spectrum-tokens/visualizer/) shows the token data for S1. For Spectrum 2 data, use [opensource.adobe.com/spectrum-tokens/s2-visualizer/](https://opensource.adobe.com/spectrum-tokens/s2-visualizer/).

# Spectrum Tokens Monorepo

This repo uses:

- [pnpm](https://pnpm.io/) for package management
- [moon](https://moonrepo.dev/moon) to manage task running
- [Changesets](https://github.com/changesets/changesets) for automated versioning and releasing
- [Prettier](https://prettier.io/) for code formatting/linting
- [commitlint](https://commitlint.js.org/) and [Convetional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to standardize commit messages
- [husky](https://typicode.github.io/husky/) to automate formatting of committed files and linting of commit messages

Packages in this monorepo:

- [Spectrum Tokens](packages/tokens/) design tokens for Spectrum, Adobe's design system.
- [Spectrum Token Visualizer Tool](docs/visualizer/) a visualizer for inspecting tokens. Published as a [static site](https://opensource.adobe.com/spectrum-tokens/visualizer/), not an NPM package.
- [Spectrum Token Visualizer Tool S2](docs/s2-visualizer/) a version of the visualizer that shows the Spectrum 2 data. Published as a [static site](https://opensource.adobe.com/spectrum-tokens/s2-visualizer/).
- [Spectrum Tokens Docs](docs/site/) a static site to show the component options API and other token data.
- [Spectrum Token Diff Generator](tools/diff-generator/) a library and cli tool that reports changes made between two schema/releases/branches.

## Setup monorepo locally

1. Install pnpm using [this guide](https://pnpm.io/installation).
1. Install dependencies
   ```bash
   pnpm i
   ```

### Build all packages locally

Run build script

```bash
pnpm moon run :build
```

### Run all tests locally

```bash
pnpm moon run :test
```
