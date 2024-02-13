import { promises as fs } from 'node:fs'
import path from 'node:path'
import { normalizePath } from 'vite'

async function getFiles(directory: string, pattern: RegExp) {
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
