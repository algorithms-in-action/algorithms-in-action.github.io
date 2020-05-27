export default function (procedure, bookmark) {
  for (const line of procedure) {
    if (line.bookmark === bookmark.step) {
      return line;
    }
  }
  return null;
}
