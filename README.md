[![StandWithPalestine](https://raw.githubusercontent.com/Safouene1/support-palestine-banner/master/StandWithPalestine.svg)](https://stand-with-palestine.org)

# unplugin-remix-router

`unplugin-remix-router` generates a `react-router` file that depends on [remix v2](https://remix.run/docs/en/main/file-conventions/routes) file router convention.

>For more information, please refer to the React Router [documentation](https://reactrouter.com/en/main). Note that it follows the Remix file convention.

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

### Init

```js
// main.tsx
import { routes } from 'virtual:routes'

export const router = createBrowserRouter(routes)
createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

### Project Structure

for deep understanding how filebased routing work, see examples in remix v2 [file router convention](https://remix.run/docs/en/main/file-conventions/routes)

```sh
- app/
  - routes/
    - _index.tsx
    - about.tsx
    - countries.tsx # layout
    - countries.yemen/route.tsx
    - countries.wusab/route.tsx
  - main.tsx # `index.html` and `main.jsx` are the project starter point
```

### Route Content

every route can export one of following, see [React Router](https://reactrouter.com/en/main) for more.

use example in `playground/` as starter kit, or [reactive](https://github.com/ws-rush/reactive) template.

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

## Feauters

### Lazy routes

By default, Vite and other JavaScript bundlers package all project files into a single file. While this is often beneficial, it can result in slower initial load times for the project. To address this, you can implement lazy loading for routes, allowing the bundler to split the code for each route into separate files. This approach can improve the performance of the initial load.

To implement this, simply add .lazy to route names (note: this applies only to routes, not components). Consequently, the project structure will look like this:

```sh
- app/
  - routes/
    - _index.tsx
    - about.lazy.tsx # lazy route, will not included in main project file
    - countries.tsx
    - countries.yemen/route.tsx
    - countries.wusab/route.lazy.tsx # also lazy route, will not included in main project file
  - main.tsx
```

### Access router methods globally

Most React Router commands are accessed through hooks, such as `const navigate = useNavigate()`. However, there are times when you need to access these functions within state manager actions. By defining a global router in main.jsx, you can access many of these functions from anywhere in your application. Here’s how you can do it:

```js
// main.jsx
import { createBrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

export const router = createBrowser(/* ... */)
createRoot(/* ... */)

// Now you can import `router` from any file and use its methods
// For example, to navigate programmatically:
router.navigate('/login')
```