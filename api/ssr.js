import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to your app SSR server bundle
const serverPath = join(__dirname, '../dist/zyra-ui/server/server.mjs');
const { app } = await import(serverPath);

export default function handler(req, res) {
    app(req, res);
}
