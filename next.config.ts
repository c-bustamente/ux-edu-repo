import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // aquí puedes dejar otras opciones que tengas, por ejemplo:
  // reactStrictMode: true,

  eslint: {
    // 👇 Esto evita que los errores de ESLint boten el build en Vercel
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;