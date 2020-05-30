export default function (procedure, bookmark) {
  let count = 0;
  for (const line of procedure) {
    if (line.bookmark === bookmark) {
      return count;
    }
    count += 1;
  }
  return 1;
}