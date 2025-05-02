import type { NextConfig } from "next";
import { createServer } from "https";
import { readFileSync } from "fs";
import path from "path";

const nextConfig: NextConfig = {
  devIndicators: false,
  // server: {
  //   https: {
  //     key: readFileSync(path.join(process.cwd(), 'localhost-key.pem')),
  //     cert: readFileSync(path.join(process.cwd(), 'localhost.pem')),
  //   },
  // },
};