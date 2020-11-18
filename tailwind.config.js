const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    purge: {
         content: [
            './app/**/*.html',
            './app/**/*.erb',
            './app/**/*.vue',
            './app/**/*.jsx',
        ]},
    theme: {
        extend: {
            fontFamily: {
                sans: ["Dosis", ...defaultTheme.fontFamily.sans]
            }
        }
    },
    variants: {},
    plugins: [],
}
