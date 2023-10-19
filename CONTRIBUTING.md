# Contributing to AiA

Hi there! 👋 We're thrilled that you'd like to contribute to AiA.

## Contents

- [Contributing to AiA](#contributing-to-aia)
  - [Contents](#contents)
  - [Directory structure](#directory-structure)
  - [Development setup](#development-setup)
    - [Requirements](#requirements)
      - [Node.js](#nodejs)
      - [Python](#python)
    - [Actual AiA setup](#actual-aia-setup)
    - [Start](#start)
  - [Development cycle](#development-cycle)
    - [Test suite](#test-suite)
  - [Create new algorithms](#create-new-algorithms)
  - [Report a bug](#report-a-bug)
  - [Propose a change](#propose-a-change)

## Directory structure

AiA is purely frontend code written in React.

The most important directories:

- [`/src/algorithms`](/src/algorithms) - Where the algorithms are implemented
- [`/src/components`](/src/components) - Where the React components are implemented
- [`/src/pseudocode`](/src/pseudocode) - How the pseudocodes are parsed

## Development setup

### Requirements

#### Node.js

[Node.js](https://nodejs.org/en/) version 18.17.1 or newer is required for development purposes.

#### Python

[Python](https://www.python.org/) version 3.9.6 or newer is required for development purposes.

### Actual AiA setup

> **IMPORTANT**: All the steps below have to get executed at least once to get the development setup up and running!

Now that everything AiA requires to run is installed, the actual AiA code can be
checked out and set up:

1. [Fork](https://guides.github.com/activities/forking/#fork) the AiA repository.

2. Clone your forked repository:

   ```bash
   git clone https://github.com/<your_github_username>/algorithms-in-action.github.io.git
   ```

3. Go into repository folder:

   ```bash
   cd algorithms-in-action.github.io
   ```

4. Add the original AiA repository as `upstream` to your forked repository:

   ```bash
   git remote add upstream https://github.com/algorithms-in-action/algorithms-in-action.github.io.git
   ```

5. Install all dependencies:

   ```bash
   npm install
   ```

### Start

To start AiA execute:

```bash
npm start
```

## Development cycle

While iterating on AiA code, you can run the following commands:

1. Start AiA:

   ```bash
   npm start
   ```

2. Hack, hack, hack
3. Check if everything still runs in production mode:

   ```bash
   npm run build
   npm install -g serve
   serve -s build
   ```

4. Create tests
5. Run all [tests](#test-suite):

   ```bash
   npm test
   ```

6. Commit code and [create a pull request](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)

### Test suite

The tests can be started via:

```bash
npm test
```

If you run into any trouble, please check the available [npm scripts](package.json) and the [Jest documentation](https://jestjs.io/docs/getting-started).

## Create new algorithms

Follow the instructions in the [algorithms README](/src/algorithms/README.md).

## Report a bug

If you'd like to report a bug, please [open an issue](https://github.com/algorithms-in-action/algorithms-in-action.github.io/issues).

## Propose a change

If you'd like to propose a change, please [open a pull request](https://github.com/algorithms-in-action/algorithms-in-action.github.io/pulls).
