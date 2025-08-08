// standalone JS - needs Node.js installed; run with
// node <thisfile>
//
// Idea here is to have a program that helps with creation of a new AIA
// algorithm module.  Reads in the algorithm name and an ID used internally
// in code, filenames, etc.  Output unix commands to create all the extra files
// (currently copy the heapsort files; they will need to be edited for the
// new algorithm), plus some snippets of code and indications of where to
// put them so we can mostly copy+paste.
// XXX It would be nice to be able to say what algorithm to copy (not Heapsort)
// and input algCat but filenames are not really consistent enough currently.

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// XXX there must be a better way to input a couple of things then call a
// function with them as the arguments...

let algName;
let algID;
let algCat = 'Sort';
console.log("What's the name of your new algorithm used in menus etc, eg 2-3-4 Tree? ");

rl.on('line', (line) => {
  if (!algName) {
    algName = line.trim();
    console.log("What's the ID of your new algorithm used in code, eg tree_234?  ");
  } else {
    algID = line.trim();
    // XXX Best check for alpha first char then alphanumeric + _ only
    doIt(algName, algID);
    process.exit(0);
  }
});

rl.on('close', () => {
  console.log('Exiting...');
  process.exit(0);
});

// let devBranch = "<development branch>"
let devBranch = "2025_sem2" // XXX

let doIt = (algName, algID) => {
    console.log("");
    console.log("Guide to adding algorithm named " + algName + " with ID " + algID);
    console.log("(best save this in a file and keep track of your progress)");
    console.log("If you follow these steps exactly (recommended) your new algorithm");
    console.log("will initially be a copy of Heapsort (you can then edit it as desired).");
    console.log("It will not appear in algorithm menus but can be accessed via the URL.");
    console.log("<base URL>/alg=" + algID + "&mode=sort");
    console.log("");
    console.log("Execute the following commands from the AIA repository directory:");
    console.log("");
    console.log("git switch " + devBranch + "; git pull");
    console.log("git switch -c add_" + algID);
    console.log("");
    console.log("cp src/algorithms/controllers/heapSort.js src/algorithms/controllers/" + algID + ".js");
    console.log("git add src/algorithms/controllers/" + algID + ".js");
    console.log("cp src/algorithms/pseudocode/heapSort.js src/algorithms/pseudocode/" + algID + ".js");
    console.log("git add src/algorithms/pseudocode/" + algID + ".js");
    console.log("cp src/algorithms/parameters/HSParam.js src/algorithms/parameters/" + algID + ".js");
    console.log("git add src/algorithms/parameters/" + algID + ".js");
    console.log("cp src/algorithms/explanations/HSExp.md src/algorithms/explanations/" + algID + ".md");
    console.log("git add src/algorithms/explanations/" + algID + ".md");
    console.log("cp src/algorithms/extra-info/HSInfo.md src/algorithms/extra-info/" + algID + ".md");
    console.log("git add src/algorithms/extra-info/" + algID + ".md");
    console.log("echo \"export const " + algID + " = sortInstructions;\" >> src/algorithms/instructions/index.js");
    console.log("The files above (and others) will need to be edited during development");
    console.log("but best defer that until after you have added the new algorithm");
    console.log("");
    console.log("echo \"export { default as " + algID + "} from './" + algID + "'\" >> src/algorithms/controllers/index.js");
    console.log("echo \"export { default as " + algID + "} from './" + algID + ".md'\" >> src/algorithms/explanations/index.js");
    console.log("echo \"export { default as " + algID + "} from './" + algID + ".md'\" >> src/algorithms/extra-info/index.js");
    console.log("echo \"export { default as " + algID + "} from './" + algID + "'\" >> src/algorithms/parameters/index.js");
    console.log("echo \"export { default as " + algID + "} from './" + algID
+ "'\" >> src/algorithms/pseudocode/index.js");
    console.log("");
    console.log("Edit src/algorithms/index.js to add the following to the allalgs definition:");
    console.log("  '" + algID + "': {");
    console.log("    name: '" + algName + "',");
    console.log("    noDeploy: false,");
    console.log("    category: 'Sort',");
    console.log("    explanation: Explanation." + algID + ",");
    console.log("    param: <Param." + algID + "/>,");
    console.log("    instructions: Instructions." + algID + ",");
    console.log("    extraInfo: ExtraInfo." + algID + ",");
    console.log("    pseudocode: {");
    console.log("      sort: Pseudocode." + algID + ",");
    console.log("    },");
    console.log("    controller: {");
    console.log("      sort: Controller." + algID + ",");
    console.log("    },");
    console.log("  },");
    // XXX ...
    console.log("Note: above may change when code for algorithm index generation is modified");
    console.log("");
    console.log("Make sure the system compiles and existing algorithms run OK");
    console.log("and you new algorithm (accessed via the URL) behaves as Heapsort.");
    console.log("This may require checking and re-working some of the steps above.");
    console.log("");
    console.log("git commit -a -m 'Adding new algorithm: " + algID + "'");
    console.log("git switch " + devBranch + "; git pull");
    console.log("");
    console.log("Cross your fingers and hope nobody else has made conflicting changes.");
    console.log("If you do the steps above quickly, conflicts are less likely.");
    console.log("");
    console.log("git merge add_" + algID);
    console.log("");
    console.log("Resolve any conflicts (eg add extra code of yours plus others).");
    console.log("Note: here and elsewhere when multiple files are changed, there may");
    console.log("be spurious compile errors. npm recognises when (some) files are modified");
    console.log("and incrementally recompiles but appears not to handle importing properly.");
    console.log("You may need to stop the npm process and resart it with a fresh recompile.");
    console.log("");
    console.log("git commit -a; git push");
    console.log("");
    console.log("Congratulations! The main repository " + devBranch + " now has your new algorithm.");
    console.log("You should probably also push your branch to the main repository:");
    console.log("git switch " + algID + "; git merge " + devBranch);
    console.log("git git push --set-upstream origin " + algID);
    console.log("");
    console.log("If others are working on " + devBranch + ", best merge any changes as soon as possible.");
    console.log("");
    console.log("");
}

/*
let algName = "";
let algID = "";
rl.question("What's the name of your new algorithm (eg Union Find)?  ", function(answer) {
    algName = answer;
    rl.question("What's the ID of your new algorithm (eg unionFind)?  ", function(answer) {
       algID = answer;
   });
   process(algName, algID);
   rl.close();
});

/*
rl.question("What's the ID of your new algorithm (eg unionFind)?  ", function(answer) {
   algID = answer;
   // console.log("Hello " + answer);
   rl.close();
});
*/




