/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                montserrat: ['Montserrat', 'sans-serif'],
            },
            keyframes: {
                wobble: {
                    '0%, 100%': {transform: 'rotate(0deg) scale(1)'},
                    '15%': {transform: 'rotate(5deg) scale(1.1)'},
                    '30%': {transform: 'rotate(-5deg) scale(0.95)'},
                    '45%': {transform: 'rotate(3deg) scale(1.05)'},
                    '60%': {transform: 'rotate(-3deg) scale(1.02)'},
                    '75%': {transform: 'rotate(2deg) scale(0.98)'},
                },
                float: {
                    '0%, 100%': {transform: 'translateY(0)'},
                    '50%': {transform: 'translateY(-10px)'},
                },
                spinSlow: {
                    '0%': {transform: 'rotate(0deg)'},
                    '100%': {transform: 'rotate(360deg)'},
                }
            },
            animation: {
                wobble: 'wobble 2.5s ease-in-out infinite',
                float: 'float 3s ease-in-out infinite',
                spinSlow: 'spinSlow 10s linear infinite',
            }

        },
    },
    plugins: [],
};
