
const PROCEDURE_MARKER = 'procedure';
const DEFAULT_PROCEDURE = 'run';

const lineRegex = /([^$]*)(?:\$([^ ]+))?(?: *\(\*(.*)\*\))?/;
// Regex in detail:
// Pseudocode fragment, string of non-$ characters: ([^$]*)
// Optional bookmark, string of non-space characters with leading $: (?:\$([^ ]+))?
// Optional comment, string surrounded by (* *): (?: *\(\*(.*)(\*\)))?


/*
 Takes a line of pseudocode file and returns the name of the procedure
 declared in it, if any.

 Returns false if the line is not a procedure declaration.
 */
function extractProcedureName(line) {
  const procRegex = RegExp(`^ *${PROCEDURE_MARKER} +([-_A-Za-z0-9]+)`);
  const matches = line.match(procRegex);
  if (matches && matches[1]) {
    return matches[1];
  }
  return false;
}

/*
 Joins lines to remove any continuation, that is, (* *) across multiple lines.
 Returns the list of lines with no continuations.
 */
function removeLineContinuation(lines) {
  const output = [];
  let builtLine = '';
  let continuation = false;
  for (const line of lines) {
    // Fold space on continuation lines
    if (continuation) {
      builtLine += ` ${line.trim()}`;
    } else {
      builtLine += `${line.trimEnd()}`;
    }
    continuation = builtLine.includes('(*');
    if (builtLine.includes('*)')) {
      continuation = false;
    }
    if (!continuation) {
      output.push(builtLine);
      builtLine = '';
    }
  }
  return output;
}

/*
 Parse a pseudocode file contents into a map of procedures.
 Each procedure has a list of line objects, with each line having code,
 bookmark and explanation properties.
 Refer to the unit tests for examples of the data structure.
 */
export default function parse(rawPseudocode) {
  const lines = removeLineContinuation(rawPseudocode.split('\n'));
  // Create a default procedure, used if one isn't declared in the pseudocode
  const procedures = { [DEFAULT_PROCEDURE]: [] };

  let currentProcedureName = DEFAULT_PROCEDURE;
  for (const line of lines) {
    const matches = line.match(lineRegex);
    if (!matches) {
      continue; // Ignore line, it's garbage. TODO: Generate warning
    }
    const procedureName = extractProcedureName(matches[1]);
    if (procedureName && !(procedureName in procedures)) {
      procedures[procedureName] = [];
      currentProcedureName = procedureName;
    }
    const lineObj = {
      code: matches[1].trimRight(),
      bookmark: matches[2],
      explanation: matches[3] ? matches[3].trim() : undefined,
    };
    if (lineObj.code !== '') {
      procedures[currentProcedureName].push(lineObj);
    }
  }
  if (procedures[DEFAULT_PROCEDURE].length === 0) {
    delete procedures[DEFAULT_PROCEDURE];
  }
  return procedures;
}
