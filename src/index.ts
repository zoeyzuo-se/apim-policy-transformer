#!/usr/bin/env npx ts-node

import { getVersion } from "./getVersion"
import { extract } from './extractor';
import { combine } from './combiner';
import * as fs from "fs";
/**
 *  return the arguments of the command except node and index.ts
 */
const getArgs = () => {
    // We retrieve all the command argumnts except the first 3
    const args = process.argv.slice(2)
    return args
}


/**
 * Command Help
 */
const printCommandHelp = () => {
    const version = getVersion()
    const help = `
        apim-policy-transformer (version: ${version})
        
        A simple command to combine or split Azure policy XML file.
        
        Example:
        
        $ apim-policy-transformer extract path/to/policyDir
  
        `
    console.log(help)
  }

const paths = getArgs()

// Print help if no arguments
if (paths.length <= 1) {
    printCommandHelp()
    process.exit(0)
}

// Call extractor
if (paths[0] === 'extract') {
    let policyDir = paths[1]
    policyDir = policyDir.endsWith('/')? policyDir.slice(0, -1) : policyDir
    // Read all files in the directory
    fs.readdir(policyDir, (err, files) => {
        // Handle errors
        if (err) {
            console.log(`Error reading directory: ${err}`);
            return;
        }
        // Process each file
        files.forEach((file) => {
            if (file.endsWith(".xml") === true) {
                extract(policyDir, file);
            }
        });
    });
}

// Call Combiner
if (paths[0] === 'combine') {
    let scriptsDir = paths[1]
    scriptsDir = scriptsDir.endsWith('/') ? scriptsDir.slice(0, -1) : scriptsDir

    // Read subdir names to an array
    const subdirs = fs
        .readdirSync(scriptsDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    // Iterate thru subdirs
    subdirs.forEach((subdir) => {
        const subdirPath = `${scriptsDir}/${subdir}`;
        combine(subdirPath);
    });

}