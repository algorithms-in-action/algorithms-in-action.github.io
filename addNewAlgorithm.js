// Cross platform TODO:(Test on Windows machine) high level API for running commands from node js
const shell = require("shelljs");
// Read input API
const readline = require("node:readline");
const { default: algorithms, AlgorithmCategoryList } = require('./src/algorithms/masterList.js');
const { KEY_WORDS } = require("./src/algorithms/instructions/index.js");

/* 
    Requirements: 
        - User has cloned repo
        - User must have git installed and on $PATH variable
    How to run: 
        - node addNewAlgorithm.js
*/

/*
    For maintainers:
        - Main concern with the script is copying, in order to copy an algorithm
          we must cp the source files thus this feature is naturally coupled heavily
          to the file system structure at the time of writing, namely src/directory/*.
        - In any case if the script can not be made to work or you want an easy fix
          the functionality to select an algorithm to copy can be avoided by commenting out
          certain sections. See COPY and END COPY markers (match casing). Uncomment the section
          between DEFAULT TO HEAPSORT and END DEFAULT TO HEAPSORT. The algorithm
          will now be set to copy heap sort.

          Ensure DEFAULT_TO_HEAPSORT and PATHS have the right paths before doing this, 
          see below.
*/

// Change this for future years
const nameOfDevBranch = "2025_sem2";

// At time of writing these are the paths for heap sort files.
const DEFAULT_TO_HEAPSORT = {
    controllers: "src/algorithms/controllers/heapSort.js",
    pseudocode:  "src/algorithms/pseudocode/heapSort.js",
    parameters:  "src/algorithms/parameters/HSParam.js",
    explanations:"src/algorithms/explanations/HSExp.md",
    extra:       "src/algorithms/extra-info/HSInfo.md",
}

const PATHS = {
    controllers: "src/algorithms/controllers",
    pseudocode:  "src/algorithms/pseudocode",
    parameters:  "src/algorithms/parameters",
    explanations:"src/algorithms/explanations",
    extra:       "src/algorithms/extra-info",
    instruction: "src/algorithms/instructions",
    master:      "src/algorithms/masterList.js",
};

// Maps key name in master list to the index file its value
// will be associated with. If you change the property
// names in master list this needs to be changed. Some parts in the code
// will also need to change if you change the property names in master list
// best just to not change property keys in master list.
const KEYS_TO_DIRECTORY = {
    explanationKey : PATHS.explanations,
    paramKey : PATHS.parameters,
    instructionsKey: PATHS.instruction,
    pseduocode : PATHS.pseudocode,
    controller : PATHS.controllers
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

/* Put infomation wanted from user here */

// Prompt text constants
const QUERY_ALGORITHM_NAME  = "Enter the full algorithm name:\n";
const QUERY_ALGORITHM_ID    = "Enter the short ID (used as filename prefix in src/algorithms/*):\n";
const QUERY_KEYWORDS        = "Enter search keywords (space-separated):\n";
const QUERY_CATEGORY        = "What category does your algorithm fall under?\n(Enter a number or enter a new category if the category does not exist)\n";
const QUERY_DEPLOY          = "Do you want to deploy your algorithm to the site immediately? (y/n)\n";
const QUERY_ALGORITHM_COPY  = "What existing algorithm implementation would you like to copy?"

// Answer variables
let nameOfAlgorithm;    // Full display name of the algorithm
let algorithmId;        // Short identifier used in filenames and the key in master list
let listOfKeywords;     // Keywords for search in main menu
let categorySel;        // Category the algorithm will fall under
let deploy;             // Deploy algorithm (appear in menus)
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

        // must not be empty
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

        // In theory, this should be enough to ensure no files are overwritten, but that assumes
        // all entries were made with this script, where algorithmId is the prefix for all files generated
        // so as long as the key is unique, filenames will be unique. At the time of writing there exist
        // many algorithms that do not use the key in the master list as a prefix for their associated
        // files. TODO:


        return true;
    }));

    /* Get the algorithm to COPY*/
    rl.output.write(QUERY_ALGORITHM_COPY);

    // Display the algorithms to copy
    // const keys = Object.keys(algorithms).sort((a, b) => {
    //     const an = algorithms[a];
    //     const bn = algorithms[b];
    //     return an === bn ? 0 : (an < bn ? -1 : 1);
    // });
    // keys.forEach((id, idx) => rl.output.write(`${idx}: ${algorithms[id].name}\n`));

    // algorithmCopy = await askUntil(rl, (q => {
    //     const v = (q || "").trim();

    //     if (/^\d+$/.test(v) && !(Number.parseInt(v, 10) >= 0 && 
    //         Number.parseInt(v, 10) <= Object.keys(algorithms).length - 1)) {
    //         rl.output.write(`Enter a number between 0 and ${Object.keys(algorithms).length - 1} (inclusive)\n`);
    //         return false;
    //     }

    //     return true;
    // }));

    // algorithmCopy = algorithms[keys[Number.parseInt(algorithmCopy, 10)]];
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

    if (deploy.trim().toLowerCase() === "n") {
        rl.output.write(`Not deploying to site, algorithm accesible through 'secret' URL http://localhost:<port_num>/?alg=${algorithmId}&mode=sort
Note: The default port should be 3000 but it may be something else, see npm start's output.`);
    }

    // Property is called noDeploy in master list so its reversed.
    // Did not want to ask user "do you want to NOT deploy", could 
    // be confusing.
    deploy = deploy.trim().toLowerCase() === "y" ? false : true;
}

(async () => {
    /* Get user data */
    await retrieveDataFromUser();

    /* Run commands */
    shell.exec(`git switch ${nameOfDevBranch}`);
    shell.exec(`git pull`);
    shell.exec(`git switch -c add_${algorithmId}`);

    /* Create files and COPY contents of selected algorithm */
    // New entry in master list
    let template = {
        [algorithmId] : {   
            name: nameOfAlgorithm, 
            category: categorySel,
            noDeploy: deploy,
            keywords : listOfKeywords,
        }
    };

    // Set the other key:value pairs, requires us to copy source code
    // and export lines in index.js files.
    // Object.keys(algorithmCopy).forEach((key) => {
    //     let exportIndexFile = `${KEYS_TO_DIRECTORY[key]}/index.js`;
    //     let exportName = algorithmCopy[key];
    //     if (exportName && typeof exportName === "object") {

            
    //     } else {
    //         if (key === "instructionsKey") {
    //             // For instruction export we assign variable names in index.js to exports,
    //             // need to find what value the copied algorithm uses and assign to our algorithms
    //             // export.
    //             let src = shell.cat(`${PATHS.instruction}/index.js`).toString();
    //             const pat = new RegExp(String.raw`export\s+const\s+${algorithmCopy.instructionsKey}\s*=\s*([^;\n]+)`);
    //             const group = src.match(pat)[1];
    //             // Insert the export for the new algorithm with the same variable assignment
    //             shell.ShellString(`export const ${algorithmId}Instruction = ${group};\n`).toEnd(`${PATHS.instruction}/index.js`);
    //             template[instructionsKey] = `${algorithmId}Instruction`;
    //         } else {
    //             // Others
    //             // Find name of filename export from
    //             let filename = "";
    //             let extension = ""; // chop off in line below
    //             let fullPath = `${KEYS_TO_DIRECTORY[key]}/${filename}`;
    //             shell.cp(fullPath, `${KEYS_TO_DIRECTORY[key]}/${algorithmId}.${extension}`);
    //             shell.ShellString(`export {${algorithmId} as default} from ./${algorithmId}.${extension}`)
    //             .toEnd(`${exportIndexFile}/index.js`);
    //             template[key] = algorithmId;
    //         }
    //     }
    // });
    /* COPY END */

    /* DEFAULT TO HEAPSORT */
    shell.cp(DEFAULT_TO_HEAPSORT.controllers, `${PATHS.controllers}/${algorithmId}.js`);
    shell.cp(DEFAULT_TO_HEAPSORT.pseudocode, `${PATHS.pseudocode}/${algorithmId}.js`);
    shell.cp(DEFAULT_TO_HEAPSORT.parameters, `${PATHS.parameters}/${algorithmId}Param.js`);
    shell.cp(DEFAULT_TO_HEAPSORT.explanations, `${PATHS.explanations}/${algorithmId}Exp.md`);
    shell.cp(DEFAULT_TO_HEAPSORT.extra, `${PATHS.extra}/${algorithmId}Info.md`);
    shell.ShellString(`export { default as ${algorithmId} } from './${algorithmId}'\n`)
        .toEnd(`${PATHS.controllers}/index.js`);
    shell.ShellString(`export { default as ${algorithmId} } from './${algorithmId}'\n`)
        .toEnd(`${PATHS.pseudocode}/index.js`);
    shell.ShellString(`export { default as ${algorithmId}Param } from './${algorithmId}Param'\n`)
        .toEnd(`${PATHS.parameters}/index.js`);
    shell.ShellString(`export { default as ${algorithmId}Exp } from './${algorithmId}Exp.md'\n`)
        .toEnd(`${PATHS.explanations}/index.js`);
    shell.ShellString(`export { default as ${algorithmId}Info } from './${algorithmId}Info.md'\n`)
        .toEnd(`${PATHS.extra}/index.js`);
    shell.ShellString(`export const ${algorithmId}Instruction = sortInstructions\n`)
        .toEnd(`${PATHS.instruction}/index.js`);

    template[algorithmId].explanationKey  = `${algorithmId}Exp`;
    template[algorithmId].paramKey        = `${algorithmId}Param`;
    template[algorithmId].instructionsKey = `${algorithmId}Instruction`;
    template[algorithmId].extraInfoKey    = `${algorithmId}Info`;
    template[algorithmId].pseudocode      = { sort: algorithmId };
    template[algorithmId].controller      = { sort: algorithmId };
    /* END DEFAULT TO HEAPSORT */

    let s = JSON.stringify(template, null, 2);
    s = "\t" + s.slice(1, -1).trim(); // remove outer { }
    let src = shell.cat(PATHS.master).toString();
    // TODO: Windows carriage return quirks
    const updated = src.replace(
        /(\/\/_MASTER_LIST_START_\n[\s\S]*?)\n\};\n(\/\/_MASTER_LIST_END_)/,
        `$1\n${s}\n};\n$2`
    );
    shell.ShellString(updated).to(PATHS.master);

    /* Final commit */
    shell.exec(`git add ${PATHS.controllers}/${algorithmId}.js`);
    shell.exec(`git add ${PATHS.pseudocode}/${algorithmId}.js`);
    shell.exec(`git add ${PATHS.parameters}/${algorithmId}Param.js`);
    shell.exec(`git add ${PATHS.explanations}/${algorithmId}Exp.md`);
    shell.exec(`git add ${PATHS.extra}/${algorithmId}Info.md`);
    shell.exec(`git add ${PATHS.controllers}/index.js`);
    shell.exec(`git add ${PATHS.pseudocode}/index.js`);
    shell.exec(`git add ${PATHS.parameters}/index.js`);
    shell.exec(`git add ${PATHS.explanations}/index.js`);
    shell.exec(`git add ${PATHS.extra}/index.js`);
    shell.exec(`git add ${PATHS.instruction}/index.js`);
    shell.exec(`git add ${PATHS.master}`);
    
    shell.exec(`git commit -m "Adding new algorithm: ${nameOfAlgorithm}, files will contain ${algorithmCopy.name}'s source code."`);
    rl.output.write("Now attempt pull/push and hope there are no conflicts!");

    rl.close(); // Free resources
})(); // Run function when file is ran (like main in C)

/*
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