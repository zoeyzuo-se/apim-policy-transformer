import * as fs from 'fs';
import path from 'path';
import { separator } from './constants';

async function combine(directoryPath: string, destinationPath?: string) {
    const filenames = await getFilenamesInDirectory(directoryPath);

    // Compute the xml filename for storing the result
    const dirArray = directoryPath.split('/')
    const xmlFilename = `${dirArray[dirArray.length - 1]}.xml`

    // Read xmlContent from the generated xmlfile
    let xmlFileContent = fs.readFileSync(`${directoryPath}/replaced.xml`, 'utf8');

    // Get code outside of block-xxx.csx file and inline-xxx.csx file
    filenames.forEach(filename => {
        if ((filename.startsWith('inline') || filename.startsWith('block')) && filename.endsWith('.csx')) {
            let codeSnippet = getCodeInMethod(`${directoryPath}/${filename}`, 'ExtractedScript')
            codeSnippet = refineCode(filename, codeSnippet);
            const xmlPlaceholder = filename.slice(0, -4);
            xmlFileContent = replaceAll(xmlFileContent, xmlPlaceholder, codeSnippet)
        }
        // Write the combined XML to a file
        if (!destinationPath) {
            fs.writeFileSync(`${directoryPath}/${xmlFilename}`, xmlFileContent);
        } else {
            updateFileInDirectory(destinationPath, xmlFilename, xmlFileContent)
                .then(() => {
                    console.log('File update complete.');
                })
                .catch((error) => {
                    console.error('An error occurred while updating the file:', error);
                }); 
        }
    });
}

function refineCode(file: string, codeSnippet: string | null): string {
    if (codeSnippet === null) {
        return '';
    }
    const inlinePrefix = "return "
    if (file.startsWith('inline')) {
        codeSnippet = codeSnippet.trim()
        if (codeSnippet.startsWith(inlinePrefix)) {
            codeSnippet = codeSnippet.substring(inlinePrefix.length).trim() // remove "return " prefix
            return codeSnippet.slice(0, -1) // remove ";" suffix
        }
    }
    if (file.startsWith('block')) {

        const lines = codeSnippet.split('\n').map(line => line);
        const nonEmptyLines = lines.filter(line => line !== '');
        const indentation = nonEmptyLines[0].match(/^\s*/)![0];
        const formattedContent = nonEmptyLines.map((line, index) => {
            if (index === 0 || index === nonEmptyLines.length - 1) {
                return line;
            }
            return `${indentation}${line}`;
        }).join('\n');
        
        return `${formattedContent}`
    }
}

function getFilenamesInDirectory(directoryPath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err);
            } else {
                const filenames: string[] = [];
                files.forEach((file) => {
                    filenames.push(file);
                });
                resolve(filenames);
            }
        });
    });
}

function getCodeInMethod(csxFilePath: string, methodName: string): string | null {
    try {
        // Read the contents of the file at the given path
        const fileContents: string = fs.readFileSync(csxFilePath, 'utf8');

        // Find the starting index of the desired method
        const startRegex = new RegExp(`(?<=\\b(?:public|private|internal)?\\s+(?:async\\s+)?(?:static\\s+)?(?:readonly\\s+)?(?:partial\\s+)?(?:unsafe\\s+)?(?:virtual\\s+)?(?:override\\s+)?\\w+\\s+${methodName}\\s*\\()`);
        const startIndex: number = fileContents.search(startRegex);

        if (startIndex === -1) {
            console.error(`Method '${methodName}' not found in file at path '${csxFilePath}'`);
            return null;
        }

        // Find the ending index of the desired method
        let openBraces = 0;
        let actualStartIndex: number = startIndex;
        let endIndex: number = startIndex;
        for (let i = startIndex; i < fileContents.length; i++) {
            if (fileContents[i] === '{') {
                openBraces++;
                if (openBraces === 1) {
                    actualStartIndex = i;
                }
            } else if (fileContents[i] === '}') {
                openBraces--;
                if (openBraces === 0) {
                    endIndex = i;
                    break;
                }
            }
        }

        // The code within the method
        let codeInMethod: string = fileContents.slice(actualStartIndex, endIndex + 1);
        codeInMethod = removeSurroundingChars(codeInMethod);
        // Remove everything before the generated sepatators
        codeInMethod = removeCodeAboveSeparator(codeInMethod);
        codeInMethod = convertNamedValue(codeInMethod)

        return codeInMethod;
    } catch (error: any) {
        console.error(`Error reading file at path '${csxFilePath}': ${error.message}`);
        return null;
    }
}

function replaceAll(xml: string, toReplace: string, replacement: string): string {
    const regex = new RegExp(toReplace, 'g');
    xml = xml.replace(regex, replacement);
    return xml;
}

function removeSurroundingChars(str: string): string {
    if (str.startsWith('{') && str.endsWith('}')) {
        str = str.slice(1, -1);
    }
    return str;
}

function removeCodeAboveSeparator(input: string): string {
    const separatorIndex = input.indexOf(separator);
    if (separatorIndex === -1) {
        return "";
    }
    return input.substring(separatorIndex + separator.length);
}

function convertNamedValue(input: string): string {
    const regex = /{nv_(\w+)}/g;
    return input.replace(regex, (match, p1) => `{{${p1.replace(/_/g, "-")}}}`);
}

async function updateFileInDirectory(destinationPath: string, fileName: string, content: string): Promise<void> {
    const files = fs.readdirSync(destinationPath);
  
    if (files.includes(fileName)) {
        const filePath = path.join(destinationPath, fileName);
        fs.writeFileSync(filePath, content);
        return;
    }
  
    for (const file of files) {
        const filePath = path.join(destinationPath, file);
        const isDirectory = fs.statSync(filePath).isDirectory();
  
        if (isDirectory) {
            await updateFileInDirectory(filePath, fileName, content);
        }
    }
  
    const rootFilePath = path.join(destinationPath, fileName);
    fs.writeFileSync(rootFilePath, content);
}

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
        await combine(subdirPath, destinationPathResolved);
    });
};