#!/usr/bin/env npx ts-node

import { getVersion } from "./getVersion"
import { extractFromDirectory } from './extractor';
import { combineFromDirectory } from './combiner';
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
    console.log(paths)
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
    extractFromDirectory(paths[1]);
}

// Call Combiner
if (paths[0] === 'combine') {
    combineFromDirectory(paths[1]);
}

exports.extractor = function(directoryPath: string) {
    extractFromDirectory(directoryPath);
}

exports.combiner = function(directoryPath: string) {
    combineFromDirectory(directoryPath);
};