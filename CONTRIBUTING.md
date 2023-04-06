# Contributing to apim-policy-transformer

👍🎉 First off, thank you for considering contributing to apim-policy-transformer! 🎉👍

We welcome contributions to this tool in any form, whether it be bug reports, feature requests, documentation improvements, or code contributions. Please take a moment to review this document in order to make the contribution process as smooth as possible.

## How to Contribute
### Contributing Code
If you would like to contribute code to apim-policy-transformer, please follow these steps:

- Fork the repository
- Clone your forked repository locally
- Install the dependencies using `yarn install`
- Make changes to the code
- Build the code in the root directory using `yarn build`
- Run the code using `yarn start extract <absolute/path/to/policy/folder>` or `yarn start combine <absolute/path/to/scripts/folder>`
- Debug the code in VSCode using debugger.
    - 🛠️ Open the debugger on the left pane
    - 🐛 Choose "Debug node script"
    - 🔍 Go to `bin/` and find a file which you want to debug. Put a break point.
    - 🔍 Go to `bin/` and open `index.js`
    - ▶️ Hit F5 or click the green arrow to start debugging
- Commit your changes with a clear and descriptive commit message
- Push your changes to your forked repository
- Open a pull request to the main branch of our repository

When creating your pull request, please include:

- A clear and descriptive title
- A detailed description of the changes you have made
- Any relevant use cases or examples of where these changes would be useful

License
By contributing to apim-policy-transformer, you agree that your contributions will be licensed under the MIT License.