import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import { normalizePath } from 'vite'
import type { Node, Options } from './types'

export async function isFileExist(filePath: string) {
  try {
    await fs.stat(filePath)
    return true // File exists
  }
  catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT')
      return false // File does not exist
    else
      throw error // Other error occurred
  }
}

export async function getFiles(directory: string, pattern: RegExp) {
  try {
    const files = await fs.readdir(directory)
    let matchingFiles: string[] = []

    for (const file of files) {
      const filePath = path.join(directory, file)
      const stat = await fs.stat(filePath)

      if (stat.isDirectory()) {
        // If it's a directory, get the files in that directory
        const subdirectoryFiles = await fs.readdir(filePath)
        const matchingSubdirectoryFiles = subdirectoryFiles
          .filter(subItem => pattern.test(subItem))
          .map(subItem => path.join(filePath, subItem))

        matchingFiles = matchingFiles.concat(matchingSubdirectoryFiles)
      }
      else if (pattern.test(file)) {
        // If it's a file and matches the pattern, add it to the result
        matchingFiles.push(filePath)
      }
    }

    return matchingFiles
  }
  catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export async function listFiles(baseDirectory: string) {
  // Define the patterns for matching files
  const topLevelPattern = /\.tsx$/
  const subdirectoryPattern = /^route\.tsx$/

  const result = []

  try {
    const topLevelFiles = await getFiles(baseDirectory, topLevelPattern)
    const subdirectoryFiles = await getFiles(baseDirectory, subdirectoryPattern)

    result.push(...topLevelFiles)
    result.push(...subdirectoryFiles)
  }
  catch (error) {
    console.error('Error:', error)
  }

  return result.map(item => normalizePath(item).replace(normalizePath(`${baseDirectory}/`), ''))
}

export function buildRoutesMap(strings: string[], appDirectory: string, level = 0) {
  const result: Node[] = []
  let intenalImports = ''

  const firstSegments = new Set(
    strings
      .map(str => str.split('.')[level].replace('/route', ''))
      .filter(str => str !== undefined && str !== 'tsx' && str !== 'lazy'),
  )

  if (firstSegments.size === 0)
    return { routesMap: result }

  const reversedSegments = Array.from(firstSegments).reverse()

  for (const segment of reversedSegments) {
    const filteredStrings = strings
      .filter(str => str.split('.')[level] === segment || str.split('.')[level] === `${segment}/route`)

    const routePath = segment.replace(/\(([^)]*)\)\??$/, '$1?').replace(/\$+$/, '*').replace(/^\$/, ':')

    if (filteredStrings.length === 0)
      continue

    const newNode: Node = {}

    if (routePath === '_index')
      newNode.index = true
    else if (!routePath.startsWith('_'))
      newNode.path = routePath

    const page = filteredStrings.find(str =>
      str.endsWith(`${segment}.tsx`)
      || str.endsWith(`${segment}/route.tsx`),
    )

    const lazyPage = filteredStrings.find(str =>
      str.endsWith(`${segment}.lazy.tsx`)
      || str.endsWith(`${segment}/route.lazy.tsx`),
    )

    if (lazyPage) {
      const absolutePath = `${appDirectory}/routes/${lazyPage}`
      newNode.lazy = `ImportStart'${absolutePath}'ImportEnd`
    }

    if (page) {
      const random = Math.floor(Math.random() * 100000 + 1)
      const absolutePath = `${appDirectory}/routes/${page}`
      intenalImports += `import * as route${random} from '${absolutePath}'\n`
      newNode.spread = `SpreadStartroute${random}SpreadEnd`
    }

    const { routesMap, imports } = buildRoutesMap(filteredStrings, appDirectory, level + 1)
    if (routesMap.length > 0)
      newNode.children = routesMap
    if (imports)
      intenalImports += imports

    if (segment.endsWith('_')) {
      const slicedSegment = segment.slice(0, -1)
      routesMap.forEach((node) => {
        result.push({ ...node, path: node.index ? slicedSegment : `${slicedSegment}/${node.path}` })
      })
    }
    else {
      result.push(newNode)
    }
  }

  return { routesMap: result, imports: intenalImports }
}

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
      // console.log(files)

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
