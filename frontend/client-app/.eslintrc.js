module.exports = {
    "env": {
      "browser": true,
      "es2021": true,
      "node": true
    },
    "extends": ["airbnb", "airbnb-typescript", "prettier"],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaFeatures": {
        "jsx": true
      },
      "ecmaVersion": "latest",
      "project": "tsconfig.eslint.json",
      "sourceType": "module",
      "tsconfigRootDir": __dirname,
    },
    "plugins": [
      "jsx-a11y",
      "react",
      "react-hooks",
      "sort-imports-es6-autofix",
      "@typescript-eslint"
    ],
    "rules": {
      "import/no-extraneous-dependencies": 0,
      "import/prefer-default-export": 0,
      "jsy-a11y/prefer-default-export": 0,
      "jsx-a11y/aria-props": 2,
      "jsx-a11y/click-events-have-key-events": 2,
      "jsx-a11y/label-has-for": 1,
      "jsx-a11y/mouse-events-have-key-events": 2,
      "jsx-a11y/role-has-required-aria-props": 2,
      "jsx-a11y/role-supports-aria-props": 2,
      "no-prototype-builtins": 0,
      "react/function-component-definition": [
        2,
        {
          "namedComponents": "arrow-function",
          "unnamedComponents": "arrow-function"
        }
      ],
      "react/jsx-props-no-spreading": 0,
      "react-hooks/rules-of-hooks": 2, // Checks rules of Hooks
      "react/require-default-props": 0,
      "spaced-comment": 0,
      "no-use-before-define": 0,
      "@typescript-eslint/no-use-before-define": 0,
      "no-shadow": 0,
      "@typescript-eslint/no-shadow": 0,
      "react/react-in-jsx-scope": "off",
      "react-hooks/exhaustive-deps": "off",
      "sort-imports-es6-autofix/sort-imports-es6": [
        2,
        {
          "ignoreCase": false,
          "ignoreMemberSort": false,
          "memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
        }
      ]
    }
  }