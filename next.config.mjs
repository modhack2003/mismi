/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence the 'multiple lockfiles' turbopack warning
  turbopack: {
    root: '.'
  },
  serverExternalPackages: ['redis'],
};

export default nextConfig;
