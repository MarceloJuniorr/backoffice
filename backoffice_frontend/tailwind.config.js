const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}", // Aponta para os arquivos do seu projeto
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}", // Integra com o NextUI Theme
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0070f3", // Cor primária customizada
                secondary: "#1DB954", // Cor secundária customizada
                background: "#f0f0f0", // Cor de fundo customizada
            },
        },
    },
    plugins: [nextui()], // Ativando o NextUI como plugin para o Tailwind
    darkMode: "class", // Habilita o modo escuro usando classes
};
