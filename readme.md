# APIM Policy Transformer

The apim-policy-transformer is an npm package and CLI tool designed to extract C# code snippets from Azure APIM policy XML files, and combine them back into the policy XML file. This tool also handles named values.

This extractor is based on Ira Rainey's work: [apim-script-extractor](https://github.com/irarainey/apim-script-extractor).

## Setup
The apim-policy-transformer tool can be set up locally.

### Prerequisites
- [Node](https://nodejs.org/en)
- [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [.NET 7 SDK](https://dotnet.microsoft.com/en-us/download/visual-studio-sdks)
- [dotnet-script CLI tool](https://github.com/dotnet-script/dotnet-script)

### Installation
The apim-policy-transformer tool can be installed using npm. To install globally, run the following command:

```bash
npm install -g apim-policy-transformer
```
Alternatively, you can install it locally in your project folder by running:

```bash
npm install apim-policy-transformer
```

### Usage

#### The following methods are available for the npm package:

```typescript
apim-policy-transformer.extract(directoryPath: string)
apim-policy-transformer.combine(directoryPath: string, destinationPath?: string)
```

#### The following options are available for CLI tool:

```
-h, --help       output usage information
-V, --version    output the version number
-c, --combine    combine C# code snippets back into APIM policy XML file
-e, --extract    extract C# code snippets from APIM policy XML file
```

You can use the `apim-policy-transformer` tool to extract C# code snippets from an APIM policy XML file, debugging them and/or combine C# code snippets back into an APIM policy XML file.

#### Extract C# code 📜

To extract C# code snippets from an APIM policy XML file, run the following command:

```bash
apim-policy-transformer -e|--extract <directory-path>
```
Where <directory-path> is the path to the directory containing the policy XML files. By default, the extracted code snippets will be saved to individual `.csx` files in a directory called scripts, located next to the directory containing the policy XML files.

#### Combine C# code back into XML 🔗

To combine C# code snippets back into an APIM policy XML file, run the following command:

```bash
apim-policy-transformer -c|--combine <path-to-scripts-folder> <destination-path>(optional)
```

Where <directory-path> is the path to the directory containing the extracted `.csx` files. By default, the combined policy XML file will be saved in the same directory with the name same as directory name if destination-path is not provided. If destination-path is provided, the combiner will update the policy XML file in the destination path, or create one in the root folder if the original file doesn't exist. The mapping is through the file name.

#### Debug the extracted .csx files 🐛
- Put the following code in `.vscode/launch.json`
    ```json
    {
        "name": "Debug .NET Script",
        "type": "coreclr",
        "request": "launch",
        "program": "dotnet",
        "args": [
            "exec",
            "${userHome}/.dotnet/tools/.store/dotnet-script/1.4.0/dotnet-script/1.4.0/tools/net7.0/any/dotnet-script.dll",
            "${file}",
            "${fileDirname}"
        ],
        "cwd": "${workspaceRoot}",
        "stopAtEntry": false
    }
    ```
- Go to `Run and Debug` tab in VS Code
- Config the context.json file with values you want to use in the script, which will be passed in as context parameter
- Put a break point in the .csx file and click `Debug .NET Script`

#### Folder structure
For the combine command, the directory structure should look like this:

```bash
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
```

For the extract command, the directory structure should look like this:
```bash
.
├── policies
|   ├── policy1.xml
|   ├── policy2.xml
|   └── policy3.xml
```

### Contributing
We welcome contributions to the apim-policy-transformer tool! If you encounter a bug 🐞 or have a feature request 🚀, please open an issue on the GitHub repository. If you would like to contribute code 💻, please fork the repository and submit a pull request with your changes. Please have a look at [CONTRIBUTING.md](./CONTRIBUTING.md)

### License
This project is licensed under the MIT License. 📝