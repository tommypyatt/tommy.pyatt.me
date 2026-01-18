/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./templates/**/*.js",
    "./docs/**/*.html"
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#d1d5db",
            a: {
              color: "#22d3ee",
              "&:hover": {
                color: "#67e8f9"
              }
            }
          }
        }
      }
    }
  },
  plugins: []
};
