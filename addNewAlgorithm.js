// Cross platform TODO:(Test on Windows machine) high level API for running commands from node js
const shell = require("shelljs");
// Read input API
const readline = require("node:readline");
const { default: algorithms, AlgorithmCategoryList } = require('./src/algorithms/masterList.js');

/* 
    Requirements: 
        - User has cloned repo
        - User must have git installed and on $PATH variable
    How to run: 
        - node addNewAlgorithm.js
*/

/*
    For maintainers:
        - Every index.js file must only use export {default as x} from y, variations like
          {default as x, y, z} or {x, y, z} will not allow the script to copy the algorithm that
          uses those exports. This is definitely something that can be implemented later on since
          in some cases it can be annoying to make multiple files just to statisfy this constraint.
        - Change of names for properties in master list will cause problems, we are
          inserting an entry, so we use the property names at the time of writing. I have
          created a map PROPERTY_NAMES which should be modified if the property names in
          masterList.js is changed.
        - Main concern with the script is copying, in order to copy an algorithm
          we must cp the source files thus this feature is naturally coupled heavily
          to the file system structure at the time of writing, namely src/directory/*.
        - In any case if the script can not be made to work or you want an easy fix
          the functionality to select an algorithm to copy can be removed by commenting out
          certain sections. See COPY and END COPY markers (match casing). Uncomment the section
          between DEFAULT TO HEAPSORT and END DEFAULT TO HEAPSORT. The algorithm
          will now be set to copy heap sort through hardcoded paths.

          Ensure DEFAULT_TO_HEAPSORT and PATHS have the right paths before doing this, 
          see below.

          The below constants should help protect against variations in key names
          in masterList.js and file system changes without having to touch
          this script to heavily, but it does not protect against everything.

          Extensions: 
            - Do not impose export {default as x} from y constraint
*/

// Change this for future years
const NAME_OF_DEV_BRANCH = "2025_sem2";

// At time of writing these are the paths for heap sort files.
const DEFAULT_TO_HEAPSORT = {
    controllers : "src/algorithms/controllers/heapSort.js",
    pseudocode  : "src/algorithms/pseudocode/heapSort.js",
    parameters  : "src/algorithms/parameters/HSParam.js",
    explanations: "src/algorithms/explanations/HSExp.md",
    extra       : "src/algorithms/extra-info/HSInfo.md",
}

const PATHS = {
    controllers : "src/algorithms/controllers",
    pseudocode  : "src/algorithms/pseudocode",
    parameters  : "src/algorithms/parameters",
    explanations: "src/algorithms/explanations",
    extra       : "src/algorithms/extra-info",
    instruction : "src/algorithms/instructions",
    master      : "src/algorithms/masterList.js",
};

// A map of concept to actual property name in master list,
// this is so script does not need to be touched heavily
// if property names are changed in master list.
const PROPERTY_NAMES = {
    name        : "name",
    category    : "category",
    noDeploy    : "noDeploy",
    keyword     : "keywords",
    instruction : "instructionsKey",
    explanation : "explanationKey",
    parameters  : "paramKey",
    pseudo      : "pseudocode",
    control     : "controller",
    extraInfo   : "extraInfoKey"
};

// Collection of the keys that have values that are exports
const MODULE_KEYS = new Set([
  PROPERTY_NAMES.instruction,
  PROPERTY_NAMES.explanation,
  PROPERTY_NAMES.parameters,
  PROPERTY_NAMES.pseudo,
  PROPERTY_NAMES.control,
  PROPERTY_NAMES.extraInfo,
]);

// Helper, we will be pulling keys from master list
// and want to know what index.js file their values (exports)
// correspond to.
const KEYS_TO_DIRECTORY = {
  [PROPERTY_NAMES.explanation]  : PATHS.explanations,
  [PROPERTY_NAMES.parameters]   : PATHS.parameters,
  [PROPERTY_NAMES.instruction]  : PATHS.instruction,
  [PROPERTY_NAMES.pseudo]       : PATHS.pseudocode,
  [PROPERTY_NAMES.control]      : PATHS.controllers,
  [PROPERTY_NAMES.extraInfo]    : PATHS.extra
};

const rl = readline.createInterface({
    input   : process.stdin,
    output  : process.stdout,
    terminal: false,
});

/* Put infomation wanted from user here */

// Prompt text constants
const QUERY_ALGORITHM_NAME  = "Enter the full algorithm name:\n";
const QUERY_ALGORITHM_ID    = "Enter the short ID (used as filename prefix in src/algorithms/*):\n";
const QUERY_KEYWORDS        = "Enter search keywords (space-separated):\n";
const QUERY_CATEGORY        = "What category does your algorithm fall under?\n(Enter a number or enter a new category if the category does not exist)\n";
const QUERY_DEPLOY          = "Do you want to deploy your algorithm to the site immediately? (y/n)\n";
const QUERY_ALGORITHM_COPY  = "What existing algorithm implementation would you like to copy?\n"

// Answer variables
let nameOfAlgorithm;    // Full display name of the algorithm
let algorithmId;        // Short identifier used in filenames and the key in master list
let listOfKeywords;     // Keywords for search in main menu
let categorySel;        // Category the algorithm will fall under
let deploy;             // Deploy algorithm (appear in menus)
let noDeploy;           // Master list uses noDeploy but im asking user if they want to deploy
let algorithmCopy = {   // Algorithm to copy (this will hold the master entry of the algorithm selected)
    name : "heapSort"
};

// rl.on is asynchronous need to wrap in Promises so we can use await
// to make synchronous code (i.e. wait for user input and halt rest of script)
function promisifyReads(rl) {
    return new Promise((resolve) => rl.on("line", answer => resolve(answer)));
}

async function askUntil(rl, validate) {
    // Just to bypass the commit rules no while(true) allowed
    let b = true;
    while (b) {
        let response = await promisifyReads(rl);
        // Validate should send to stdout appropriate messages
        // when failing to validate, directing the user towards a valid
        // input.
        if (validate(response)) return response;
    }
}

// Retrieve all data from the user
async function retrieveDataFromUser() {

    /* Get algorithm name */
    rl.output.write(QUERY_ALGORITHM_NAME);

    // Lax on the validation because its not used in code besides in master list
    // where it will be the name property, this will be what is displayed 
    // in MainMenu and AlgorithmMenu.
    nameOfAlgorithm = await askUntil(rl, (q => {
        const v = (q || "").trim();

        if (!v) { 
            rl.output.write("Name cannot be empty.\n"); 
            return false; 
        }

        return true;
    }));

    /* Get category */
    rl.output.write(QUERY_CATEGORY);

    // Display the categories for selection
    const sortedCategories = AlgorithmCategoryList
                            .map(({ category }) => category)
                            .sort((a, b) => (a === b ? 0 : (a < b ? -1 : 1)));
    sortedCategories.forEach((val, idx) => rl.output.write(`${idx}: ${val}\n`));

    // Get the users requested category, this can be an existing category
    // in which case the user passes a number corresponding to the index of the name
    // in sortedCategories, else if they want their own new category they enter a string.
    categorySel = await askUntil(rl, (q => {
        const v = (q || "").trim();

        if (/^\d+$/.test(v) && !(Number.parseInt(v, 10) >= 0 && 
            Number.parseInt(v, 10) <= sortedCategories.length - 1)) {
            rl.output.write(`Enter a number between 0 and ${sortedCategories.length - 1} (inclusive) or enter a new cateogry\n`);
            return false;
        }

        return true;
    }));

    // Get the name from index
    if (/^\d+$/.test(categorySel)) categorySel = sortedCategories[categorySel];

    /* Get the algorithm ID */
    rl.output.write(QUERY_ALGORITHM_ID);

    algorithmId = await askUntil(rl,(q => {
        const v = (q || "").trim();

        // Must not be empty
        if (!v) {
            rl.output.write("Algorithm ID cannot be empty.\n");
            return false;
        }

        // This can be changed, the only restriction is that it must be capable of being a prefix of a filename.
        // Also will be a key in a JS object so probably best to keep sensible.
        if (!/^[a-z][A-Za-z0-9_]*$/.test(v)) {
            rl.output.write("Algorithm ID must start with a lowercase letter and may contain letters, numbers, and underscores after.\n");
            return false;
        }

        // This will be the key in master list so it must be unique
        if (Object.hasOwn(algorithms, q)) {
            rl.output.write("Algorithm ID is alreay used, please select another ID.\n");
            return false;
        }

        // In theory, the above should be enough to ensure no files are overwritten, but that assumes
        // all entries were made with this script, where algorithmId is the prefix for all files generated
        // so as long as the key is unique, filenames will be unique. At the time of writing there exist
        // many algorithms that do not use the key in the master list as a prefix for their associated
        // files.
        for (const [key, dir] of Object.entries(PATHS)) {
            const files = shell.ls(dir);
            const conflict = files.find(f => f.startsWith(v));
            if (conflict) {
                rl.output.write(`Conflict: file ${dir}/${conflict} already exists with that prefix.\n`);
                return false;
            }
        }

        return true;
    }));

    /* Get the algorithm to COPY */
    rl.output.write(QUERY_ALGORITHM_COPY);

    // Display the algorithms to copy
    const keys = Object.keys(algorithms).sort((a, b) => {
        const an = algorithms[a];
        const bn = algorithms[b];
        return an === bn ? 0 : (an < bn ? -1 : 1);
    });
    keys.forEach((id, idx) => rl.output.write(`${idx}: ${algorithms[id].name}\n`));

    algorithmCopy = await askUntil(rl, (q => {
        const v = (q || "").trim();

        if (/^\d+$/.test(v) && !(Number.parseInt(v, 10) >= 0 && 
            Number.parseInt(v, 10) <= Object.keys(algorithms).length - 1)) {
            rl.output.write(`Enter a number between 0 and ${Object.keys(algorithms).length - 1} (inclusive)\n`);
            return false;
        }

        return true;
    }));

    algorithmCopy = algorithms[keys[Number.parseInt(algorithmCopy, 10)]];
    /* END COPY */

    /* Get keywords */
    rl.output.write(QUERY_KEYWORDS);

    // These will be used in the main menu's search function
    // hence little to no restriction.
    listOfKeywords = await askUntil(rl, (q => true));
    listOfKeywords = listOfKeywords.trim() === ""
    ? []
    : listOfKeywords.trim().split(/\s+/);

    /* Get deploy status */
    rl.output.write(QUERY_DEPLOY);

    deploy = await askUntil(rl, (q => {
        const v = (q || "").trim().toLowerCase();

        if (v === "y" || v === "n") return true;

        rl.output.write("Please enter 'y' or 'n'.\n");
        return false;
    }))

    noDeploy = deploy.trim().toLowerCase() === "y" ? false : true;

    if (noDeploy) {
        rl.output.write(`Not deploying to site, algorithm accesible through 'secret' URL http://localhost:<port_num>/?alg=${algorithmId}
Note: The default port should be 3000 but it may be something else, see npm start's output.`);
    }
}

(async () => {
    /* Get user data */
    await retrieveDataFromUser();

    /* Run commands */
    shell.exec(`git switch ${NAME_OF_DEV_BRANCH}`);
    shell.exec(`git pull`);
    shell.exec(`git switch -c add_${algorithmId}`);

    // New entry in master list
    let template = {
        [algorithmId] : {   
            [PROPERTY_NAMES.name]     : nameOfAlgorithm, 
            [PROPERTY_NAMES.category] : categorySel,
            [PROPERTY_NAMES.noDeploy] : noDeploy,
            [PROPERTY_NAMES.keyword]  : listOfKeywords,
        }
    };

    // Files added, for git add later
    let newOrModifiedFiles = new Set();

    /* 
        Create files and COPY contents of selected algorithm.

        This is the block of code that places the restriction that all exports from index.js
        files must have form export {x as default} from f.
    */

    // Do shell.cp() after everything retrieved
    // with no errors, quality of life feature so in
    // the event of error you do not have to manually delete
    // all created files before error.
    // each entry (srcFile, dstFile)
    let cpCache = [];
    // Same idea with the export lines
    // each entry (exportString, fileToInsertInto)
    let exportCache = [];

    // Set the other key:value pairs, requires us to copy source code
    // and export lines in index.js files.
    Object.keys(algorithmCopy).forEach((key) => {
        // Do not traverse file systems for values that are not
        // export keys, e.g. name, noDeploy, keywords, etc.
        if (!MODULE_KEYS.has(key)) return;

        let indexFilepath = `${KEYS_TO_DIRECTORY[key]}/index.js`;
        let indexContents = shell.cat(indexFilepath).toString();
        let exportName = algorithmCopy[key];

        if (typeof exportName === "object") {
            let addToTemplate = {};
            Object.keys(exportName).forEach((mode) => {
                let innerExportName = exportName[mode];
                const pat = new RegExp(
                    String.raw`export\s*\{\s*default\s+as\s+${innerExportName}\s*\}\s*from\s*['"]([^'"]+)['"]\s*;?`,
                );

                const match = indexContents.match(pat);

                if (!match) {
                    throw new Error(
                        `Could not find default export line for "${innerExportName}" in ${indexFilepath}`
                    );
                }

                const relPath = match[1];
                const baseName = relPath.split("/").pop();
                const extension = baseName.includes(".") ? baseName.split(".").pop() : "js";

                // Copy file
                const srcFile = baseName.includes(".")
                    ? `${KEYS_TO_DIRECTORY[key]}/${baseName}`
                    : `${KEYS_TO_DIRECTORY[key]}/${baseName}.${extension}`;
                
                // camelCase convention
                let suffix = mode.at(0).toUpperCase() + mode.slice(1);
                const destFile = `${KEYS_TO_DIRECTORY[key]}/${algorithmId}${suffix}.${extension}`;
                cpCache.push([srcFile, destFile]);

                // Write new export line
                exportCache.push([
                    `export { default as ${algorithmId}${suffix} } from './${algorithmId}${suffix}.${extension}';\n`,
                    indexFilepath
                ]);

                // Update template
                addToTemplate[mode] = `${algorithmId}${suffix}`;
            });
            template[algorithmId][key] = addToTemplate;
        } else {
            if (key === PROPERTY_NAMES.instruction) {
                // For instruction we only insert export line, we do not copy a file.
                // We also assign the export to a variable in the file, we need to find
                // what variable the algorithm we are copying used and set it to the value of the
                // export for the new algorithm.

                let src = shell.cat(`${PATHS.instruction}/index.js`).toString();
                const pat = new RegExp(String.raw`export\s+const\s+${exportName}\s*=\s*([^;\n]+)`);
                const variableAssignedToCopiedAlgorithm = src.match(pat)[1];

                // Insert the export for the new algorithm with the same variable assignment
                exportCache.push([
                    `export const ${algorithmId} = ${variableAssignedToCopiedAlgorithm};\n`,
                    `${PATHS.instruction}/index.js`
                ]);

                template[algorithmId][key] = `${algorithmId}`;
            } else {
                // Others
                const pat = new RegExp(
                    String.raw`export\s*\{\s*default\s+as\s+${exportName}\s*\}\s*from\s*['"]([^'"]+)['"]\s*;?`,
                );
                const match = indexContents.match(pat);

                if (!match) {
                    throw new Error(
                        `Could not find default export line for "${exportName}" in ${indexFilepath}`
                    );
                }
                
                const relPath = match[1];
                const baseName = relPath.split("/").pop();
                const extension = baseName.includes(".") ? baseName.split(".").pop() : "js";
                
                // Copy file
                const srcFile = baseName.includes(".")
                    ? `${KEYS_TO_DIRECTORY[key]}/${baseName}`
                    : `${KEYS_TO_DIRECTORY[key]}/${baseName}.${extension}`;
                const destFile = `${KEYS_TO_DIRECTORY[key]}/${algorithmId}.${extension}`;
                cpCache.push([srcFile, destFile]);

                // Write new export line
                exportCache.push([
                    `export { default as ${algorithmId} } from './${algorithmId}.${extension}';\n`,
                    indexFilepath
                ]);
                
                // Update template
                template[algorithmId][key] = algorithmId;
            }
        }
    });

    // No errors we can update the file system now.
    cpCache.forEach(([src, dest]) => {
        shell.cp(src, dest);
        newOrModifiedFiles.add(dest);
    });

    exportCache.forEach(([line, file]) => {
        shell.ShellString(line).toEnd(file);
        newOrModifiedFiles.add(file);
    });
    /* COPY END */

    /* DEFAULT TO HEAPSORT */
    // shell.cp(DEFAULT_TO_HEAPSORT.controllers, `${PATHS.controllers}/${algorithmId}.js`);
    // newOrModifiedFiles.add(`${PATHS.controllers}/${algorithmId}.js`);
    // shell.cp(DEFAULT_TO_HEAPSORT.pseudocode, `${PATHS.pseudocode}/${algorithmId}.js`);
    // newOrModifiedFiles.add(`${PATHS.pseudocode}/${algorithmId}.js`);
    // shell.cp(DEFAULT_TO_HEAPSORT.parameters, `${PATHS.parameters}/${algorithmId}.js`);
    // newOrModifiedFiles.add(`${PATHS.parameters}/${algorithmId}.js`);
    // shell.cp(DEFAULT_TO_HEAPSORT.explanations, `${PATHS.explanations}/${algorithmId}.md`);
    // newOrModifiedFiles.add(`${PATHS.explanations}/${algorithmId}.md`);
    // shell.cp(DEFAULT_TO_HEAPSORT.extra, `${PATHS.extra}/${algorithmId}.md`);
    // newOrModifiedFiles.add(`${PATHS.extra}/${algorithmId}.md`);

    // shell.ShellString(`export { default as ${algorithmId} } from './${algorithmId}';\n`)
    //     .toEnd(`${PATHS.controllers}/index.js`);
    // newOrModifiedFiles.add(`${PATHS.controllers}/index.js`);
    // shell.ShellString(`export { default as ${algorithmId} } from './${algorithmId}';\n`)
    //     .toEnd(`${PATHS.pseudocode}/index.js`);
    // newOrModifiedFiles.add(`${PATHS.pseudocode}/index.js`);
    // shell.ShellString(`export { default as ${algorithmId} } from './${algorithmId}';\n`)
    //     .toEnd(`${PATHS.parameters}/index.js`);
    // newOrModifiedFiles.add(`${PATHS.parameters}/index.js`);
    // shell.ShellString(`export { default as ${algorithmId} } from './${algorithmId}.md';\n`)
    //     .toEnd(`${PATHS.explanations}/index.js`);
    // newOrModifiedFiles.add(`${PATHS.explanations}/index.js`);
    // shell.ShellString(`export { default as ${algorithmId} } from './${algorithmId}.md';\n`)
    //     .toEnd(`${PATHS.extra}/index.js`);
    // newOrModifiedFiles.add(`${PATHS.extra}/index.js`);
    // shell.ShellString(`export const ${algorithmId} = sortInstructions;\n`)
    //     .toEnd(`${PATHS.instruction}/index.js`);
    // newOrModifiedFiles.add(`${PATHS.instruction}/index.js`);
    // template[algorithmId][PROPERTY_NAMES.explanation] = algorithmId;
    // template[algorithmId][PROPERTY_NAMES.parameters]  = algorithmId;
    // template[algorithmId][PROPERTY_NAMES.instruction] = algorithmId;
    // template[algorithmId][PROPERTY_NAMES.extraInfo]   = algorithmId;
    // template[algorithmId][PROPERTY_NAMES.pseudo]      = { sort: algorithmId };
    // template[algorithmId][PROPERTY_NAMES.control]     = { sort: algorithmId };
    /* END DEFAULT TO HEAPSORT */

    // All files and export lines created,
    // insert the template into the master list.
    let s = JSON.stringify(template, null, 2);
    s = "\t" + s.slice(1, -1).trim(); // remove outer { }
    let src = shell.cat(PATHS.master).toString();
    // TODO: Windows carriage return quirks
    const updated = src.replace(
        /(\/\/_MASTER_LIST_START_\n[\s\S]*?)\n\};\n(\/\/_MASTER_LIST_END_)/,
        `$1\n\n${s},\n};\n$2`
    );
    shell.ShellString(updated).to(PATHS.master);
    newOrModifiedFiles.add(PATHS.master);

    /* Final commit */
    newOrModifiedFiles.forEach((filepath) => shell.exec(`git add ${filepath}`));
    shell.exec(`git commit -m "Adding new algorithm: ${nameOfAlgorithm}, files will contain ${algorithmCopy.name}'s source code."`);
    rl.output.write("Now attempt pull/push and hope there are no conflicts!");

    rl.close(); // Free resources
})(); // Run function when file is ran (like main in C)

/*
    Assuming no errors.
    Example run: node addNewAlgorithmScript.js
    Enter the full algorithm name:
    Bubble Sort
    What category does your algorithm fall under?
    (Enter a number or enter a new category)
    Sort
    Enter the short ID (used as filename perfix in src/algorithms/*):
    bsort
    Enter search keywords (space-seperated):
    n^2 slow hello world
    Do you want to deploy your algorithm to the site immediately? (y/n)
    y

    To test again switch back to 2025_sem2 branch and delete the add_{algorithm_id} branch
    For example
    git checkout 2025_sem2
    git branch -D add_bsort
*/