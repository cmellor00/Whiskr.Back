import { loadEnvFile } from "node:process";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            '#app': path.resolve(__dirname, 'app'),
            '#db': path.resolve(__dirname, 'db'),
            '#middleware': path.resolve(__dirname, 'middleware'),
            '#utils': path.resolve(__dirname, 'utils'),
        },
    },
    test: {
        globals: true,
        environment: 'node',
        env: loadEnvFile(),
    },
});
