/*
A chunk is a delta from one state of animation to the next. It consists primarily of
a function that, when applied, mutates one state into the next.
 */

/* Because of javascript's lexical scoping in closures and lack of block scope,
   this function allows us to save the value of a variable and provide it to the mutator
   even if the original variable in the algorithm has changed.
 */
function defer(f, v) {
  const args = v || [];
  if (!f) {
    return () => undefined;
  }
  return () => f(...args);
}

export default class {
  constructor() {
    this.chunks = [];
  }

  // values is a list of arguments passed to func when it is called to perform its task.
  add(bookmark, func, values) {
    this.chunks.push({
      bookmark,
      mutator: defer(func, values),
    });
  }
}
