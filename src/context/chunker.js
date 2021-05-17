const clone = require('rfdc')();
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
  return (visualisers) => {
    f(visualisers, ...args);
  };
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
      bookmark: String(bookmark),
      mutator: defer(func, clone(values)),
    });
  }

  isValidChunk(currentChunk) {
    return currentChunk >= 0 && currentChunk <= this.chunks.length;
  }

  getVisualisers() {
    return Object.values(this.visualisers)
      .sort((a, b) => a.order - b.order)
      .map((o) => o.instance);
  }

  doChunk(index) {
    this.chunks[index].mutator(Object.fromEntries(Object.entries(this.visualisers)
      .map(([k, v]) => [k, v.instance])));
  }

  next() {
    if (this.currentChunk === null) {
      this.visualisers = this.init();
      this.doChunk(0);
      this.currentChunk = 0;
    } else if (this.currentChunk >= 0 && this.currentChunk <= this.chunks.length - 2) {
      this.doChunk(this.currentChunk + 1);
      this.currentChunk += 1;
    } else if (this.currentChunk === this.chunks.length - 1) {
      this.currentChunk += 1;
    }
    if (this.currentChunk < this.chunks.length) {
      return {
        bookmark: this.chunks[this.currentChunk].bookmark,
        finished: false,
      };
    }
    return {
      bookmark: this.chunks[this.currentChunk - 1].bookmark,
      finished: true,
    };
  }

  prev() {
    if (this.currentChunk > 0) {
      this.visualisers = this.init();
      for (let i = 0; i <= this.currentChunk - 1; i += 1) {
        this.doChunk(i);
      }
      this.currentChunk -= 1;
    }
    return {
      bookmark: this.chunks[this.currentChunk].bookmark,
      finished: false,
    };
  }
}
