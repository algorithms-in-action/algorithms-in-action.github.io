// standalone JS - needs Node.js installed; run with node <filename>
//
// Idea here is to have a program that helps with creation of a new AIA
// algorithm module.  Reads in the algorithm name and an ID used internally
// in code, filenames, etc.  Output unix commands to create all the extra files
// (currently copy the heapsort files; they will need to be edited for the
// new algorithm), plus some snippets of code and indications of where to
// put them so we can just edit a bunch of files and mostly copy+paste.

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
console.log("What's the name of your new algorithm used in menus etc, eg 2-3-4 Tree? ");

rl.on('line', (line) => {
  if (!algName) {
    algName = line.trim();
    console.log("What's the ID of your new algorithm used in code, eg tree_234?  ");
  } else {
    algID = line.trim();
    doIt(algName, algID);
    process.exit(0);
  }
});

rl.on('close', () => {
  console.log('Exiting...');
  process.exit(0);
});


let doIt = (algName, algID) => {
    console.log("");
    console.log("To add algorithm named " + algName + " with ID " + algID + ":");
    console.log("Execute the following commands from the AIA repository directory:");
    console.log("cp src/algorithms/controllers/heapSort.js src/algorithms/controllers/" + algID + ".js");
    console.log("git add src/algorithms/controllers/" + algID + ".js");
    console.log("cp src/algorithms/pseudocode/heapSort.js src/algorithms/pseudocode/" + algID + ".js");
    console.log("git add src/algorithms/pseudocode/" + algID + ".js");
    console.log("echo \"export { default as " + algID + "} from './" + algID + "'\" >> src/algorithms/controllers/index.js");
    // XXX + other index.js files, explanations, extra-info, edit instructions
    console.log("");
    console.log("Edit src/algorithms/index.js to add to the allalgs definition; something like:");
    console.log("  '" + algID + "': {");
    console.log("    name: '" + algName + "',");
    console.log("    category: 'Sort',");
    // XXX ...
    console.log("...},");
    // XXX ...
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




