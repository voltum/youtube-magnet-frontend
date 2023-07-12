module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'pattern': "url('/img/pattern.png')"
      },
      boxShadow: {

      }
    },
  },
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: [],
  "tailwindCSS.includeLanguages": {
    "plaintext": "javascript"
  },
  "tailwindCSS.emmetCompletions": true
}