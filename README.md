[![StandWithPalestine](https://raw.githubusercontent.com/Safouene1/support-palestine-banner/master/StandWithPalestine.svg)](https://stand-with-palestine.org)

# unplugin-remix-router

`unplugin-remix-router` generates a `react-router` file that depends on [remix v2](https://remix.run/docs/en/main/file-conventions/routes) file router convention, see [reactive](https://github.com/ws-rush/reactive) template

>For more information, please refer to the React Router [documentation](https://reactrouter.com/en/main). Note that it follows the Remix file convention.

>**Important**
although react-router use names `loader`, `action`, `Component` these parts should exported from file as `clientLoader`, `clientAction`, `default`, see example below. use these name for future react-router releases.

## Install

```bash
pnpm i -D unplugin-remix-router
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import remixRouter from 'unplugin-remix-router/vite'

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

### Project Structure

we can make lazy routes by adding `.lazy` to route file.

```sh
- app/
  - routes/
    - _index.tsx
    - about.lazy.tsx # lazy route
    - countries.tsx # layout
    - countries.yemen/route.tsx
    - countries.wusab/route.lazy.tsx # also lazy route
  - root.tsx # layout, every layout should use <Outlet >
  - main.tsx # init route, see #Init
```

### Init

```js
// main.tsx
import { routes } from 'virtual:routes'

const router = createBrowserRouter(routes)
createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

### Route Content

every route can export one of following, see [React Router](https://reactrouter.com/en/main) for more:

```js
export const caseSensitive = false

export const id = 'main-page'

// every `loader` should exported by name `clientLoader` from v2
export async function clientLoader() {}

// every `action` should exported by name `clientAction` from v2
export async function clientAction() {}

// every component should exported as `default` no matter what is the name from v2
export default function Component() {
  return <h1>Hello Remix Router!</h1>
}

export function ErrorBoundry() {
  return <h1>Something went wrong</h1>
}

export function shouldRevalidate({ currentUrl }) {
  return currentUrl.pathname === '/meal-plans/new'
}

export const handler = {
  attachedData: {
    key: 'value'
  }
}
```

## Typescript

add following to `vite-env.d.ts`

```ts
declare module 'virtual:routes' {
  export const routes: any // Adjust the type accordingly based on your routes structure
}
```
