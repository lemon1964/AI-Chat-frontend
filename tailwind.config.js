/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Для Next.js структура "src"
    "./pages/**/*.{js,ts,jsx,tsx}", // Если файлы страниц вне "src"
    "./components/**/*.{js,ts,jsx,tsx}", // Компоненты
    "./app/**/*.{js,ts,jsx,tsx}", // Если используется папка "app"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

