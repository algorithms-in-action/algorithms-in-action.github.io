/* eslint-disable no-else-return */

// The purpose of this function is find the bookmark belongs to which expanded code block
export default function findCodeBlock(algorithm, bookmark) {
  for (const codeblock of Object.keys(algorithm.pseudocode)) {
    for (const line of algorithm.pseudocode[codeblock]) {
      if (line.bookmark === bookmark) {
        if (algorithm.collapse[codeblock] === true) {
          return bookmark;
        } else {
          return findCodeBlock(algorithm, line.refBookmark);
        }
      }
    }
  }
  return 0;
}
