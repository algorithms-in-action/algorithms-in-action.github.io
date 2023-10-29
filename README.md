# Algorithms in Action

![license](https://img.shields.io/badge/license-MIT-Green) ![node](https://img.shields.io/badge/node-v18.17.1-blue) ![npm](https://img.shields.io/badge/npm-v9.6.7-blue)

Welcome to Algorithms In Action!

Here is the [link](https://algorithms-in-action.github.io/) to run the algorithm visualiser on your browser.

We recommend you read the [WIKI](https://github.com/algorithms-in-action/algorithms-in-action.github.io/wiki) for more project details.

- [Algorithms in Action](#algorithms-in-action)
  - [Project Description](#project-description)
  - [Development History](#development-history)
  - [Developer](#developer)
    - [Start Up](#start-up)
    - [Deployment](#deployment)
      - [Environment Setup](#environment-setup)
      - [Install Dependencies](#install-dependencies)
      - [Start a local server](#start-a-local-server)
    - [Branch Management](#branch-management)
    - [Folder Organisation](#folder-organisation)
  - [License](#license)

## Project Description

Algorithms in Action (AIA) is an animation software tool, developed for the purposes of teaching computer science algorithms by Linda Stern, Lee Naish, and Harald Søndergaard at The University of Melbourne. AIA features animation, pseudocode, and textual explanations, run in coordinated fashion. A key feature of AIA, not found in other algorithm animations, is that students can view an algorithm at varying levels of detail. Starting with a high level pseudocode description of the algorithm, with accompanying high level animation and textual explanation, students can expand sections of the pseudocode to expose more detail. Animation and explanation are controlled in coordinate fashion, becoming correspondingly more detailed as the pseudocode is expanded. The rationale for various features of AIA and results from students using the program were reported in the paper <sup>[1]</sup>.

> [1] Stern, L., Søndergaard, and Naish, L., A Strategy for Managing Content Complexity in Algorithm Animation, *Proceedings of the Fourth Annual SIGCSE/SIGCUE Conference on Innovation and* *Technology in Computer Science Education (ITiCSE99),* Cracow, Poland, ACM Press, 127-130, 1999.

## Development History

The original AIA eventually had modules for some 24 different algorithms, and was used by students at The University of Melbourne and elsewhere. It won two algorithm animation awards. With advances in web technology and changing versions of languages, libraries, and web browsers, the program became progressively slower and slower, and eventually was no longer usable.

Starting in 2020, the program has been redeveloped by successive groups of Software Engineering, Computer Science and IT students plus interns at The University of Melbourne, using the latest software tools. In the second half (second semester) of 2023 there was a significant change to some of the core modules to keep up with the latest version of Javascript, Python and the packages AIA relies on, plus a revamp of the github repository, including the [WIKI](https://github.com/algorithms-in-action/algorithms-in-action.github.io/wiki). The plan is to ensure the master branch and executable system hosted on github has only stable, high quality algorithm animations visible. The repository will also contain other algorithm animations at various stages of development. The three academics involved in the initial development are now retired but still supervise development; we would welcome contact with others who are interested in using and/or contributing to AIA.

The detail version history can be accessed in wiki: [Version History](https://github.com/algorithms-in-action/algorithms-in-action.github.io/wiki/Version-History).

## Developer

### Start Up

1. Clone the code
2. Run the project locally
3. Checkout to your personal branch
4. Make some modifications
5. Merge your code into target branch

### Deployment

Algorithms in Action is written in JavaScript, using the React framework. To work on it locally, you will need to install Node.js on your machine. Node.js is an open-source, cross-platform JavaScript runtime environment. NPM (Node package manager) is installed alongside when Node is installed. It is a multipurpose tool that will install 3rd party dependencies, start the app, and run test suites.

#### Environment Setup

Ensure you have node version 18.x and npm version 9.x or higher.

You may also need to install python 3.x for the project.

To verify, you can input the following command in your terminal or command line.

```bash
node --version && npm --version && python --version
```

#### Install Dependencies

Navigate to the **root directory of the project** and run npm to install all the dependencies in package.json

```bash
npm install
```

#### Start a local server

Navigate to the **root directory of the project** and run the following command `npm start` this will start the server on your local machine on port 3000. The application will be launched automatically in your default browser at http://localhost:3000

```bash
npm start
```

### Branch Management

Currently, this project use `dev` as main branch. The branch named like `dev-20YYSX` (20YY = year, X = semester number) will be development branch for new version. Only the development branch should be merged into main branch.

Therefore, if you are going to develop some new features or fix some bugs for the project, you should create a personal branch to write your code, and then merge your code into target branch.

You may need to check the WIKI for the [development manual](https://github.com/algorithms-in-action/algorithms-in-action.github.io/wiki/Development-Manual).

### Folder Organisation

| Name  | Description                                                |
| ----- | ---------------------------------------------------------- |
| ./src | Source code of the web app.                                |
| ./ui  | Contains all the images and graphics used for the project. |

## License

Algorithms-in-action/algorithms-in-action.github.io is licensed under the MIT License, a short and simple permissive license with conditions only requiring preservation of copyright and license notices.
