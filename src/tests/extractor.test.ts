import path from 'path';
import { extractFromDirectory } from '../extractor';
import * as scriptExtractor from '../scriptExtractor';

jest.mock('../getVersion', () => ({
    getVersion: jest.fn( () => '1.0.0'),
}));

jest.mock('../scriptExtractor', () => ({
    extractScript: jest.fn(),
}));

jest.mock('fs', () => ({
    readdir: jest.fn((input, callback) => {
        if (input.includes('error')){
            const error = new Error('Failed to read directory');
            callback(error, null);
        } else {
            callback(null, ['file1.xml', 'file2.txt', 'file3.xml']);
        }
    }),
}));
describe('extractFromDirectory', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call extractScript for each XML file in the directory', () => {
        const extractScriptMock = jest.spyOn(scriptExtractor, 'extractScript');
        extractFromDirectory('path/to/directory');
   
        expect(extractScriptMock).toHaveBeenCalledTimes(2); // Two XML files in the mockFiles array
        expect(extractScriptMock).toHaveBeenCalledWith(
            path.resolve('path/to/directory'),
            'file1.xml'
        );
        expect(extractScriptMock).toHaveBeenCalledWith(
            path.resolve('path/to/directory'),
            'file3.xml'
        );
    });

    it('should handle errors when reading the directory', () => {
        const consoleError = jest.spyOn(console, "error").mockImplementation();
        expect(() => {
            extractFromDirectory('path/to/error/directory');
        }).toThrow("Failed to read directory");
        expect(consoleError).toHaveBeenCalledWith("Error reading directory: Error: Failed to read directory");
    });
});