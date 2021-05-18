/* eslint-disable no-console */
/* eslint-disable no-else-return */
/* eslint-disable dot-notation */
/* eslint-disable linebreak-style */
// Remove the space before and after the pseudocode
function removeLineContinuation(input) {
  const lines = input.split('\n');
  const output = [];
  let builtLine = '';
  for (const line of lines) {
    builtLine = `${line.trim()}`;
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
      } else if (line.indexOf(' \\B ') >= 0) {
        json['code'] = line.substring(0, line.indexOf(' \\B '));
        json['bookmark'] = line.substring(line.indexOf(' \\B ') + 4, line.length);
        // json['ref'] = '';
      } else {
        json['code'] = line;
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


// For each code block, in other words /Code {} section,
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

function addIndentation(originalBlocks, blockName, baseIndent, outputBlocks) {
  let indentedLine;
  // eslint-disable-next-line no-param-reassign
  outputBlocks[blockName] = [];
  originalBlocks[blockName].forEach((line) => {
    indentedLine = '\xa0\xa0\xa0\xa0'.repeat(baseIndent + line['indentation']) + line['code'];
    outputBlocks[blockName].push({ ...line, code: indentedLine });
    if (line['ref']) {
      addIndentation(originalBlocks, line['ref'], baseIndent + line['indentation'], outputBlocks);
    }
  });
}

export default function parse(input) {
  const rawCode = removeLineContinuation(input);
  const rawCodeBlocks = extractCodeBlock(rawCode);
  if (Object.keys(rawCodeBlocks).length > 0) {
    const indentedCodeBlocks = {};
    addIndentation(rawCodeBlocks, 'Main', 0, indentedCodeBlocks);
    // console.log(indentedCodeBlocks);
    return indentedCodeBlocks;
  } else {
    return rawCodeBlocks;
  }
}
