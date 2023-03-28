#!/usr/bin/env npx ts-node

import { getVersion } from "./getVersion"
import { extract } from './extractor';
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
    policyDir = policyDir.endsWith('/')? policyDir : `${policyDir}/`
    console.log(policyDir)
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