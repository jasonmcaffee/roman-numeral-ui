import type { NextConfig } from "next";
import { glob } from "glob";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverRuntimeConfig: {
    // Will only be available on the server side
    ddAgentHost: process.env.DD_AGENT_HOST,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    ddApiKey: process.env.DD_API_KEY,
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      // Exclude server-only packages from client bundles
      config.externals = config.externals || [];
      config.externals.push({
        'dd-trace': 'dd-trace',
        'hot-shots': 'hot-shots',
        'graphql': 'graphql',
        'graphql/language/visitor': 'graphql/language/visitor',
        'graphql/language/printer': 'graphql/language/printer',
        'graphql/utilities': 'graphql/utilities',
        'lodash.sortby': 'lodash.sortby',
      });
      
      // Handle node: scheme modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        dns: false,
        path: false,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        util: false,
      };
    }
    
    return config;
  },
  transpilePackages: [
    '@adobe/react-spectrum',
    '@react-spectrum/*',
    '@spectrum-icons/*',
  ].flatMap(spec => glob.sync(`${spec}`, { cwd: 'node_modules/' })),
};

export default nextConfig;
