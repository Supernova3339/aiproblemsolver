/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        config.externals.push({
            'node:crypto': 'commonjs crypto',
            'node:events': 'commonjs events',
            'node:fs': 'commonjs fs',
            'node:fs/promises': 'commonjs fs/promises',
            'node:os': 'commonjs os os',
            'node:path': 'commonjs path',
            'node:stream': 'commonjs stream',
            'node:string_decoder': 'commonjs string_decoder',
        });
        return config;
    },
}

module.exports = nextConfig
