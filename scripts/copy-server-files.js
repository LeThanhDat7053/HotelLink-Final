/**
 * Copy Server Files to dist/
 * Tự động copy các file server cần thiết sau khi build
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverDir = path.join(__dirname, '..', 'server');
const distDir = path.join(__dirname, '..', 'dist');

const filesToCopy = [
  'api-proxy.php',
  'index.php',
  '.htaccess',
  'config.example.php',
];

console.log('📦 Copying server files to dist/...');

filesToCopy.forEach(file => {
  const src = path.join(serverDir, file);
  const dest = path.join(distDir, file);
  
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ⚠️  ${file} not found (skipped)`);
    }
  } catch (error) {
    console.error(`  ❌ Failed to copy ${file}:`, error.message);
  }
});

// Tạo README nhắc nhở trong dist/
const readmeContent = `# 🚀 Deploy Instructions

## Required Files for Production:

- ✅ index.html
- ✅ api-proxy.php (copied)
- ✅ .htaccess (copied)
- ✅ assets/ (CSS, JS)
- ⚠️  config.php (CREATE THIS - copy from config.example.php)
- ⚠️  token_cache.txt (will be auto-created)

## Deploy Steps:

1. Upload ALL files from this dist/ folder to server
2. Create config.php (copy from config.example.php)
3. Fill in your API credentials in config.php
4. Ensure token_cache.txt is writable: chmod 664 token_cache.txt
5. Test: Visit your site, check all pages work
6. Security check: https://yoursite.com/config.php should be 403 Forbidden

See server/DEPLOY.md for detailed instructions.
`;

fs.writeFileSync(path.join(distDir, 'README.txt'), readmeContent);
console.log('  ✅ README.txt (deployment instructions)');

console.log('\n✨ Done! dist/ folder is ready for deployment.');
console.log('📄 See dist/README.txt for deploy instructions.');
