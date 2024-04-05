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
    const result = f(visualisers, ...args);
    return result;
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
  // bookmark relates to the number directly after the \\B notation in the psuedocode
  // recursionLevel used for recursive algorithms so we can skip over
  // collapsed recursive calls
  add(bookmark, func, values, recursionLevel=0) {
    let bookmarkValue = '';
    let pauseInCollapse = false;
    if (typeof bookmark === 'object') {
      bookmarkValue = bookmark.bookmark;
      pauseInCollapse = bookmark.pauseInCollapse;
    } else {
      bookmarkValue = bookmark;
    }
    this.chunks.push({
      bookmark: String(bookmarkValue),
      mutator: defer(func, clone(values)),
      pauseInCollapse,
      recursionLevel,
    });
  }

  isValidChunk(currentChunk) {
    return currentChunk >= 0 && currentChunk <= this.chunks.length;
  }

  // Returns sorted array of visualizer instances
  getVisualisers() {
    return Object.values(this.visualisers)
      .sort((a, b) => a.order - b.order)
      .map((o) => o.instance);
  }

  // Applies chunk at index, this applies its mutation to the visualisers, updating them
  doChunk(index) {
    // XXX in Warshall's this is called with this.chunks undefined -
    // Repeatable: run warshall's to completion with everything
    // collapsed then expand everything - refresh() is called - see
    // algorithms/controllers/transitiveClosureCollapseChunkPlugin.js
    // Not sure why - works ok for intermediate states typically.  Might
    // be that ChunkNum goes out of range at end
    this.chunks[index].mutator(
      Object.fromEntries(
        Object.entries(this.visualisers).map(([k, v]) => [k, v.instance])
      )
    );
  }

  checkChunkPause() {
    let nextIndex = -1;
    if (this.currentChunk === null) {
      nextIndex = 0;
    } else if (
      this.currentChunk >= 0 &&
      this.currentChunk <= this.chunks.length - 2
    ) {
      nextIndex = this.currentChunk + 1;
    } else if (this.currentChunk === this.chunks.length - 1) {
      nextIndex = this.currentChunk + 1;
    }
    if (nextIndex === -1) return false;
    if (!this.chunks[nextIndex]) return false;
    return this.chunks[nextIndex].pauseInCollapse;
  }

  // Applies next chunks mutation
  next(triggerPauseInCollapse = false) {
    const pauseInCollapse = this.checkChunkPause();
    if (!pauseInCollapse) {
      if (this.currentChunk === null) {
        this.visualisers = this.init();
        this.doChunk(0);
        this.currentChunk = 0;
      } else if (
        this.currentChunk >= 0 &&
        this.currentChunk <= this.chunks.length - 2
      ) {
        this.doChunk(this.currentChunk + 1);
        this.currentChunk += 1;
      } else if (this.currentChunk === this.chunks.length - 1) {
        // XXX do we really want to get out of range??? It's used
        // to trigger finished for some reason but causes other
        // potential problems we need to work around.
        this.currentChunk += 1;
      }
    } else if (!triggerPauseInCollapse) {
      this.doChunk(this.currentChunk + 1);
      this.currentChunk += 1;
    }
    if (this.currentChunk < this.chunks.length) {
      return {
        bookmark: this.chunks[this.currentChunk].bookmark,
        finished: false,
        pauseInCollapse,
      };
    }
    return {
      bookmark: this.chunks[this.currentChunk - 1].bookmark,
      finished: true,
      pauseInCollapse,
    };
  }

  // Goes back one chunk, undoing last mutation
  // XXX probably better to have a gotoChunk(c) function - prev() gets
  // called repeatedly for collapsed code, resulting on O(N^2)
  // complexity; Maybe goBackTo() and goForwardTo() due to _inPrevState
  // flag (used in controllers/transitiveClosureCollapseChunkPlugin.js
  // for some mysterious reason)
  prev() {
    this._inPrevState = true;
    if (this.currentChunk > 0) {
      this.visualisers = this.init();
      // console.log(['prev()', this.currentChunk]);
      for (let i = 0; i <= this.currentChunk - 1; i += 1) {
        this.doChunk(i);
      }
      this.currentChunk -= 1;
    }
    this._inPrevState = false;
    return {
      bookmark: this.chunks[this.currentChunk].bookmark,
      finished: false,
    };
  }

  // Returns previous chunk, but doesn't undo last mutation
  prevChunk(currentChunk) {
    const chunkNum = (currentChunk > 0? currentChunk-1 : 0);
    return {
      bookmark: this.chunks[chunkNum].bookmark,
      chunk: chunkNum,
    };
  }

  // Goes back to given chunk, undoing mutations
  goBackTo(chunkNum) {
    this._inPrevState = true;
    this.visualisers = this.init();
    // console.log(['prev()', chunkNum]);
    for (let i = 0; i <= chunkNum; i += 1) {
      this.doChunk(i);
    }
    this.currentChunk = chunkNum;
    this._inPrevState = false;
    return {
      bookmark: this.chunks[this.currentChunk].bookmark,
      finished: false,
    };
  }

  refresh() {
    // if we have gone to the end, currentChunk needs adjusting
    if (this.currentChunk >= this.chunks.length-1) {
      this.currentChunk = this.chunks.length-1;
    }
    // console.log(["refresh", this.currentChunk]);
    if (this.currentChunk > 0) {
      this.visualisers = this.init();
      for (let i = 0; i <= this.currentChunk; i += 1) {
        this.doChunk(i);
      }
      // this.currentChunk -= 1; // WTF ?????
    }
  }
}
