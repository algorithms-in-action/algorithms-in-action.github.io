// Cross platform TODO:(Test on Windows machine) high level API for running commands from node js
const shell = require("shelljs");
// Read input API
const readline = require("node:readline");
const { default: algorithms, AlgorithmCategoryList } = require('./src/algorithms/masterList.js');

/* 
    Requirements: 
        - User has cloned repo
        - User must have git installed and on $PATH variable
    How to run: node addNewAlgorithm.js
*/

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

// Change this for future years
const nameOfDevBranch = "2025_sem2";

/* Put infomation wanted from user here */

// Prompt text constants
const QUERY_ALGORITHM_NAME  = "Enter the full algorithm name:\n";
const QUERY_ALGORITHM_ID    = "Enter the short ID (used as filename prefix in src/algorithms/*):\n";
const QUERY_KEYWORDS        = "Enter search keywords (space-separated):\n";
const QUERY_CATEGORY        = "What category does your algorithm fall under?\n(Enter a number or enter a new category if the category does not exist)\n";
const QUERY_DEPLOY          = "Do you want to deploy your algorithm to the site immediately? (y/n)\n";
// TODO: Query for existing algorithm code to copy (right now heapSort is hard coded)
const QUERY_COPY_ALGORITHM  = "What existing algorithm would you like to copy?";

// Answer variables
let nameOfAlgorithm;    // Full display name of the algorithm
let algorithmId;        // Short identifier used in filenames
let listOfKeywords;     // Keywords for search in main menu
let category;           // Category the algorithm will fall under
let deploy;             // Deploy algorithm (appear in menus)
// TODO:
let algorithmCopy = "heapSort";

// rl.on is asynchronous need to wrap in Promises so we can use await
// to make synchronous code (i.e. wait for user input and halt rest of script)
function promisifyReads(rl) {
    return new Promise((resolve) => rl.on("line", answer => resolve(answer)));
}

async function askUntil(rl, validate) {
    // Just to bypass the commit rules
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
    rl.output.write(QUERY_ALGORITHM_NAME);
    nameOfAlgorithm = await askUntil(rl, (q => {
        const v = (q || "").trim();

        if (!v) { 
            rl.output.write("Name cannot be empty.\n"); 
            return false; 
        }

        return true;
    }));

    // Get category
    rl.output.write(QUERY_CATEGORY);

    const sortedCategories = AlgorithmCategoryList
                            .map(({ category }) => category)
                            .sort((a, b) => (a === b ? 0 : (a < b ? -1 : 1)));

    sortedCategories.forEach((val, idx) => rl.output.write(`${idx}: ${val}\n`));

    category = await askUntil(rl, (q => {
        const v = (q || "").trim();

        if (/^\d+$/.test(v) && !(Number.parseInt(v, 10) >= 0 && 
            Number.parseInt(v, 10) <= sortedCategories.length - 1)) {
            rl.output.write(`Enter a number between 0 and ${sortedCategories.length - 1} (inclusive) or enter a new cateogry\n`);
            return false;
        }

        return true;
    }));

    // Get the name from index
    if (/^\d+$/.test(category)) category = sortedCategories[category];

    rl.output.write(QUERY_ALGORITHM_ID);
    algorithmId = await askUntil(rl,(q => {
        const v = (q || "").trim();

        // must not be empty
        if (!v) {
            rl.output.write("Algorithm ID cannot be empty.\n");
            return false;
        }

        if (!/^[a-z][A-Za-z0-9_]*$/.test(v)) {
            rl.output.write("Algorithm ID must start with a lowercase letter and may contain letters, numbers, and underscores after.\n");
            return false;
        }

        // This will be the key in master list so it must be unique
        if (Object.hasOwn(algorithms, q)) {
            rl.output.write("Algorithm ID is alreay used, please select another ID.\n");
            return false;
        }

        // TODO: check ./src/algorithms/* all files and ensure it doesnt prefix with any
        // existing files otherwise we will overwrite them. Low priority, in the codebase
        // as of writing people name the file similar to ID, so being a unique ID should be enough,
        // but still do this.

        return true;
    }));

    rl.output.write(QUERY_KEYWORDS);
    listOfKeywords = await askUntil(rl, (q => true));
    listOfKeywords = listOfKeywords.trim() === ""
    ? []
    : listOfKeywords.trim().split(/\s+/);

    // TODO:
    // rl.output.write(QUERY_COPY_ALGORITHM);
    // algorithmCopy = await.askUntil(rl, (q => {
    //     return true;
    // }));

    rl.output.write(QUERY_DEPLOY)
    deploy = await askUntil(rl, (q => {
        const v = (q || "").trim().toLowerCase();

        if (v === "y" || v === "n") return true;

        rl.output.write("Please enter 'y' or 'n'.\n");
        return false;
    }))

    if (deploy.trim().toLowerCase() === "n") 
        rl.output.write(`Not deploying to site, algorithm accesible through 'secret' URL http://localhost:<port_num>/?alg=${algorithmId}&mode=sort
Note: The default port should be 3000 but note what it is in the URL when you run npm start.`);

    // Property is called noDeploy in master so its reversed.
    // Did not want to ask user "do you want to NOT deploy",
    // could be confusing.
    deploy = deploy.trim().toLowerCase() === "y" ? "false" : "true";
}

/* Small helpers to reduce repeated strings */
const PATHS = {
    controllers: "src/algorithms/controllers",
    pseudocode:  "src/algorithms/pseudocode",
    parameters:  "src/algorithms/parameters",
    explanations:"src/algorithms/explanations",
    extra:       "src/algorithms/extra-info",
    instruction: "src/algorithms/instructions",
    master:      "src/algorithms/masterList.js",
};

(async () => {
    /* Get user data */
    await retrieveDataFromUser();

    /* Run commands */
    shell.exec(`git switch ${nameOfDevBranch}`);
    shell.exec(`git pull`);
    shell.exec(`git switch -c add_${algorithmId}`);

    /* Create files and copy contents of heapSort */
    shell.cp(`${PATHS.controllers}/heapSort.js`, `${PATHS.controllers}/${algorithmId}.js`);
    shell.cp(`${PATHS.pseudocode}/heapSort.js`, `${PATHS.pseudocode}/${algorithmId}.js`);
    shell.cp(`${PATHS.parameters}/HSParam.js`, `${PATHS.parameters}/${algorithmId}Param.js`);
    shell.cp(`${PATHS.explanations}/HSExp.md`, `${PATHS.explanations}/${algorithmId}Exp.md`);
    shell.cp(`${PATHS.extra}/HSInfo.md`, `${PATHS.extra}/${algorithmId}Info.md`);

    // https://www.npmjs.com/package/shelljs#shellstringprototypetoendfile
    // https://www.npmjs.com/package/shelljs#shellstringstr
    // toEnd() is analgous to >>
    // Do not use UNIX specific commands in shell.exec()
    // Copying the echo >> into shell.exec() breaks
    // portability with windows.
    shell.ShellString(`export { default as ${algorithmId} } from './${algorithmId}'\n`)
        .toEnd(`${PATHS.controllers}/index.js`);
    shell.ShellString(`export { default as ${algorithmId} } from './${algorithmId}'\n`)
        .toEnd(`${PATHS.pseudocode}/index.js`);
    shell.ShellString(`export { default as ${algorithmId} } from './${algorithmId}Param'\n`)
        .toEnd(`${PATHS.parameters}/index.js`);
    shell.ShellString(`export { default as ${algorithmId} } from './${algorithmId}Exp.md'\n`)
        .toEnd(`${PATHS.explanations}/index.js`);
    shell.ShellString(`export { default as ${algorithmId} } from './${algorithmId}Info.md'\n`)
        .toEnd(`${PATHS.extra}/index.js`);
    shell.ShellString(`export const ${algorithmId} = sortInstructions\n`)
        .toEnd(`${PATHS.instruction}/index.js`);

    /* Adding the new entry to the master list. */
    const template = `\n\t'${algorithmId}': {
\t\tname: '${nameOfAlgorithm}',
\t\tcategory: '${category}',
\t\tnoDeploy: ${deploy},
\t\texplanationKey: '${algorithmId}',
\t\tparamKey: '${algorithmId}',
\t\tinstructionsKey: '${algorithmId}',
\t\textraInfoKey: '${algorithmId}',
\t\tpseudocode: { sort: '${algorithmId}' },
\t\tcontroller: { sort: '${algorithmId}' },
\t\tkeywords : ${JSON.stringify(listOfKeywords)}
\t},`;

    // Get file before
    const src = shell.cat(PATHS.master).toString();

    // Regex replace.
    // TODO: Windows carriage return quirks
    const updated = src.replace(
        /(\/\/_MASTER_LIST_START_\n[\s\S]*?)\n\};\n(\/\/_MASTER_LIST_END_)/,
        `$1\n${template}\n};\n$2`
    );

    // Write over file.
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
   
    shell.exec(`git commit -m "Adding new algorithm: ${nameOfAlgorithm}, files will contain ${algorithmCopy}'s source code."`);
    rl.output.write("Now attempt pull/push and hope there are no conflicts!");

    rl.close(); // Free resources
})(); // Run function when file is ran (like main in C)

/*
    Example run: node addNewAlgorithmScript.js
    Enter the full algorithm name:
    Bubble Sort
    What category does your algorithm fall under?
    (Enter a number or enter a new category)    // number not implemented yet
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