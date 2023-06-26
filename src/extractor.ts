import * as fs from "fs";
import path = require("path");
import { extractScript } from "./scriptExtractor";

export const extractFromDirectory = (directoryPath: string) => {
    const projectRoot = process.cwd();
    let policyDir = path.resolve(projectRoot, directoryPath);
    policyDir = policyDir.endsWith('/') ? policyDir.replace(/\/$/, "") : policyDir
    // Read all files in the directory
    fs.readdir(path.resolve(policyDir), (err, files) => {
        // Handle errors
        if (err) {
            console.error(`Error reading directory: ${err}`);
            throw (err);
        }
        // Process each file
        files.forEach((file) => {
            if (file.endsWith(".xml") === true) {
                extractScript(policyDir, file);
            }
        });
    });
};