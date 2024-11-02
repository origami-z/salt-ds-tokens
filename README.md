Visualize Salt Design System design tokens: https://origami-z.github.io/salt-ds-tokens/.

By default, tokens are loaded from a local copy ([`salt-ds.ts`](https://github.com/origami-z/salt-ds-tokens/blob/main/docs/visualizer/src/controllers/salt-data.ts)). 
Alternatively, different set of data can be loaded from remote URL via URL param `remoteJsonUrl`, e.g. from a PR - Sample [Salt Theme Next token structure](https://origami-z.github.io/salt-ds-tokens/?filter=light%2Cmedium&remoteJsonUrl=https%253A%252F%252Fraw.githubusercontent.com%252Fjpmorganchase%252Fsalt-ds%252Fcae97dfe8b05fb91baef578f8ca04b25315fdc5e%252Fpackages%252Ftheme%252Fjson%252Ftheme.json&token=palette%2Cneutral) from [Salt#3143](https://github.com/jpmorganchase/salt-ds/pull/3143).

---

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
