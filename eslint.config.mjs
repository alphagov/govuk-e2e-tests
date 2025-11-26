import globals from "globals";
import pluginJs from "@eslint/js";
import playwright from "eslint-plugin-playwright";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    languageOptions: { globals: globals.node },
  },
  pluginJs.configs.recommended,
  {
    ...playwright.configs["flat/recommended"],
    files: ["tests/**"],
    rules: {
      "playwright/expect-expect": [
        "error",
        {
          assertFunctionNames: ["expect", "verifyUpdatedRateVisible"],
        },
      ],
    },
  },
  prettierConfig,
];
