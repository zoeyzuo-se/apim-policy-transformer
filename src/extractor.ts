import * as fs from 'fs';

export function Extractor(xmlFilePath: string, resultLocation: string): void {
  const bracePattern = /@{((?:[^{}]|{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*})*)}/g;
  const bracketPattern = /@\((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*\)/g;
  let xmlContent = fs.readFileSync(xmlFilePath, 'utf-8');
  const braceMatches = xmlContent.match(bracePattern) || [];
  const bracketMatches = xmlContent.match(bracketPattern) || [];
  const methods: Record<string, string> = {};

  for (let i = 0; i < braceMatches.length; i++) {
    const match = braceMatches[i];
    const methodName = `Method${i + 1}`;
    methods[methodName] = match;
    xmlContent = xmlContent.replace(match, `@${methodName}`);
  }

  for (let i = 0; i < bracketMatches.length; i++) {
    const match = bracketMatches[i];
    const methodName = `Method${braceMatches.length + i + 1}`;
    methods[methodName] = match;
    xmlContent = xmlContent.replace(match, `@${methodName}`);
  }

  const csContent = Object.entries(methods)
    .map(([methodName, methodContent]) => {
        const content = removeSurroundingBrackets(methodContent);
        return `static string ${methodName}() {\n  ${content}\n}`;
    })
    .join('\n\n');

  const replacedXmlFilePath = `${resultLocation}/replaced.xml`;
  const csFilePath = `${resultLocation}/mappedMethods.cs`;
  fs.writeFileSync(replacedXmlFilePath, xmlContent);
  fs.writeFileSync(csFilePath, csContent);
}

function removeSurroundingBrackets(str: string): string {
    if (str.startsWith("@{") && str.endsWith("}")) {
        return str.slice(2, -1);
      }
      if (str.startsWith("@(") && str.endsWith(")")) {
        return str.slice(2, -1);
      }
      return str;
}