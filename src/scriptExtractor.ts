import * as fs from "fs";
import { separator } from "./constants";
import path = require("path");

// Define RegEx patterns
const blockPattern = /@{((?:[^{}]|{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*})*)}/g;
const inlinePattern = /@\((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*\)/g;
const namedValuePattern = /({{)(.*?)(}})/g;

export function extractScript(directoryPath: string, filename: string) {
    // Read the policy file
    let xmlFile = fs.readFileSync(`${directoryPath}/${filename}`, "utf8");

    // Find all the C# expressions in the policy file as blocks
    const blocks = Array.from(xmlFile.matchAll(blockPattern), (m) => m[1] || m[2]);

    // Find all the C# expressions in the policy file as inline expressions
    const inline = xmlFile.match(inlinePattern)?.map((m) => m.slice(2, -1)) || [];

    // Read the template file
    const template = fs.readFileSync(path.resolve(__dirname, '../src/templates/script.csx'), "utf8");

    // Define the output directory name
    const output = `${path.dirname(directoryPath)}/scripts/${filename.replace(".xml", "")}`;

    // Create the output directory
    fs.mkdirSync(output, { recursive: true });

    // Copy the context class into the output directory
    fs.copyFile(path.resolve(__dirname, '../src/templates/context.csx'), `${output}/context.csx`, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });

    // Copy the context settings into the output directory
    fs.copyFile(path.resolve(__dirname, '../src/templates/context.json'), `${output}/context.json`, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });


    // Write the snippets out as C# scripts
    blocks.forEach((match, index) => {
        let variables = "";
        let found;
        let scriptBody = match;
        while ((found = namedValuePattern.exec(match)) !== null) {
            if (variables === "") {
                variables += `\t// The following named values have been extracted from the script and replaced with variables\r\n\t// Please check the script to ensure the string begins with a $ sign for string interpolation\r\n`;
            }
            const variableName = `nv_${found[2].replace("-", "_").trim()}`;
            if (variables.includes(variableName) === false) {
                variables += `\tstring ${variableName} = ""; // Named Value: ${found[2].trim()}\r\n`;
            }
            
            scriptBody = scriptBody.replace((found[1] + found[2] + found[3]), `{${variableName}}`);
        }
        variables += `\t${separator}\n`;
        const blockTemplate = template.replace("{0}", variables);
        const name = `block-${(index + 1).toString().padStart(3, "0")}`
        xmlFile = xmlFile.replace(match, `${name}`);

        fs.writeFileSync(`${output}/${name}.csx`, blockTemplate.replace('return "{1}";', addDollarSign(scriptBody)));
    });

    // Write the snippets out as C# scripts
    inline.forEach((match, index) => {
        const name = `inline-${(index + 1).toString().padStart(3, "0")}`
        xmlFile = xmlFile.replace(match, `${name}`);
        let variables = "";
        let found;
        let scriptBody = match;

        while ((found = namedValuePattern.exec(match)) !== null) {
            if (variables === "") {
                variables += `\t// The following named values have been extracted from the script and replaced with variables\r\n\t// Please check the script to ensure the string begins with a $ sign for string interpolation\r\n\t// Please put non-policy related code above the separator. e.g named_value strings. Anything below separator would be added to policy file when running combiner\r\n`;
            }
            const variableName = `nv_${found[2].replace("-", "_").trim()}`;
            if (variables.includes(variableName) === false) {
                variables += `\tstring ${variableName} = ""; // Named Value: ${found[2].trim()}\r\n`;
            }
            scriptBody = scriptBody.replace((found[1] + found[2] + found[3]), `{${variableName}}`);
        }
        variables += `\t${separator}\n`;
        const inlineTemplate = template.replace("{0}", variables);

        fs.writeFileSync(`${output}/${name}.csx`, inlineTemplate.replace('"{1}"', scriptBody));
    });

    // Create a new xml file
    fs.writeFile(
        `${output}/replaced.xml`,
        xmlFile,
        (err) => {
            if (err) {
                console.error(err);
            }
        }
    );
}

function addDollarSign(input: string): string {
    const pattern = /("[^"]*\{nv_\w+}[^"]*")/g;
    return input.replace(pattern, (match) => match.replace(/^"/, '$"'));
}
