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
