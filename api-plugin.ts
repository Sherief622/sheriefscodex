import { resolve } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import type { Plugin } from 'vite';

/**
 * Vite plugin that exposes local API routes for reading/writing projects.json.
 * Only active during development (configureServer is dev-only).
 */
export default function projectsApiPlugin(): Plugin {
  return {
    name: 'projects-api',
    configureServer(server) {
      const jsonPath = resolve(server.config.root, 'src/data/projects.json');

      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/projects')) return next();

        // GET /api/projects — return current projects.json
        if (req.method === 'GET' && req.url === '/api/projects') {
          try {
            const data = readFileSync(jsonPath, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
          } catch {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to read projects.json' }));
          }
          return;
        }

        // POST /api/projects — overwrite projects.json with full array
        if (req.method === 'POST' && req.url === '/api/projects') {
          let body = '';
          req.on('data', (chunk: Buffer) => (body += chunk.toString()));
          req.on('end', () => {
            try {
              const projects = JSON.parse(body);
              writeFileSync(
                jsonPath,
                JSON.stringify(projects, null, 2) + '\n',
                'utf-8'
              );
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
          return;
        }

        // DELETE /api/projects/:id — remove one project by ID
        const deleteMatch = req.url.match(/^\/api\/projects\/(.+)$/);
        if (req.method === 'DELETE' && deleteMatch) {
          try {
            const id = decodeURIComponent(deleteMatch[1]);
            const data = JSON.parse(readFileSync(jsonPath, 'utf-8'));
            const filtered = data.filter((p: { id: string }) => p.id !== id);
            writeFileSync(
              jsonPath,
              JSON.stringify(filtered, null, 2) + '\n',
              'utf-8'
            );
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
          } catch {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to delete project' }));
          }
          return;
        }

        next();
      });
    },
  };
}
