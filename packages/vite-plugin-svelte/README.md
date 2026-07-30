# @mrwaip/vite-plugin-svelte

A fork of the official [Svelte](https://svelte.dev) plugin for [Vite](https://vitejs.dev) that compiles Svelte with the experimental Rust compiler [`@mrwaip/svelte-rs`](https://www.npmjs.com/package/@mrwaip/svelte-rs). The plugin API stays compatible with `@sveltejs/vite-plugin-svelte`.

## Installation

There is no stable release yet — every build is published under a dist-tag, so **always install by tag**. Installing without one resolves to `latest`, which is not maintained and points at an old build.

```bash
# Vite 8
npm install --save-dev @mrwaip/vite-plugin-svelte@canary

# Vite 6 / 7
npm install --save-dev @mrwaip/vite-plugin-svelte@vite7
```

| npm tag  | Vite                        | Svelte    | Source branch |
| -------- | --------------------------- | --------- | ------------- |
| `canary` | `^8.0.0-beta.7 \|\| ^8.0.0` | `^5.46.4` | `rust`        |
| `vite7`  | `^6.3.0 \|\| ^7.0.0`        | `^5.46.4` | `rust-vite-7` |

The Rust compiler is an **exactly pinned** peer dependency — this version requires `@mrwaip/svelte-rs@0.0.0-canary.15.1`. pnpm and npm 7+ install it for you; add it explicitly if your package manager does not auto-install peers:

```bash
npm install --save-dev @mrwaip/svelte-rs@0.0.0-canary.15.1
```

## Usage

```js
// vite.config.js
import { defineConfig } from 'vite';
import { svelte } from '@mrwaip/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte({
      // plugin options
    })
  ]
});
```

## Documentation

- [Plugin options](../../docs/config.md)
- [FAQ](../../docs/faq.md)

## License

[MIT](./LICENSE)
