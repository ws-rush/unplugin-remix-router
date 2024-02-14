import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { isFileExist } from '../src/utils/is-file-exist'

describe('isFileExist', () => {
  it('should return true for an existing file', async () => {
    const filePath = path.resolve(__dirname, './file-exist.txt')
    const result = await isFileExist(filePath)
    expect(result).toBe(true)
  })

  it('should return false for a non-existing file', async () => {
    const filePath = path.resolve(__dirname, './file-not-exist.txt')
    const result = await isFileExist(filePath)
    expect(result).toBe(false)
  })
})
