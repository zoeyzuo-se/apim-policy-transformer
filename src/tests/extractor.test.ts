import { extractFromDirectory } from '../extractor';
import * as fs from 'fs';

describe('extractFromDirectory', () => {
    it('should extract files in the specified directory', async () => {
        // Create a temporary test directory with sample files and content
        const dirPath = './src/tests/samples';
        const expectedDestinationPath = './src/tests/scripts/example1';
  
        // Call the combineFromDirectory function with the test directory path and destination path
        await extractFromDirectory(dirPath);
  
        // Check if the extract files exists in the destination directory
        const areExtractedFilesExist = fs.existsSync(expectedDestinationPath);
        expect(areExtractedFilesExist).toBe(true);
  
        // Clean up the temporary test directory and files
        deleteTestDirectory(expectedDestinationPath);
    });
});

function deleteTestDirectory(directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.rmSync(directoryPath, { recursive: true });
    }
}