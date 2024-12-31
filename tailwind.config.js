/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
    container: {
      screens: {
        sm: "600px",
        md: "700px",
        lg: "800px",
        xl: "900px",
      },
    },
  },
  plugins: [],
};
