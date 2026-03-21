import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { config as dotenvConfig } from 'dotenv';

/**
 * Vite dev-only plugin: intercepts /api/* requests and routes them to the
 * corresponding Vercel-style handler file, loaded through Vite's SSR module
 * system (so TypeScript just works, no separate process needed).
 */
function apiDevPlugin() {
  return {
    name: 'api-dev',
    configureServer(server: any) {
      // Expose .env.local values to process.env so handlers can read them
      dotenvConfig({ path: '.env.local' });

      server.middlewares.use(async (req: any, res: any, next: () => void) => {
        if (!req.url?.startsWith('/api')) return next();

        const [pathname] = (req.url as string).split('?');
        const parts = pathname.split('/').filter(Boolean); // ['api', 'bookings', '123']

        if (parts.length < 2) return next();

        const root = process.cwd().replace(/\\/g, '/');
        let handlerFile: string;
        const params: Record<string, string> = {};

        // Route: /api/auth/login  →  api/auth/login.ts
        if (parts[1] === 'auth' && parts[2]) {
          handlerFile = `${root}/api/auth/${parts[2]}.ts`;
          // Route: /api/bookings   →  api/bookings/index.ts
        } else if (parts.length === 2) {
          handlerFile = `${root}/api/${parts[1]}/index.ts`;
          // Route: /api/bookings/123  →  api/bookings/[id].ts  + { id: '123' }
        } else if (parts.length === 3) {
          const specificFile = `${root}/api/${parts[1]}/${parts[2]}.ts`;
          if (fs.existsSync(specificFile)) {
            handlerFile = specificFile;
          } else {
            handlerFile = `${root}/api/${parts[1]}/[id].ts`;
            params.id = parts[2];
          }
        } else {
          return next();
        }

        try {
          // Collect request body
          const body = await new Promise<any>((resolve) => {
            const chunks: Buffer[] = [];
            req.on('data', (c: Buffer) => chunks.push(c));
            req.on('end', () => {
              const raw = Buffer.concat(chunks).toString();
              try { resolve(raw ? JSON.parse(raw) : {}); }
              catch { resolve({}); }
            });
          });

          // Build query object (path params + search params)
          const url = new URL(req.url, 'http://localhost');
          const query: Record<string, string> = { ...params };
          url.searchParams.forEach((v, k) => { query[k] = v; });

          // Augment req / res to satisfy VercelRequest / VercelResponse
          req.body = body;
          req.query = query;
          res.status = (code: number) => { res.statusCode = code; return res; };
          res.json = (data: any) => {
            if (!res.writableEnded) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            }
            return res;
          };
          res.send = (data: any) => {
            if (!res.writableEnded) res.end(String(data));
            return res;
          };

          // Load the TypeScript handler via Vite's SSR module system
          const mod = await server.ssrLoadModule(handlerFile);
          await mod.default(req, res);
        } catch (err) {
          console.error('[api-dev]', err);
          if (!res.writableEnded) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Internal server error' }));
          }
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), apiDevPlugin()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
