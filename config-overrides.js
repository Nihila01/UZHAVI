module.exports = {
    webpack: function(config, env) {
        config.resolve.fallback = {
            fs: false,
            path: require.resolve("path-browserify"),
            http: require.resolve("stream-http"),
            https: require.resolve("stream-http"),
            zlib: require.resolve("browserify-zlib"),
            crypto: require.resolve("crypto-browserify"),
            querystring: require.resolve("querystring-es3"),
            stream: require.resolve("stream-browserify"),
        };
        return config;
    },
};
