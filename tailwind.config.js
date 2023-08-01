/** @type {import('tailwindcss').Config} */
export default {
  content: ['dist/**/*.html', 'dist/options.js'],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      width: ['group-hover'], // add this line
    },
  },
  plugins: [],
}

