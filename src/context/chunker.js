/*
A chunk is a delta from one state of animation to the next. It consists primarily of
a function that, when applied, mutates one state into the next.
 */

/* Because of javascript's lexical scoping in closures and lack of block scope,
   this function allows us to save the value of a variable and provide it to the mutator
   even if the original variable in the algorithm has changed.
   Furthermore, it always expects the visualisers as a first implicit argument.
 */
function defer(f, v) {
  const args = v || [];
  if (!f) {
    return () => undefined;
  }
  return (visualisers) => f(visualisers, ...args);
}

export default class {
  constructor(initfn) {
    this.chunks = [];
    this.visualisers = {};
    this.init = initfn;
    this.currentChunk = null;
  }

  // values is a list of arguments passed to func when it is called to perform its task.
  add(bookmark, func, values) {
    this.chunks.push({
      bookmark,
      mutator: defer(func, values),
    });
  }

  getVisualisers() {
    return Object.values(this.visualisers)
      .sort((a, b) => a.order - b.order)
      .map((o) => o.instance);
  }

  next() {
    if (this.currentChunk === null) {
      this.visualisers = this.init();
      this.currentChunk = 0;
    }
    this.chunks[this.currentChunk].mutator(Object.fromEntries(Object.entries(this.visualisers)
      .map(([k, v]) => [k, v.instance])));
    this.currentChunk += 1;
    return this.chunks[this.currentChunk].bookmark;
  }

  prev() { }
}
