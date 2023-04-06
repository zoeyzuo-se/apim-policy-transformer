import * as fs from 'fs';
import { parseString } from 'xml2js';

async function combine (directoryPath: string) {
  const filenames = await getFilenamesInDirectory(directoryPath);

  // Compute the xml filename for storing the result
  const dirArray = directoryPath.split('/')
  const xmlFilename = `${dirArray[dirArray.length-1]}.xml`

  // Read xmlContent from the generated xmlfile
  let xmlFileContent = fs.readFileSync(`${directoryPath}/replaced.xml`, 'utf8');

  // Get code outside of block-xxx.csx file and inline-xxx.csx file
  filenames.forEach(file => {
      if((file.startsWith('inline') ||file.startsWith('block')) && file.endsWith('.csx')) {
          let codeSnippet = getCodeInMethod(`${directoryPath}/${file}`, 'ExtractedScript')
          codeSnippet = refineCode(file, codeSnippet);
          const xmlPlaceholder = file.slice(0, -4);
          xmlFileContent = replaceAll(xmlFileContent, xmlPlaceholder, codeSnippet)
      }
      // Write the combined XML to a file
      fs.writeFileSync(`${directoryPath}/${xmlFilename}`, xmlFileContent);
  });
    
}
function refineCode(file: string, codeSnippet: string | null): string {
  if(codeSnippet === null) {
      return '';
  }
  const inlinePrefix = "return "
  if(file.startsWith('inline')) {
    codeSnippet = codeSnippet.trim()
    if(codeSnippet.startsWith(inlinePrefix)) {
      return codeSnippet.substring(inlinePrefix.length).trim()
    }
  }
  if(file.startsWith('block')) {
      return `${codeSnippet}`
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
    const startRegex: RegExp = new RegExp(`(?<=\\b(?:public|private|internal)?\\s+(?:async\\s+)?(?:static\\s+)?(?:readonly\\s+)?(?:partial\\s+)?(?:unsafe\\s+)?(?:virtual\\s+)?(?:override\\s+)?\\w+\\s+${methodName}\\s*\\()`);
    const startIndex: number = fileContents.search(startRegex);

    if (startIndex === -1) {
      console.error(`Method '${methodName}' not found in file at path '${csxFilePath}'`);
      return null;
    }

    // Find the ending index of the desired method
    let openBraces: number = 0;
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
  const separator = "// ================== This is separator ==================";
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

export const combineFromDirectory = async (directoryPath: string) => {
  let scriptsDir = directoryPath;
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
};