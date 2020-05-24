export function findBookmarkInProcedure(procedure, bookmark) {
  for (const line of procedure) {
    if (line.bookmark === bookmark) {
      return line;
    }
  }
  return null;
}

export function findFirstBookmarkInProcedure(procedure) {
  for (const line of procedure) {
    if (line.bookmark) {
      return line.bookmark;
    }
  }
  return null;
}

export function nextBookmark(procedure, currentBookmark) {
  let foundStart = false;
  for (const line of procedure) {
    if (foundStart && line.bookmark) {
      return line.bookmark;
    }
    if (line.bookmark === currentBookmark) {
      foundStart = true;
    }
  }
  return null;
}
