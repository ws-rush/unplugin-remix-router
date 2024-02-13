import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { isFileExist } from './utils/is-file-exist'
import { listFiles } from './utils/list-files'
import { buildRoutesMap } from './utils/build-route-maps'

export const unpluginFactory: UnpluginFactory<Options | undefined> = options => ({
  name: 'unplugin-remix-router',
  async resolveId(source: string) {
    if (source === 'virtual:routes')
      return source
  },
  async load(id) {
    const appDirectory = options?.appDirectory ? options.appDirectory : './app'

    if (id === 'virtual:routes') {
      const files = await listFiles(`${appDirectory}/routes`)
      let { routesMap, imports } = buildRoutesMap(files, appDirectory)

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
        .replace(/ImportEnd"/g, ')')
        .replace(/"spread":"SpreadStart/g, '...')
        .replace(/SpreadEnd"/g, '')
      // console.log(JSON.stringify(routesObject, null, 2))

      const routesCode = `${imports}\nexport const routes = ${routesObject}`
      return routesCode
    }
  },
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
