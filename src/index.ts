import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { ViteDevServer } from 'vite'
import type { Options } from './types'
import { isFileExist } from './utils/is-file-exist'
import { listFiles } from './utils/list-files'
import { buildRoutesMap } from './utils/build-route-maps'

let server: ViteDevServer

function routesCode(imports: string | undefined, routesObject: string) {
  return `
    ${imports}
          
    function moduleFactory(module) {
      const { default: Component, clientLoader: loader, clientAction: action, clientMiddleware: middleware, loader: _loader, action: _action, Component: _Component, middleware: _middleware, unstable_middleware: _unstable_middleware, ...rest } = module;
      return { Component, loader, action, middleware, unstable_middleware: middleware, ...rest };
    }

    export const routes = ${routesObject}
  `
}

export function invalidateVirtualModule(server: ViteDevServer): void {
  const { moduleGraph, ws } = server
  const module = moduleGraph.getModuleById('virtual:routes')
  if (module) {
    moduleGraph.invalidateModule(module)
    if (ws) {
      ws.send({
        type: 'full-reload',
        path: '*',
      })
    }
  }
}

export const unpluginFactory: UnpluginFactory<Options | undefined> = options => ({
  name: 'unplugin-remix-router',
  async resolveId(source: string) {
    if (source === 'virtual:routes')
      return source
  },
  async load(id) {
    const appDirectory = options?.appDirectory ? options.appDirectory : './app'
    const lazyMode = options?.lazy || 'always'

    if (id === 'virtual:routes') {
      const files = await listFiles(`${appDirectory}/routes`)
      let { routesMap, imports } = buildRoutesMap(files, appDirectory, lazyMode)

      // if root file exist add it
      if (await isFileExist(`${appDirectory}/root.lazy.tsx`)) {
        const absolutePath = `${appDirectory}/root.lazy.tsx`
        routesMap = [{
          path: '/',
          lazy: `ImportStart'${absolutePath}'ImportEnd`,
          children: routesMap,
        }]
      }
      else if (await isFileExist(`${appDirectory}/root.tsx`)) {
        const absolutePath = `${appDirectory}/root.tsx`
        imports += `import * as root from '${absolutePath}'\n`
        routesMap = [{
          path: '/',
          spread: `SpreadStartrootSpreadEnd`,
          children: routesMap,
        }]
      }

      const routesObject = JSON.stringify(routesMap)
        .replace(/"ImportStart/g, '() => import(')
        .replace(/ImportEnd"/g, ').then(moduleFactory)')
        .replace(/"spread":"SpreadStart/g, '...moduleFactory(')
        .replace(/SpreadEnd"/g, ')')
      // console.log(JSON.stringify(routesObject, null, 2))

      // eslint-disable-next-line no-console
      console.log(`
        [Warn] You are using unplugin-remix-router v2:

        * you should export Component as default, loader as clientLoader and action as clientAction. 
        see example in https://github.com/ws-rush/unplugin-remix-router#readme
        * \`root.tsx\` file not needed anymore, \`index.html\` and \`take its place\`
      `)

      return routesCode(imports, routesObject)
    }
  },
  vite: {
    configureServer(_server) {
      server = _server
    },
    watchChange(id, change) {
      if (change.event === 'update')
        return
      invalidateVirtualModule(server)
    },
  },
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
