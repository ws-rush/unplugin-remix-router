# unplugin-remix-router

`unplugin-remix-router` generates a `react-router` file that depends on [remix v2](https://remix.run/docs/en/main/file-conventions/routes) file router convention, see [reactive](https://github.com/ws-rush/reactive) template

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

## Usage

### Init

```js
import { routes } from 'virtual:routes'

const router = createBrowserRouter(routes)
createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

### Route Content

every route can export one of following, see [react-router](https://reactrouter.com/en/main) for more:

```js
export const id = 'main-page'

export async function loader() {}

export async function action() {}

export function Component() {
  return <h1>Hello Remix Router!</h1>
}

export function ErrorBoundry() {
  return <h1>Sorry for this error</h1>
}

export const handler = {
  attachedData: {
    key: 'value'
  }
}
```

### Lazy Routes

we can make lazy routes by adding `.lazy` to route file.

```sh
- app/
  - routes/
    - _index.tsx
    - about.lazy.tsx # lazy route
  - root.tsx
```

## Typescript

add following to `vite-env.d.ts`

```ts
declare module 'virtual:routes' {
  export const routes: any // Adjust the type accordingly based on your routes structure
}
```
