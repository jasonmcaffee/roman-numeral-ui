import type { NextConfig } from "next";
import { glob } from "glob";

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      // Don't include any locale strings in the client JS bundle.
      // Note: We'll add the locales plugin later if needed
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
