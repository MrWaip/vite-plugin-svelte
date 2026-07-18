# @mrwaip/vite-plugin-svelte

A fork of the official [Svelte](https://svelte.dev) plugin for [Vite](https://vitejs.dev) that compiles Svelte with the experimental Rust compiler [`@mrwaip/svelte-rs`](https://www.npmjs.com/package/@mrwaip/svelte-rs). The plugin API stays compatible with `@sveltejs/vite-plugin-svelte`.

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
