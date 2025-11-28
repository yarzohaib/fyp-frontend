import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    green: "#1A3126",
                    lightgreen: "#27493a",   // bottle green
                    orange: "#BB4E2C",    // burnt orange
                    offwhite: "#F2F0E5",  // off white
                },
            },
        },
    },
    plugins: [],
};
export default config;
