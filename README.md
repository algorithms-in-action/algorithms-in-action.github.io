# Algorithms in Action

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

### First Run
1. `cd aia` enter into the project directory
2. run `npm install`. This downloads all the 3rd party code needed
3. install **ESLint** extension in your favorite code editor

Use VS Code as an example:
1. go to market place and search ESLint extension
2. install it
3. close and reopen VS Code
4. intentionally write some code in `App.jsx` that violates the [Airbnb Style rules](https://github.com/airbnb/javascript/blob/master/react/README.md), for example, replace `import './App.css';` with `import "./App.css";`, i.e. use double quotes. If you see an error saying that `Strings must use singlequote.eslint(quotes)`, then your ESLint setup is successful.
     
If you use other code editors, such as WebStorm, you can follow this [doc](https://www.jetbrains.com/help/webstorm/eslint.html).


### Running the Program
`cd aia` enter into the project directory, run `npm start`. This will start a web server on your computer.
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
