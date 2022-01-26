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
  plugins: [],
  "tailwindCSS.includeLanguages": { "plaintext": "javascript" },
  "tailwindCSS.emmetCompletions": true
}
