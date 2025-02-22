import type { Route } from '../types'

export function buildRoutesMap(strings: string[], appDirectory: string, lazyMode: 'always' | 'suffix' = 'suffix', level = 0) {
  const result: Route[] = []
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

    const newNode: Route = {}

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

    // Handle lazy loading based on lazyMode
    if (lazyMode === 'always' && page) {
      // In 'always' mode, make all pages lazy regardless of .lazy suffix
      const absolutePath = `${appDirectory}/routes/${page}`
      newNode.lazy = `ImportStart'${absolutePath}'ImportEnd`
    }
    else if (lazyPage) {
      // In 'suffix' mode or if the page is explicitly lazy
      const absolutePath = `${appDirectory}/routes/${lazyPage}`
      newNode.lazy = `ImportStart'${absolutePath}'ImportEnd`
    }
    else if (page) {
      // Regular eager loading for non-lazy pages in 'suffix' mode
      const random = Math.floor(Math.random() * 100000 + 1)
      const absolutePath = `${appDirectory}/routes/${page}`
      intenalImports += `import * as route${random} from '${absolutePath}'\n`
      newNode.spread = `SpreadStartroute${random}SpreadEnd`
    }

    const { routesMap, imports } = buildRoutesMap(filteredStrings, appDirectory, lazyMode, level + 1)
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
