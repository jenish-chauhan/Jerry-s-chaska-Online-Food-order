/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#FF6B35',
                    hover: '#E65100',
                    light: '#FFE5D9',
                },
                secondary: {
                    DEFAULT: '#1F2933',
                    light: '#3E4C59',
                },
                background: {
                    DEFAULT: '#F7F9FA',
                    dark: '#FFFFFF',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
