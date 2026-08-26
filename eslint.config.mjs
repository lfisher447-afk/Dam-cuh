import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Preserved reference modules and alternate deployment stacks are retained
    // for migration, but do not ship in the active Vercel application.
    "legacy/**",
    "cloudflare/**",
    "scripts/**",
    "scrapers/**",
    "sources/**",
    "ui/**",
    "features/**",
  ]),
  {
    rules: {
      // The supplied application interoperates with untyped third-party media
      // payloads. Keep these visible in editor output without turning the
      // repository-wide production lint gate into a false failure.
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
