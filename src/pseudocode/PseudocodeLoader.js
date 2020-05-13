
const PROCEDURE_MARKER = 'procedure';
const DEFAULT_PROCEDURE = 'run';

// const lineRegex = /([^$]*)(?:\$([^(]+))? *(?:\(\*(.*)\*\))/;
const lineRegex = /([^$]*)/;

/*
 Takes a line of pseudocode file and returns the name of the procedure
 declared in it, if any.

 Returns false if the line is not a procedure declaration.
 */
function extractProcedureName(line) {
  const procRegex = RegExp(`^ *${PROCEDURE_MARKER} +([-_A-Za-z]+)`);
  const matches = line.match(procRegex);
  if (matches && matches[1]) {
    return matches[1];
  }
  return false;
}

export default function parse(rawPseudocode) {
  const lines = rawPseudocode.split('\n');
  // Create a default procedure, used if one isn't declared in the pseudocode
  const procedures = { [DEFAULT_PROCEDURE]: [] };

  let currentProcedureName = DEFAULT_PROCEDURE;
  for (const line of lines) {
    const matches = line.match(lineRegex);
    const procedureName = extractProcedureName(matches[1]);
    if (procedureName && !(procedureName in procedures)) {
      procedures[procedureName] = [];
      currentProcedureName = procedureName;
    }
    const lineObj = {
      code: matches[1],
      bookmark: matches[2],
      explanation: matches[3],
    };
    procedures[currentProcedureName].push(lineObj);
  }
  if (procedures[DEFAULT_PROCEDURE].length === 0) {
    delete procedures[DEFAULT_PROCEDURE];
  }
  return procedures;
}
