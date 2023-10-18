# How to create a new algorithm

Please follow the below checklist to create a new algorithm, note that you should replace `algorithm` with the name of your algorithm in camelCase and that all referenced directories are located in [`/src/algorithms`](/src/algorithms).

- [ ] Create a new controller `algorithm.js` and `algorithm.test.js` for the algorithm in [`controllers`](/src/algorithms/controllers). See other files in the directory for examples. Then make sure you link the controller in [`controllers/index.js`](/src/algorithms/controllers/index.js).
- [ ] Create a new `algorithmExp.md` file in [`explanations`](/src/algorithms/explanations) and link it in [`explanations/index.js`](/src/algorithms/explanations/index.js).
- [ ] Create a new `algorithmInfo.md` file in [`extra-info`](/src/algorithms/extra-info) and link it in [`extra-info/index.js`](/src/algorithms/extra-info/index.js).
- [ ] Create new instructions for the algorithm in [`instructions/index.js`](/src/algorithms/instructions/index.js).
- [ ] Create a new `algorithmParam.js` file in [`parameters`](/src/algorithms/parameters) and link it in [`parameters/index.js`](/src/algorithms/parameters/index.js).
- [ ] Copy pseudocode provided by academics into [`pseudocode`](/src/algorithms/pseudocode) and link it in [`pseudocode/index.js`](/src/algorithms/pseudocode/index.js). Make note of the use of bookmarks `\B` which is similar to a frame in a video. It is used to highlight the current line of pseudocode.
- [ ] Add all the newly added files to the [`index.js`](/src/algorithms/index.js) file in the root of the [`/src/algorithms`](/src/algorithms) directory.
