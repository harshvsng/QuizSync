import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ["dist/**"],
    },
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },

        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
        },
    },
]);
