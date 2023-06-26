import * as fs from 'fs';
import path from 'path';
import {combineScript} from './scriptCombiner';

export const combineFromDirectory = async (directoryPath: string, destinationPath?: string) => {
    const projectRoot = process.cwd();
    let directoryPathResolved = path.resolve(projectRoot, directoryPath);
    let destinationPathResolved = destinationPath ? path.resolve(projectRoot, destinationPath) : undefined;
    directoryPathResolved = directoryPathResolved.endsWith('/') ? directoryPathResolved.slice(0, -1) : directoryPathResolved
    destinationPathResolved = destinationPathResolved?.endsWith('/') ? destinationPathResolved.slice(0, -1) : destinationPathResolved
    // Read subdir names to an array
    const subdirs = fs
        .readdirSync(directoryPathResolved, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    // Iterate thru subdirs
    subdirs.forEach(async (subdir) => {
        const subdirPath = `${directoryPathResolved}/${subdir}`;
        await combineScript(subdirPath, destinationPathResolved);
    });
};