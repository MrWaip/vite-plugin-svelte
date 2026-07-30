# @mrwaip/vite-plugin-svelte (Vite 6 / 7)

[![npm vite7](https://img.shields.io/npm/v/@mrwaip/vite-plugin-svelte/vite7?label=vite7)](https://www.npmjs.com/package/@mrwaip/vite-plugin-svelte/v/vite7)
[![npm canary](https://img.shields.io/npm/v/@mrwaip/vite-plugin-svelte/canary?label=canary)](https://www.npmjs.com/package/@mrwaip/vite-plugin-svelte/v/canary)
[![CI](https://github.com/MrWaip/vite-plugin-svelte/actions/workflows/ci.yml/badge.svg?branch=rust-vite-7)](https://github.com/MrWaip/vite-plugin-svelte/actions/workflows/ci.yml?query=branch%3Arust-vite-7)
[![Chat](https://img.shields.io/discord/457912077277855764?label=chat&logo=discord)](https://svelte.dev/chat)

A fork of the official [Svelte](https://svelte.dev) plugin for [Vite](https://vitejs.dev) that routes all Svelte compilation through the experimental Rust compiler [`@mrwaip/svelte-rs`](https://www.npmjs.com/package/@mrwaip/svelte-rs). The plugin API stays compatible with `@sveltejs/vite-plugin-svelte`.

**This branch is the Vite 6 / 7 line.** For Vite 8 use the [`rust`](https://github.com/MrWaip/vite-plugin-svelte/tree/rust) branch and the `canary` tag.

## Installation

There is no stable release yet — every build is published under a dist-tag, so **always install by tag**. Installing without one resolves to `latest`, which is not maintained and points at an old build.

```bash
# Vite 6 / 7 (this branch)
npm install --save-dev @mrwaip/vite-plugin-svelte@vite7

# Vite 8 (branch `rust`)
npm install --save-dev @mrwaip/vite-plugin-svelte@canary
```

| Branch                                                                         | npm tag  | Vite                        | Svelte    |
| ------------------------------------------------------------------------------ | -------- | --------------------------- | --------- |
| [`rust-vite-7`](https://github.com/MrWaip/vite-plugin-svelte/tree/rust-vite-7) | `vite7`  | `^6.3.0 \|\| ^7.0.0`        | `^5.46.4` |
| [`rust`](https://github.com/MrWaip/vite-plugin-svelte/tree/rust)               | `canary` | `^8.0.0-beta.7 \|\| ^8.0.0` | `^5.46.4` |

The Rust compiler is an **exactly pinned** peer dependency — this branch requires `@mrwaip/svelte-rs@0.0.0-canary.15.1`. pnpm and npm 7+ install it for you; add it explicitly if your package manager does not auto-install peers:

```bash
npm install --save-dev @mrwaip/svelte-rs@0.0.0-canary.15.1
```

When upgrading the plugin, read the pinned version out of its `peerDependencies` rather than assuming — the pin moves with each compiler release:

```bash
npm view @mrwaip/vite-plugin-svelte@vite7 peerDependencies
```

## Usage

```js
// vite.config.js
import { defineConfig } from 'vite';
import { svelte } from '@mrwaip/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte({
      /* plugin options */
    })
  ]
});
```

## Documentation

- [Plugin options](./docs/config.md)
- [Svelte Inspector](./docs/inspector.md)
- [FAQ](./docs/faq.md)

## Packages

| Package                                                                         | Changelog                                                       |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [@mrwaip/vite-plugin-svelte](packages/vite-plugin-svelte)                       | [Changelog](packages/vite-plugin-svelte/CHANGELOG.md)           |
| [@sveltejs/vite-plugin-svelte-inspector](packages/vite-plugin-svelte-inspector) | [Changelog](packages/vite-plugin-svelte-inspector/CHANGELOG.md) |

## Got a question? / Need help?

Join the [Svelte Discord server](https://svelte.dev/chat)!

## Development

All scripts work from monorepo-root.
The plugins are unbundled esm, a build step is not required while developing locally, but restarting local dev-servers can be needed to apply changes.

- `pnpm i` to install dependencies
- `pnpm playwright install chromium` to install required playwright browser binaries via local playwright-core

  > **NOTE**
  > This repo uses `playwright-core` with a bin alias to `playwright` via package.json script
  > Calling `pnpm dlx playwright install chromium` will not work.

- `pnpm check` and `pnpm:test` to validate changes
- `pnpm format` to format source code
- `pnpm test:unit`, `pnpm test:serve` or `pnpm test:build` to run a subset of tests
- `pnpm test <e2e-directory-name>` to focus a specific testsuite
- `pnpm changeset` to generate a changeset
- `pnpm generate:types` to generate public types from jsdoc (this is required when changing types and validated in ci)

## Credits

- [Svelte](https://svelte.dev) and [Vite](https://github.com/vitejs/vite#readme) creators, maintainers and contributors
- [rixo](https://github.com/rixo) - without svelte-hmr and your support this would not have been possible
- [intrnl](https://github.com/intrnl) - initial inspiration from https://github.com/intrnl/vite-plugin-svelte

## License

[MIT](./LICENSE)
