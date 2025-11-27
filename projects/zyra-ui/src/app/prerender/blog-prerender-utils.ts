import { readdirSync } from 'fs';
import { join } from 'path';

export function getAllSlugs() {
	const postsDir = join(process.cwd(), 'projects','zyra-ui','src', 'content');
	const files = readdirSync(postsDir).filter(f => f.endsWith('.md'));
	return files.map(f => f.replace('.md', ''));
}
