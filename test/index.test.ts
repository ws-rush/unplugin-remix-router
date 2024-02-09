// test/index.test.ts
import { describe, expect, it } from 'vitest';
import { isFileExist } from '../src/index'; // Adjust the path based on your actual folder structure

describe('isFileExist', () => {
  it('should return true for an existing file', async () => {
    const filePath = './test-data/existing-file.txt'; // Provide an existing file path
    const result = await isFileExist(filePath);
    expect(result).toBe(true);
  });

  it('should return false for a non-existing file', async () => {
    const filePath = './test-data/non-existing-file.txt'; // Provide a non-existing file path
    const result = await isFileExist(filePath);
    expect(result).toBe(false);
  });

  it('should handle absolute paths for existing files', async () => {
    const filePath = '/absolute/path/to/existing-file.txt'; // Provide an existing absolute file path
    const result = await isFileExist(filePath);
    expect(result).toBe(true);
  });

  it('should handle absolute paths for non-existing files', async () => {
    const filePath = '/absolute/path/to/non-existing-file.txt'; // Provide a non-existing absolute file path
    const result = await isFileExist(filePath);
    expect(result).toBe(false);
  });

  it('should handle relative paths with "../"', async () => {
    const filePath = './test-data/../test-data/existing-file.txt'; // Provide a path with "../"
    const result = await isFileExist(filePath);
    expect(result).toBe(true);
  });

  it('should handle relative paths with "./"', async () => {
    const filePath = './test-data/./existing-file.txt'; // Provide a path with "./"
    const result = await isFileExist(filePath);
    expect(result).toBe(true);
  });

  it('should handle different file types', async () => {
    const txtFilePath = './test-data/existing-file.txt';
    const jsFilePath = './test-data/existing-file.js';
    
    const txtResult = await isFileExist(txtFilePath);
    const jsResult = await isFileExist(jsFilePath);

    expect(txtResult).toBe(true);
    expect(jsResult).toBe(true);
  });

  it('should throw an error for invalid paths', async () => {
    const invalidFilePath = './test-data/invalid-file';

    let error: { code: string } | null = null;
    try {
      await isFileExist(invalidFilePath);
    } catch (err) {
      error = err as { code: string };
    }

    expect(error).not.toBe(null);
    expect(error?.code).toBe('ENOENT'); // Assuming ENOENT is the error code for "File not found"
  });
});
