import { promises as fs } from 'node:fs'

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
