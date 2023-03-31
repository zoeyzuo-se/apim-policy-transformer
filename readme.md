# apim-policy-transformer CLI Readme
:boom: Please note that this package is still under development. :)

The apim-policy-transformer CLI tool is designed to extract C# code snippets from Azure APIM policy XML files. It can also combine them back into the policy XML file (TODO).

This extractor is based on Ira Rainey's work: [apim-script-extractor](https://github.com/irarainey/apim-script-extractor)

## SetUp
The apim-policy-transformer tool can be set up locally

### Prerequisite
- Node
- NPM / Yarn

```sh
$root: yarn build
$root: yarn start extract ./path/to/policyDir
``` 
Alternatively, you can publish the package locally and run it:
```sh
$root: yarn build
$root: yarn link --global
$root: apim-policy-transformer extract ./path/to/policyDir

```
Note: please be sure to add .yarn/bin to $PATH

## Installation (TODO)
The apim-policy-transformer tool can be installed using npm. To install globally, run the following command:

```sh
npm install -g apim-policy-transformer
```
Alternatively, you can install it locally in your project folder by running:

```sh
npm install apim-policy-transformer
```

## Usage

## Extract C# code snippets
To extract C# code snippets from an APIM policy XML file, run the following command:

```sh
apim-policy-transformer extract <path-to-policy-xml-folder>
```
This will iterate throughthe policy XML folder and extract all C# code snippets found in the policy XML files and save them to individual .csx files in a subdirectory called `scripts`

## Combine C# code snippets back into APIM policy XML file (TODO)
To combine C# code snippets back into an APIM policy XML file, run the following command:

```sh
apim-policy-transformer combine <path-to-scripts-folder>
```
This will combine all .csx files found in the scripts folder into the policy XML file and save the updated XML file in the same directory with a suffix -new appended to the original file name.

## Contributing
We welcome contributions to the apim-policy-transformer tool! If you encounter a bug or have a feature request, please open an issue on the GitHub repository. If you would like to contribute code, please fork the repository and submit a pull request with your changes.

## License
This project is licensed under the MIT License.