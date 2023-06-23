#!/usr/bin/env npx ts-node
import { cliHelp } from "./constants";
import * as commander from 'commander';
import { extractFromDirectory } from './extractor';
import { combineFromDirectory } from './combiner';
import { getVersion } from "./getVersion";
import * as figlet from 'figlet';

const program = new commander.Command();
console.log(figlet.textSync("APIM Policy"));

program
    .version(getVersion())
    .description("Azure API Management Policy Editing and Debugging Tool")
    .option('-e, --extract <value>', 'Extract the policies in the specified directory')
    .option('-c, --combine <value...>', 'Combine the policies in the specified directory')
    .option("-h, --help", "Output usage information", () => {
        program.outputHelp();
    })
    .addHelpText('after', cliHelp)
    .parse(process.argv);

const options = program.opts();

if (options.extract) {
    console.log(`✅ Extracting policy files from ${options.extract}`);
    extractFromDirectory(options.extract);
}
if (options.combine) {
    const paths = options.combine
    
    if (paths.length > 2) {
        console.error('❌ Error: Too many paths provided for the -c option. Maximum allowed is 2.');
        console.error('ℹ️  Please run the command with the -h | --help option to see the usage information.');
        process.exit(1);
    }

    if (paths.length === 1) {
        console.log(`✅ Combining policy files from ${options.combine[0]} and writing to the same directory`);
        combineFromDirectory(options.combine[0]);
    } else if (paths.length === 2) {
        console.log(`✅ Combining policy files from ${options.combine[0]} and writting to ${options.combine[1]}`);
        combineFromDirectory(options.combine[0], options.combine[1]);
    }
}
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

module.exports = {
    extractor: extractFromDirectory,
    combiner: combineFromDirectory
}
