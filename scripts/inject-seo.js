/**
 * Build Script: Fetch API và inject SEO meta tags vào index.html
 * Chạy sau khi build: node scripts/inject-seo.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config
const API_BASE_URL = 'https://travel.link360.vn/api/v1';
const TENANT_CODE = 'fusion';
const PROPERTY_ID = '10';

async function fetchSEOData() {
  console.log('🔄 Fetching SEO data from API...');
  
  const response = await fetch(`${API_BASE_URL}/vr-hotel/settings`, {
    headers: {
      'Accept': 'application/json',
      'X-Tenant-Code': TENANT_CODE,
      'X-Property-Id': PROPERTY_ID,
    }
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('✅ API data fetched:', data);
  
  return {
    title: data.seo?.vi?.meta_title || 'HotelLink',
    description: data.seo?.vi?.meta_description || '',
    keywords: data.seo?.vi?.meta_keywords || '',
    logoUrl: `${API_BASE_URL}/media/${data.logo_media_id}/view`,
    faviconUrl: `${API_BASE_URL}/media/${data.favicon_media_id}/view`,
  };
}

function generateMetaTags(seo) {
  return `
    <!-- SEO Meta Tags - Generated at build time -->
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}" />
    <meta name="keywords" content="${seo.keywords}" />
    
    <!-- Open Graph (Facebook, Zalo) -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${seo.title}" />
    <meta property="og:description" content="${seo.description}" />
    <meta property="og:image" content="${seo.logoUrl}" />
    <meta property="og:image:secure_url" content="${seo.logoUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${seo.title}" />
    <meta name="twitter:description" content="${seo.description}" />
    <meta name="twitter:image" content="${seo.logoUrl}" />
    
    <!-- Favicon -->
    <link rel="icon" href="${seo.faviconUrl}" />
    <link rel="shortcut icon" href="${seo.faviconUrl}" />
    <link rel="apple-touch-icon" href="${seo.faviconUrl}" />
  `;
}

async function injectSEO() {
  try {
    // 1. Fetch SEO data từ API
    const seo = await fetchSEOData();
    
    // 2. Đọc file index.html đã build
    const indexPath = path.join(__dirname, '../dist/index.html');
    let html = fs.readFileSync(indexPath, 'utf-8');
    
    // 3. Generate meta tags
    const metaTags = generateMetaTags(seo);
    
    // 4. Inject vào <head> (sau viewport)
    html = html.replace(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      `<meta name="viewport" content="width=device-width, initial-scale=1.0">\n${metaTags}`
    );
    
    // 5. Ghi lại file
    fs.writeFileSync(indexPath, html, 'utf-8');
    
    console.log('✅ SEO meta tags injected successfully!');
    console.log('📄 File:', indexPath);
    console.log('🎯 Title:', seo.title);
    console.log('🖼️  Image:', seo.logoUrl);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

injectSEO();
