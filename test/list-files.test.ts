import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { listFiles } from '../src/utils/list-files'

describe('listFiles', () => {
  it('should return an empty array for an empty directory', async () => {
    const testDirectory = path.resolve(__dirname, './empty-routes')
    const result = await listFiles(testDirectory)
    expect(result).toEqual([])
  })

  it('should return an array of matching files in the top-level directory', async () => {
    const testDirectory = path.resolve(__dirname, './toplevel-routes')
    const result = await listFiles(testDirectory)
    expect(result).toContain('_auth.lazy.tsx')
  })

  it('should return an array of matching files in the top-level directory not contain `index.ts`', async () => {
    const testDirectory = path.resolve(__dirname, './toplevel-routes')
    const result = await listFiles(testDirectory)
    expect(result).not.toContain('index.ts')
  })

  it('should return an array of matching files in subdirectories with only `route`', async () => {
    const testDirectory = path.resolve(__dirname, './sub-routes')
    const result = await listFiles(testDirectory)
    expect(result).not.toContain('auth.recover/index.tsx')
  })
})
