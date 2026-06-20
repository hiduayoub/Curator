import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Aggressive, opinionated rules layered on top of Next.js defaults.
  {
    rules: {
      // Correctness — fail loudly on the things that quietly rot a codebase.
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "error",
      "no-var": "error",
      "prefer-const": "error",
      "object-shorthand": ["error", "always"],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      // External preview thumbnails use a plain <img>; next/image would require
      // remote-pattern config for every social CDN.
      "@next/next/no-img-element": "off",
    },
  },

  // Keep Prettier as the single source of truth for formatting — must be last.
  prettier,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "node_modules/**",
    "drizzle/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
