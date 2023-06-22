import { getVersion } from "./getVersion"
export const separator = "// ================== <Generated Separator. Please don't edit this line> =================="

export const cliHelp = `
👋 Welcome to apim-policy-transformer!

✅ Version: ${getVersion()}

✅ Usage: apim-policy-transformer <command> <directory path>

👉 Examples:
    $ apim-policy-transformer -c|--combine path/to/policies
    $ apim-policy-transformer -e|--extract path/to/scripts

🔎 Here's what each command does:
    📥 extract: Extracts inline policies and policy sets from XML files in a directory and generates .csx files for each policy.
    📦 combine: Combines the extracted .csx files from subdirectories of a given directory into a single .csx file.

👉 For the combine command, please provide a directory path that contains subdirectories with generated .csx files from the extract command. The directory structure should look like this:

.
├── scripts
|   ├── subfolder1
|   |   ├── block-001.csx
|   |   ├── inline-001.csx
|   |   ├── replaced.xml
|   |   ├── context.csx
|   |   └── context.json
|   ├── subfolder2
|   |   ├── block-001.csx
|   |   ├── inline-001.csx
|   |   ├── replaced.xml
|   |   ├── context.csx
|   |   └── context.json

👉 For the extract command, please provide a directory path that contains all the policy files. The directory structure should look like this:

.
├── policies
|   ├── policy1.xml
|   ├── policy2.xml
|   └── policy3.xml
`