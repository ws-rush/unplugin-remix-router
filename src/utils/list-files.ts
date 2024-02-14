import { promises as fs } from 'node:fs'
import path from 'node:path'
import { normalizePath } from 'vite'

export async function listFiles(directory: string) {
  // Define the patterns for matching files
  const topLevelPattern = /\.tsx$/
  const subdirectoryPattern = /^route(\.lazy)?\.tsx$/

  try {
    const files = await fs.readdir(directory)
    const matchingFiles: string[] = []

    for (const file of files) {
      const filePath = path.join(directory, file)
      const stat = await fs.stat(filePath)

      if (stat.isDirectory()) {
        // If it's a directory, get the files in that directory
        const subdirectoryFiles = await fs.readdir(filePath)
        const subdirectoryFile = subdirectoryFiles.find(subItem => subdirectoryPattern.test(subItem))

        if (!subdirectoryFile)
          continue
        const subFilePath = path.join(filePath, subdirectoryFile)
        matchingFiles.push(normalizePath(subFilePath).replace(normalizePath(`${directory}/`), ''))
      }
      else if (topLevelPattern.test(file)) {
        // If it's a file and matches the pattern, add it to the result
        matchingFiles.push(normalizePath(filePath).replace(normalizePath(`${directory}/`), ''))
      }
    }

    return matchingFiles
  }
  catch (error) {
    console.error('Error:', error)
    throw error
  }
}
