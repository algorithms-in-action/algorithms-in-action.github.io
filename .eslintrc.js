module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 12,
        sourceType: "module"
    },
    settings: {
        react: {
            version: "17.0.2"
        }
    },
    plugins: [
        "react",
        "jsx-a11y",
        "import"
    ],
    rules: {
        "no-unused-vars": "off",
        "react/jsx-key": "off",
        "react/no-unknown-property": "off"
    }
};
