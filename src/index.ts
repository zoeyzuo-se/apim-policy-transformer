#!/usr/bin/env npx ts-node

import { getVersion } from "./getVersion"
import { Extractor } from './extractor'
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
        
        $ apim-policy-transformer combine ./example.cs ./example.xml ./output/location
  
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
    const policyPath = paths[1]
    const resultLocation = paths[2]
    Extractor(policyPath, resultLocation)
}
// Call the combiner for path and display the result on the console
// paths.forEach((path) => {
//     console.log(`${path}`)
//     console.log(`hi`)
// })