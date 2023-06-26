import { combineFromDirectory } from '../combiner';
import * as scriptCombiner from '../scriptCombiner';
import fs from 'fs';
import path from 'path';
jest.mock('../getVersion', () => ({
    getVersion: jest.fn( () => '1.0.0'),
}));
jest.mock('../scriptCombiner', () => ({
    combineScript: jest.fn(),
}));
const cwdSpy = jest.spyOn(process, 'cwd');
cwdSpy.mockReturnValue('/');
jest.mock('fs', () => ({
    readdirSync: jest.fn((input) => {
        console.log(input)
        if (input.includes('error')){
            return new Error('Failed to read directory');
        } else {
            const mockDirents = [
                { name: 'subdir1', isDirectory: jest.fn(() => true) },
                { name: 'subdir2', isDirectory: jest.fn(() => true) },
                { name: 'file1.txt', isDirectory: jest.fn(() => false) },
            ] as unknown as fs.Dirent[];
            return mockDirents;
        }
    }),
    dirent: jest.fn(),
}));
describe('combineFromDirectory', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should call combineScript for directory in the directory', () => {
        const combineScriptMock = jest.spyOn(scriptCombiner, 'combineScript');
        combineFromDirectory('path/to/directory');
        expect(combineScriptMock).toHaveBeenCalledTimes(2);
        expect(combineScriptMock).toHaveBeenCalledWith(
            '/path/to/directory/subdir1', undefined
        );
        expect(combineScriptMock).toHaveBeenCalledWith(
            '/path/to/directory/subdir2', undefined
        );
    });
    it('should call combineScript for directory in the directory when there is destination path', () => {
        const combineScriptMock = jest.spyOn(scriptCombiner, 'combineScript');
        combineFromDirectory('path/to/directory', 'path/to/destination');
        expect(combineScriptMock).toHaveBeenCalledTimes(2);
        expect(combineScriptMock).toHaveBeenCalledWith(
            '/path/to/directory/subdir1', '/path/to/destination'
        );
        expect(combineScriptMock).toHaveBeenCalledWith(
            '/path/to/directory/subdir2', '/path/to/destination'
        );
    });
});