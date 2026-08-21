import next from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// eslint-config-next v16 ships native flat configs, so they are spread directly.
// Loading them through FlatCompat (the eslintrc shim) fails schema validation and
// crashes with "Converting circular structure to JSON".
const eslintConfig = [
  ...next,
  ...nextTypescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
