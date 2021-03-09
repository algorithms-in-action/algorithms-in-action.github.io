# Algorithms in Action

This is the forked repository of algorithms-in-action/algorithms-in-action.github.io for the teams working on this application during SEM 1 COMP90082_2021 Software Project subject. 

Check out the live site: [https://algorithms-in-action.github.io/](https://algorithms-in-action.github.io/)

## Development
Algorithms in Action is written in JavaScript, using the [React](https://reactjs.org/)
framework. To work on it locally, you will need to install
[Node.js](https://nodejs.org/en/download/) on your computer.

Node.js (sometimes just called "node") is a JavaScript-based web server that will allow us
to view the website locally. This will also install npm, a multipurpose tool that will
install 3rd party dependencies, start the app and run test suites.

Many modern text editors have good support for JavaScript development. If you are using
IntelliJ, this code base is already an IntelliJ project you can open. Visual Studio Code
is another good alternative.

### First-time Setup
1. `cd aia` to enter into the project directory.
2. Run `npm install`. This downloads all the 3rd party code needed.
3. Install the **ESLint** extension in your favorite code editor.

Use VS Code as an example:
1. Go to market place and search ESLint extension
2. Install it
3. Close and reopen VS Code
4. Intentionally write some code in `App.jsx` that violates the [Airbnb Style rules](https://github.com/airbnb/javascript/blob/master/react/README.md), for example, replace `import './App.css';` with `import "./App.css";`, i.e. use double quotes. If you see an error saying that `Strings must use singlequote.eslint(quotes)`, then your ESLint setup is successful.

If you use other code editors, such as WebStorm, you can follow this [doc](https://www.jetbrains.com/help/webstorm/eslint.html).


### Running the Program
`cd aia` to enter into the project directory, run `npm start`. This will start a web server on your computer.
If it doesn't automatically open a web browser tab, go to http://localhost:3000 to see the
project.

### Test the Program
Currently, we use [Jest](https://jestjs.io/docs/en/getting-started) as the testing framework to test React application. [Create-React-App](https://create-react-app.dev/) is already use and ships with Jest.

#### Writing Tests

Follow [Jest official doc](https://jestjs.io/docs/en/using-matchers) to see examples and APIs.

#### Running Tests

Check out [Create-React-App Running Tests](https://create-react-app.dev/docs/running-tests/#docsNav) for detailed information.

Run Jest:
> `npm test`

It will launch in [watch mode](https://jestjs.io/docs/en/cli.html#--watch). Every time you save a file, it will re-run the tests. Note that, by default, Jest will only run the tests related to files changed since the last commit. 

Coverage Reporting:
> `npm test -- --coverage`

It will run tests and generate a [coverage report](https://medium.com/@krishankantsinghal/how-to-read-test-coverage-report-generated-using-jest-c2d1cb70da8b). Note that the `coverageThreshold` can be configured in `package.json`.


### Sync the Repository
To synchronize the repository at [Gitlab](https://gitlab.eng.unimelb.edu.au/lceddia/aia), simply run `git pull upstream master`.

### Deploy the Program
Simply run `npm run deploy`.

Note that in this repository, `Dev` is the default branch, while `master` is the deployment branch that stores build files.
