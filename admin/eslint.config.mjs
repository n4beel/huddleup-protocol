import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Disable strict TypeScript rules that can cause build failures
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      
      // Disable Next.js image optimization warning for build
      "@next/next/no-img-element": "warn",
      
      // Disable other potentially problematic rules
      "@typescript-eslint/no-non-null-assertion": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": "warn",
      
      // Allow console logs in development
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    },
  },
];

export default eslintConfig;
