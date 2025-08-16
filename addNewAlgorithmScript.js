// Cross platform TODO:(Test on Windows machine) high level API for running commands from node js
const shell = require("shelljs");
// Read input API
const readline = require("node:readline");

/* 
    Requirements: 
        - User has cloned repo and is at root of repo
        - User must have git installed and on PATH variable
    How to run: node addNewAlgorithm.js
*/

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

// Change this for future years
let nameOfDevBranch = "2025_sem2";

/* Put infomation wanted from user here */

// Prompt text constants
const QUERY_ALGORITHM_NAME  = "Enter the full algorithm name:\n";
const QUERY_ALGORITHM_ID    = "Enter the short ID (used as filename prefix in src/algorithms/*):\n";
const QUERY_KEYWORDS        = "Enter search keywords (space-separated):\n";
const QUERY_CATEGORY        = "What category does your algorithm fall under?\n(Enter a number or enter a new category)\n"
const QUERY_DEPLOY          = "Do you want to deploy your algorithm to the site immediately? (y/n)\n"

// Answer variables
let nameOfAlgorithm;    // Full display name of the algorithm
let algorithmId;        // Short identifier used in filenames
let listOfKeywords;     // Keywords for search in main menu
let category;           // Category the algorithm will fall under
let deploy;             // Deploy algorithm (appear in menus)

// rl.on is asynchronous need to wrap in Promises so we can use await
// to make synchronous code (i.e. wait for user input and halt rest of script)
function promisifyReads(rl) {
    return new Promise((resolve) => rl.on("line", answer => resolve(answer)));
}

async function askUntil(rl, validate) {
    while (true) {
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

    // TODO: List all existing categories
    rl.output.write(QUERY_CATEGORY);
    category = await askUntil(rl, (q => {
        const v = (q || "").trim();
        return true;
    }));
    // Get the string from the index
    // category = categories[category];

    rl.output.write(QUERY_ALGORITHM_ID);
    algorithmId = await askUntil(rl,(q => {
        const v = (q || "").trim();

        // must not be empty
        if (!v) {
            rl.output.write("Algorithm ID cannot be empty.\n");
            return false;
        }

        if (!/^[A-Za-z0-9][A-Za-z0-9_]*$/.test(v)) {
            rl.output.write("Algorithm ID must start with a letter or number and may contain only letters, numbers, and underscores (not starting with underscore).\n");
            return false;
        }

        return true;
    }));

    rl.output.write(QUERY_KEYWORDS);
    listOfKeywords = await askUntil(rl, (q => true));
    listOfKeywords = listOfKeywords.trim() === ""
    ? []
    : listOfKeywords.trim().split(/\s+/);

    rl.output.write(QUERY_DEPLOY)
    deploy = await askUntil(rl, (q => {
        const v = (q || "").trim().toLowerCase();

        if (v === "y" || v === "n") return true;

        rl.output.write("Please enter 'y' or 'n'.\n");
        return false;
    }))

    if (deploy.trim().toLowerCase() === "n") 
        rl.output.write(`Not deploying to site, algorithm accesible through 'secret' URL http://localhost:<3000>/?alg=${algorithmId}&mode=sort`);
    // Property is called noDeploy in master so its reversed.
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
    master:      "src/algorithms/index.js",
};

(async () => {
    /* Get user data */
    await retrieveDataFromUser();

    /* Run commands */
    // Git commands commented out for now.
    //shell.exec(`git switch ${nameOfDevBranch}`);
    //shell.exec(`git pull`);
    //shell.exec(`git switch -c add_${algorithmId}`);

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
    const template = `\t'${algorithmId}': {
\t\tname: '${nameOfAlgorithm}',
\t\tnoDeploy: ${deploy},
\t\tcategory: '${category}',
\t\texplanation: Explanation.${algorithmId},
\t\tparam: <Param.${algorithmId}/>,
\t\tinstructions: Instructions.${algorithmId},
\t\textraInfo: ExtraInfo.${algorithmId},
\t\tpseudocode: { sort: Pseudocode.${algorithmId} },
\t\tcontroller: { sort: Controller.${algorithmId} },
\t\tkeywords : ${JSON.stringify(listOfKeywords)}
\t},`;

    // Get file before
    const src = shell.cat(PATHS.master).toString();

    // Regex replace.
    const updated = src.replace(
        /(\/\/_MASTER_LIST_START_\n[\s\S]*?)\n\};\n(\/\/_MASTER_LIST_END_)/,
        `$1\n${template}\n};\n$2`
    );

    // Write over file.
    shell.ShellString(updated).to(PATHS.master);

    /* Final commit */
    // shell.exec(`git add ${PATHS.controllers}/${algorithmId}.js`);
    // shell.exec(`git add ${PATHS.pseudocode}/${algorithmId}.js`);
    // shell.exec(`git add ${PATHS.parameters}/${algorithmId}Param.js`);
    // shell.exec(`git add ${PATHS.explanations}/${algorithmId}Exp.md`);
    // shell.exec(`git add ${PATHS.extra}/${algorithmId}Info.md`);
    // shell.exec(`git add ${PATHS.controllers}/index.js`);
    // shell.exec(`git add ${PATHS.pseudocode}/index.js`);
    // shell.exec(`git add ${PATHS.parameters}/index.js`);
    // shell.exec(`git add ${PATHS.explanations}/index.js`);
    // shell.exec(`git add ${PATHS.extra}/index.js`);
    // shell.exec(`git add ${PATHS.instruction}/index.js`);
    // shell.exec(`git add ${PATHS.master}`);
   
    // shell.exec(`git commit -m "Adding new algorithm: ${nameOfAlgorithm}"`);

    // rl.output.write("Now attempt pull/push and hope there are no conflicts!")

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
*/