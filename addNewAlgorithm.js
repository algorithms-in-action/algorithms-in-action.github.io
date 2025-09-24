// Parser for JS files
const parser = require("@babel/parser");
// Traverser helper for the JSO produced by using parser above
const traverse = require("@babel/traverse").default;
// Execute shell commands TODO: should be cross platform but test on Windows machine
const shell = require("shelljs");
// Helps with constructing cross platform OS filepaths
const path = require("path");
// I/O API
const readline = require("node:readline");
const rl = readline.createInterface({
  input   : process.stdin,
  output  : process.stdout,
  terminal: false,
});

/*
  What could break this script?

  Minimal risks:
    - File system changes:
      - Anything under src/algorithms/*
      - Especially the index.js files that correspond to export-linked
        keys in the master list
    - Renaming of properties in the master list
    - Renaming the variable name used for the master list object
    - Adding a new non-optional property to the master list entries

  Most of the above are easy to fix by updating the global configuration
  variables defined below. Notice that the DATA object has three sections:

    - general — internal only, should not need modification.
    - meta    — defines required metadata fields for master list entries.
                 If you add a new required property, it MUST be added here
                 so the script knows how to query/validate/postProcess it.
                 Follow the API patterns shown in the existing examples.
    - exports — defines properties that map to exported modules. If the
                 project’s file structure changes, update the dir paths
                 here. If new export properties are added to the master
                 list, add them here as well.

  What will definitely break it and require more complex fixing?

    - If index.js export files are not at the root of the directories
      listed in DATA.exports.
    - If index.js re-exports do not export from files with a relative filepath.
    - If individual source files hard-code tight coupling to master list
      keys (e.g. param files used to hard-code their own master list key). The script
      never edits source files directly (other than index.js export files), so any such
      coupling would require manual fixes after running.
    - Making any of the changes mentioned in "What could break this script?" 
      without also updating the global configuration in this script.
    - _MASTER_LIST_START_ and END markers removed/changed from masterList.js.
*/

// Master list changes
const MASTER_LIST_PATH = "./src/algorithms/masterList.js"
const { default: algorithms, AlgorithmCategoryList } = require(MASTER_LIST_PATH);

// Ignore this, this is not to be modified.
const SORTED_CATEGORIES = AlgorithmCategoryList
  .map(({ category }) => category)
  .sort((a, b) => a.localeCompare(b));

const DATA = {

  // Do not need to modify this, unless you know what you are doing.
  general: {
    algorithmId: {

      property: "algorithmId",

      query: (rl) => rl.output.write("Enter the short ID (used as filename prefix in src/algorithms/*):\n"),

      validate: (ans, rl) => {
        const v = (ans || "").trim();
        if (!v) {
          rl.output.write("Algorithm ID cannot be empty.\n");
          return false;
        }
        if (!/^[a-z][A-Za-z0-9_]*$/.test(v)) {
          rl.output.write("Algorithm ID must start with a lowercase letter and may contain letters, numbers, and underscores after.\n");
          return false;
        }
        if (Object.hasOwn(algorithms, v)) {
          rl.output.write("Algorithm ID already used, please select another ID.\n");
          return false;
        }
        return true;
      },

      postProcess: (ans) => ans.trim(),
    },

    algorithmCopy: {
      property: "algorithmCopy",

      query: (rl) => {
        rl.output.write("What existing algorithm implementation would you like to copy?\n");
        const keys = Object.keys(algorithms).sort((a, b) =>
          algorithms[a].name.localeCompare(algorithms[b].name)
        );
        keys.forEach((id, idx) => rl.output.write(`${idx}: ${algorithms[id].name}\n`));
      },

      validate: (ans, rl) => {
        const v = (ans || "").trim();
        const keys = Object.keys(algorithms).sort((a, b) =>
          algorithms[a].name.localeCompare(algorithms[b].name)
        );
        if (/^\d+$/.test(v) && !(+v >= 0 && +v <= keys.length - 1)) {
          rl.output.write(`Enter a number between 0 and ${keys.length - 1} (inclusive)\n`);
          return false;
        }
        return true;
      },

      postProcess: (ans) => {
        const keys = Object.keys(algorithms).sort((a, b) =>
          algorithms[a].name.localeCompare(algorithms[b].name)
        );
        return keys[Number.parseInt(ans.trim(), 10)];
      },
    },
  },

  // Keys in master list that do not represent export keys
  meta: {
    name: {
      property: "name",

      query: (rl) => {
        rl.output.write("Enter the full algorithm name:\n");
      },

      validate: (ans, rl) => {
        const v = (ans || "").trim();
        if (!v) {
          rl.output.write("Name cannot be empty.\n");
          return false;
        }
        return true;
      },

      postProcess: (ans) => ans.trim(),
    },

    category: {
      property: "category",

      query: (rl) => {
        rl.output.write("What category does your algorithm fall under?\n");
        SORTED_CATEGORIES.forEach((val, idx) =>
          rl.output.write(`${idx}: ${val}\n`)
        );
      },

      validate: (ans, rl) => {
        const v = (ans || "").trim();
        if (/^\d+$/.test(v) && !(+v >= 0 && +v <= SORTED_CATEGORIES.length - 1)) {
          rl.output.write(
            `Enter a number between 0 and ${SORTED_CATEGORIES.length - 1} (inclusive) or a new category.\n`
          );
          return false;
        }
        return true;
      },

      postProcess: (ans) => {
        const v = ans.trim();
        return /^\d+$/.test(v) ? SORTED_CATEGORIES[+v] : v;
      },
    },

    noDeploy: {
      property: "noDeploy",

      query: (rl) => {
        rl.output.write("Do you want to deploy your algorithm to the site immediately? (y/n)\n");
      },

      validate: (ans, rl) => {
        const v = (ans || "").trim().toLowerCase();
        if (v === "y" || v === "n") return true;
        rl.output.write("Please enter 'y' or 'n'.\n");
        return false;
      },

      postProcess: (ans, rl) => {
        const deploy = ans.trim().toLowerCase() === "y";
        if (!deploy) {
          rl.output.write(
            "Not deploying to site, algorithm accessible through 'secret' URL\n"
          );
        }
        // property is `noDeploy` in master list did not want to ask user do you 
        // want to NOT deploy could be misunderstood.
        return !deploy;
      },
    },

    keyword: {
      property: "keywords",

      query: (rl) => {
        rl.output.write("Enter search keywords (space-separated):\n");
      },

      validate: () => true, // anything is fine

      postProcess: (ans) => {
        const trimmed = ans.trim();
        return trimmed === "" ? [] : trimmed.split(/\s+/);
      },
    },
  },

  // Export keys in master list metadata
  exports: {
    controllers: {
      property: "controller",
      dir: "src/algorithms/controllers",
    },

    pseudocode: {
      property: "pseudocode",
      dir: "src/algorithms/pseudocode",
    },

    parameters: {
      property: "paramKey",
      dir: "src/algorithms/parameters",
    },

    explanations: {
      property: "explanationKey",
      dir: "src/algorithms/explanations",
    },

    extraInfo: {
      property: "extraInfoKey",
      dir: "src/algorithms/extra-info",
    },

    instruction: {
      property: "instructionsKey",
      dir: "src/algorithms/instructions",
    },
  },
};

// Makes sure everything is in place, possible I missed something.
const verifyPreReqs = () => {
  const problems = [];

  if (!shell.test("-f", MASTER_LIST_PATH)) {
    console.error(`Error: must run this script from the project root (${MASTER_LIST_PATH} not found).`);
    process.exit(1);
  }

  if (!shell.which("git")) problems.push("Git is not installed or not on $PATH.");

  const status = shell.exec("git status --porcelain", { silent: true })
  if (status.length > 0) {
    console.error("Error: working tree is not clean. Please commit or stash your changes first.");
    process.exit(1);
  }

  for (const [key, def] of Object.entries(DATA.meta)) {
    if (!def.property) problems.push(`meta.${key}: missing "property"`);
    if (typeof def.query !== "function") problems.push(`meta.${key}: missing "query" function`);
    if (typeof def.validate !== "function") problems.push(`meta.${key}: missing "validate" function`);
    if (typeof def.postProcess !== "function") problems.push(`meta.${key}: missing "postProcess" function`);
  }

  for (const [key, def] of Object.entries(DATA.exports)) {
    if (!def.property) problems.push(`exports.${key}: missing "property"`);
    if (!def.dir) problems.push(`exports.${key}: missing "dir"`);
    else {
      if (!shell.test("-d", def.dir)) {
        problems.push(`exports.${key}: directory not found -> ${def.dir}`);
      } else {
        const indexPath = path.join(def.dir, "index.js");
        if (!shell.test("-f", indexPath)) {
          problems.push(`exports.${key}: missing index.js in directory -> ${indexPath}`);
        }
      }
    }
  }

  if (problems.length > 0) {
    console.error("Pre-requisite verification failed:\n" + problems.join("\n"));
    process.exit(1);
  }
};

// rl.on is asynchronous need to wrap in Promises so we can use await
// to make synchronous code (i.e. wait for user input and halt rest of script)
const promisifyReads = (rl) => new Promise((resolve) => rl.on("line", answer => resolve(answer)));

// Repeatedly queries the user until validate callback
// is satisfied, the validate callback should include output messages
// which directs the user towards a valid input.
async function askUntil(rl, queryFn, validate, postProcess) {
  const b = true;
  while (b) {
    queryFn(rl);
    let response = await promisifyReads(rl);
    if (validate(response, rl)) {
      return postProcess ? postProcess(response, rl) : response;
    }
  }
}

// Retrieves all data from user, the questions, validation, and
// post processing logic is pulled from DATA object at runtime.
async function retrieveDataFromUser() {
  const result = { general: {}, masterListEntry: {} };

  // Handle general data
  for (const [key, def] of Object.entries(DATA.general)) {
    let answer = await askUntil(rl, def.query, def.validate, def.postProcess);
    result.general[def.property] = answer;
  }

  const algorithmId = result.general.algorithmId;
  result.masterListEntry[algorithmId] = {};

  // Handle meta data
  for (const [key, def] of Object.entries(DATA.meta)) {
    let answer = await askUntil(rl, def.query, def.validate, def.postProcess);
    result.masterListEntry[algorithmId][def.property] = answer;
  }

  return result;
}

// TL;DR Babel parser creates a javascript object capturing
// everything about a JS file's (source codes) metadata. The
// traverser API allows us to easily filter this to only stuff we care about.
// In this case, its exports, so we use keys that correspond
// to that in the traverser (ExportNamedDecleration in this case).
const getExportsFromFile = (filepath) => {
  const exports = [];

  if (!shell.test('-f', filepath)) {
    console.error(`Error: file not found -> ${filepath}`);
    process.exit(1);
  }

  const code = shell.cat(filepath).toString();
  const ast = parser.parse(code, { sourceType: "module" });

  traverse(ast, {
    // https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#exportnameddeclaration
    ExportNamedDeclaration({ node }) {
      const source = node.source ? node.source.value : null;

      // Case 1: export { foo as bar } from './x'
      // should protect against export { foo as "string reexport"} from './x'
      node.specifiers.forEach((spec) => {
        exports.push({
          file: filepath,
          source,
          exported: spec.exported.type === "StringLiteral"
            ? spec.exported.value
            : spec.exported.name,
          local: spec.local.type === "StringLiteral"
            ? spec.local.value
            : spec.local.name,
        });
      });

      // Case 2: export const hello = 5;
      if (node.declaration && node.declaration.type === "VariableDeclaration") {
        node.declaration.declarations.forEach((decl) => {
          if (decl.id.type === "Identifier") {
            let value = null;

            if (decl.init) value = shell.cat(filepath).toString().slice(decl.init.start, decl.init.end);

            exports.push({
              file: filepath,
              source,
              exported: decl.id.name,
              local: decl.id.name,
              value,
            });
          }
        })
      }
    }
  });

  return exports;
};

(async () => {
  // Will terminate process if it fails.
  verifyPreReqs();

  // Get users answers to queries.
  // Master list entry returned should already contain 
  // all non export keys.
  const { general, masterListEntry } = await retrieveDataFromUser();
  const algorithmId = general.algorithmId;
  const algorithmCopy = algorithms[general.algorithmCopy];

  // Create a new branch for this algorithm
  const branchName = `add_${algorithmId}`;
  const result = shell.exec(`git switch -c ${branchName}`, { silent: true });

  if (result.code !== 0) {
    console.error(
      `Unexpected error: failed to switch to branch '${branchName}'.\n` +
      `This should not happen because verifyPreReqs() already confirmed a clean working tree.\n` +
      `Git says: ${result.stderr.trim() || "unknown error"}\n` +
      `Aborting to prevent any filesystem changes.`
    );
    process.exit(1);
  } else {
    console.log(`Switched to new branch: ${branchName}`);
  }
  
  // If something errors later on switch back to original branch
  // and delete the just created branch.
  const cleanupBranch = () => {
    shell.exec("git switch -", { silent: true });
    shell.exec(`git branch -D ${branchName}`, { silent: true });
  };

  // In case of error we do not want to update the files/file system
  // on the fly. Cache the data and execute the commands at the end.
  const cpCache = [];     // [srcFile, dstFile]
  const exportCache = []; // [exportString, fileToInsertInto]

  for (const [key, def] of Object.entries(DATA.exports)) {
    const indexFile = path.join(def.dir, "index.js");

    // Get all export line metadata from the index.js file
    const exportsInFile = getExportsFromFile(indexFile);

    // Pseudocode and Controller have an object of export keys
    const exportKey = algorithmCopy[def.property];

    // Assumption that the export keys either directly have value
    // as the export or our objects with values 1 level deep as is seen
    // with pseudocode and controller.
    const wanted = typeof exportKey === "string"
      ? [exportKey]
      : Object.values(exportKey);

    // Need these to suffix on the mode to the filename to avoid
    // copying to an equivalent file
    const modes = typeof exportKey === "object" ? Object.keys(exportKey) : null;

    // Only keep relevant export line metadata
    const relevant = exportsInFile.filter((e) => wanted.includes(e.exported));

    relevant.forEach((exp, idx) => {
      if (exp.source) {
        // export ... from ...

        const dir = path.dirname(indexFile);
        let resolved = path.resolve(dir, exp.source);
        if (!path.extname(resolved)) resolved += ".js";
        const ext = path.extname(resolved);

        // If multiple exports, append the mode to export.
        // Also append to new filename to avoid clashes.
        const suffix = modes ? `_${modes[idx]}` : "";

        const newFile = path.join(dir, `${algorithmId}${suffix}${ext}`);

        if (!shell.test("-f", resolved)) {
          console.error(`Warning: source file not found -> ${resolved}`);
          cleanupBranch();
          process.exit(1);
        }

        const newExported = `${algorithmId}${suffix}`;

        const alreadyExists = exportsInFile.some((e) => e.exported === newExported);
        if (alreadyExists) {
          console.error(`Error: Duplicate export detected in ${indexFile}: ${newExported}`);
          cleanupBranch();
          process.exit(1);
        }

        cpCache.push([resolved, newFile]);
        exportCache.push([
          `export { ${exp.local} as ${newExported} } from './${algorithmId}${suffix}${ext}';\n`,
          indexFile,
        ]);
        
        if (typeof exportKey !== "string") {
          // multiple (controllers, pseudocode, etc.)
          if (!masterListEntry[algorithmId][def.property]) masterListEntry[algorithmId][def.property] = {};
          masterListEntry[algorithmId][def.property][modes[idx]] = newExported;
        } else {
          // single (paramKey, explanationKey, etc.)
          masterListEntry[algorithmId][def.property] = newExported;
        }

      } else {
        // export const foo = "bar" form

        // Not needed at time of writing but left for future.
        const suffix = modes ? `_${modes[idx]}` : "";
        const newExported = `${algorithmId}${suffix}`;

        const alreadyExists = exportsInFile.some((e) => e.exported === newExported);
        if (alreadyExists) {
          cleanupBranch();
          console.error(`Error: Duplicate export detected in ${indexFile}: ${newExported}`);
          process.exit(1);
        }

        exportCache.push([
          `export const ${newExported} = ${exp.value};\n`,
          indexFile,
        ]);

        // Again, not needed, but left for future.
        if (typeof exportKey !== "string") {
          // multiple (controllers, pseudocode, etc.)
          if (!masterListEntry[algorithmId][def.property]) masterListEntry[algorithmId][def.property] = {};
          masterListEntry[algorithmId][def.property][modes[idx]] = newExported;
        } else {
          // single (paramKey, explanationKey, etc.)
          masterListEntry[algorithmId][def.property] = newExported;
        }
      }
    });
  }

  // No errors, modify the file system.
  cpCache.forEach(([src, dest]) => {
    shell.cp(src, dest);
    console.log("Copied:", src, "->", dest);
  });

  exportCache.forEach(([line, file]) => {
    let content = shell.cat(file).toString();

    // If file doesn't end with a newline, add one
    // script broke if someone did export const x = 5 (no newline)
    if (!content.endsWith("\n")) {
      shell.ShellString("\n").toEnd(file);
    }

    shell.ShellString(`${line}\n`).toEnd(file);
    console.log("Inserted into", file, ":", line.trim());
  });


  // Insert new entry into master list,
  // probably a way you could do this with babel
  // and variable name to avoid the need to create the markers in
  // masterList.js cba going through the docs to figure
  // it out.
  let s = JSON.stringify(masterListEntry, null, 2);
  // Remove outer { ... }
  s = "\t" + s.slice(1, -1).trim();
  let src = shell.cat(MASTER_LIST_PATH).toString();
  // TODO: Windows carriage return quirks?
  const updated = src.replace(
    /(\/\/_MASTER_LIST_START_\n[\s\S]*?)\n\};\n(\/\/_MASTER_LIST_END_)/,
    `$1\n\n${s},\n};\n$2`
  );

  // Overwrite the file
  shell.ShellString(updated).to(MASTER_LIST_PATH);
  console.log(`Inserted entry ${s} into the master list.`);
  
  // Make the git commit
  const filesToCommit = [
    ...cpCache.map(([_, dest]) => dest),
    ...exportCache.map(([_, file]) => file),
    MASTER_LIST_PATH,
  ];

  shell.exec(`git add ${filesToCommit.join(" ")}`);
  shell.exec(`git commit -m "Adding new algorithm: ${masterListEntry[algorithmId].name}, files will contain ${algorithmCopy.name}'s source code."`);

  rl.close();
})();