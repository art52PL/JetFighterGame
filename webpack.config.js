//webpack.config.js
const path = require('path');

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
        main: "./src/app.ts",
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: "index.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    }
};