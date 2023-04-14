// #!/usr/bin/env npx ts-node
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
    .option('-c, --combine <value>', 'Combine the policies in the specified directory')
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
    console.log(`✅ Combining policy files from ${options.combine}`);
    combineFromDirectory(options.combine);
}
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

module.exports = {
    extractor: extractFromDirectory,
    combiner: combineFromDirectory
}
