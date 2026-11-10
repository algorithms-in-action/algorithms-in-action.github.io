const splayDeletionToken = /^!-?\d+$/;

export function parseTreeInput(input, { allowDelete = false } = {}) {
  const tokens = (Array.isArray(input) ? input.join(',') : String(input))
    .replace(/\s+/g, '').split(',');
  return tokens.map(token => {
    const deletion = allowDelete && splayDeletionToken.test(token);
    if (!deletion && !/^\??-?\d+$/.test(token)) {
      throw new Error(`Invalid input: ${token || '(empty)'}. Use integers or ?integer for searches${allowDelete ? ', or !integer for deletion' : ''}.`);
    }
    const search = token.startsWith('?');
    const value = Number(search || deletion ? token.slice(1) : token);
    if (!Number.isSafeInteger(value)) {
      throw new Error(`Invalid input: ${token}. Use a safe integer.`);
    }
    return { type: search ? 'search' : deletion ? 'delete' : 'insert', value };
  });
}

export function treeInputTokens(input) {
  return parseTreeInput(input).map(({ type, value }) => (
    type === 'search' ? `?${value}` : String(value)
  ));
}

export function legacyTreeInput(list, mode, value) {
  const tokens = Array.isArray(list) ? [...list] : list ? String(list).split(',') : [];
  if (mode === 'search' && value !== '' && value !== null && value !== undefined) {
    tokens.push(`?${value}`);
  }
  return tokens;
}

export function reorderSplayInput(input, reorder) {
  const tokens = Array.isArray(input) ? input : input.split(',');
  if (!tokens.some(token => splayDeletionToken.test(String(token).replace(/\s+/g, '')))) {
    return reorder(input);
  }

  const result = [];
  let segment = [];
  tokens.forEach(token => {
    if (splayDeletionToken.test(String(token).replace(/\s+/g, ''))) {
      if (segment.length) result.push(...reorder(segment));
      result.push(token);
      segment = [];
    } else {
      segment.push(token);
    }
  });
  if (segment.length) result.push(...reorder(segment));
  return result;
}
