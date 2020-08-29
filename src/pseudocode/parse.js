/* eslint-disable no-param-reassign */
/* eslint-disable linebreak-style */
/* eslint-disable dot-notation */
/* eslint-disable linebreak-style */
// Remove the space before and after the pseudocode
function removeLineContinuation(input) {
  const lines = input.split('\n');
  const output = [];
  let builtLine = '';
  for (const line of lines) {
    builtLine = `${line.trim()}`;
    if (builtLine.indexOf('//') >= 0) {
      builtLine = builtLine.substring(0, builtLine.indexOf('//'));
    }
    if (builtLine !== '') {
      output.push(builtLine);
    }
  }
  return output;
}


// Extract the /Code {} section from pseudocode
function extractCode(lines) {
  const jsons = [];
  let json = {};
  let explanation = '';
  let explFlag = false;
  let ind = 0;
  for (const line of lines) {
    if (line.localeCompare('\\In{') === 0) {
      ind += 1;
    } else if (line.localeCompare('\\In}') === 0) {
      ind -= 1;
    } else if (line.indexOf('\\Expl{ ') >= 0) {
      explFlag = true;
      explanation = '';
      explanation += line.substring(7, line.length);
    } else if (line.localeCompare('\\Expl}') === 0) {
      explFlag = false;
      if (Object.keys(json).length !== 0) {
        json['explanation'] = explanation;
      }
      explanation = '';
    } else if (explFlag) {
      explanation += ' ';
      explanation += line;
    } else {
      if (Object.keys(json).length !== 0) {
        jsons.push(json);
        json = {};
      }
      if (line.indexOf(' \\Ref ') >= 0) {
        json['code'] = line.substring(0, line.indexOf(' \\Ref '));
        json['ref'] = line.substring(line.indexOf(' \\Ref ') + 6, line.length);
      } else {
        json['code'] = line;
        json['ref'] = '';
      }
      json['explanation'] = '';
      json['indentation'] = ind;
    }
  }
  if (Object.keys(json).length !== 0) {
    jsons.push(json);
  }
  return jsons;
}


// For exch code block, in other words /Code {} section,
// extract the code, explanation, indentation and reference information.
function extractCodeBlock(lines) {
  let codeBlock = 'Default';
  const json = {};
  let value = [];
  let codeFlag = false;
  let blockFlag = false;
  for (const line of lines) {
    if (line.localeCompare('\\Code}') === 0) {
      json[codeBlock] = extractCode(value);
      value = [];
      codeFlag = false;
    } else if (line.localeCompare('\\Code{') === 0) {
      codeFlag = true;
      blockFlag = true;
    } else if (codeFlag === true) {
      if (blockFlag) {
        codeBlock = line;
        blockFlag = false;
      } else {
        value.push(line);
      }
    }
  }
  return json;
}

// Global value in this class scope for counting the bookmark.
let c = 0;


// Add bookmark and indentation recurvely.
function addBookmark(json, name, indentation, refBookmark) {
  if (json[name] instanceof Array) {
    json[name].forEach((line) => {
      c += 1;
      line['indentation'] += indentation;
      if (line['ref'].length > 0) {
        const tempBookmark = c;
        line['bookmark'] = c;
        line['refBookmark'] = refBookmark;
        addBookmark(json, line['ref'], line['indentation'], tempBookmark);
      } else {
        line['bookmark'] = c;
        line['refBookmark'] = refBookmark;
      }
    });
  }
}

export default function parse(input) {
  const rawCode = removeLineContinuation(input);
  const json = extractCodeBlock(rawCode);
  c = 0;
  addBookmark(json, 'Main', 0, 0);
  return json;
}
