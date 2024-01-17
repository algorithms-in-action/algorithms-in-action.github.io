/**
 * Retrieves a specific line from a pseudocode procedure based on a bookmark.
 *
 * @param {Object} procedure - Pseudocode with keys as code blocks and values as line arrays.
 * @param {string} bookmark - Identifier for a specific line in the pseudocode.
 *
 * @returns {Object} Line object associated with the bookmark, often with an 'explanation'.
 * @throws {Error} When the specified bookmark isn't found.
 */
export default function (procedure, bookmark) {
  for (const codeblock of Object.keys(procedure)) {
    for (const line of procedure[codeblock]) {
      if (line.bookmark === bookmark) {
        return line;
      }
    }
  }
  throw new Error(`Bookmark ${bookmark} does not exist`);
}
