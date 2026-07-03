/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FBFBED',
          100: '#FBFBED',
          600: '#2EB89D',
          700: '#475F85',
          900: '#475F85',
        },
        ink: '#475F85',
        cream: '#FBFBED',
        paper: '#FDFDFD',
        tomato: '#EA5749',
        sunshine: '#FBC017',
        mint: '#2EB89D',
      },
      boxShadow: {
        soft: '0 20px 50px rgba(71, 95, 133, 0.14)',
        card: '0 14px 34px rgba(71, 95, 133, 0.10)',
      },
    },
  },
  plugins: [],
}
