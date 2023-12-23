const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "production", // "production" | "development" | "none"

    // entrypoint
    entry: path.join(__dirname, "ts", "main.ts"),

    output: {
        path: path.join(__dirname, "dist"),
        filename: "main.js",
        publicPath: "/dist/"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            },
        ]
    },

    resolve: {
        modules: [
            "node_modules"
        ],
        extensions: [
            ".ts", ".js"
        ]
    },

    optimization: {
        minimizer: [new TerserPlugin({
            extractComments: false,
        })],
    },
};

