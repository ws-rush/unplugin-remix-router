# unplugin-remix-router

## Install

```bash
pnpm i -D unplugin-remix-router
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import remixRouter from 'unplugin-remixRouter/vite'

export default defineConfig({
  plugins: [
    remixRouter({ /* options */ }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import remixRouter from 'unplugin-remix-router/rollup'

export default {
  plugins: [
    remixRouter({ /* options */ }),
  ],
}
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-remix-router/webpack')({ /* options */ })
  ]
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import remixRouter from 'unplugin-remix-router/esbuild'

build({
  plugins: [remixRouter()],
})
```

<br></details>
