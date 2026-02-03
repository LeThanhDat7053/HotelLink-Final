/**
 * Build Script: Fetch API và inject SEO meta tags vào index.html
 * Chạy sau khi build: node scripts/inject-seo.js
 * 
 * Script này:
 * 1. Đọc config từ .env
 * 2. Fetch SEO data từ API
 * 3. Inject vào dist/index.html (static HTML)
 * 4. Crawlers (Google, Facebook) thấy ngay meta tags mà không cần chờ JS
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
config();

// Config from .env (REQUIRED - must set in .env file)
const API_BASE_URL = process.env.VITE_API_BASE_URL;
const TENANT_CODE = process.env.VITE_TENANT_CODE;
const PROPERTY_ID = process.env.VITE_PROPERTY_ID;
const SITE_BASE_URL = process.env.VITE_SITE_BASE_URL;

if (!API_BASE_URL || !TENANT_CODE || !PROPERTY_ID || !SITE_BASE_URL) {
  console.error('❌ Missing required env variables. Please check .env file.');
  console.error('Required: VITE_API_BASE_URL, VITE_TENANT_CODE, VITE_PROPERTY_ID, VITE_SITE_BASE_URL');
  process.exit(1);
}

// console.log('📋 Config:');
// console.log('  - API:', API_BASE_URL);
// console.log('  - Tenant:', TENANT_CODE);
// console.log('  - Property ID:', PROPERTY_ID);
// console.log('  - Site URL:', SITE_BASE_URL);

async function fetchSEOData() {
  // console.log('🔄 Fetching SEO data from API...');
  
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
  // console.log('✅ API data fetched:', data);
  
  return {
    title: data.seo?.vi?.meta_title || 'HotelLink',
    description: data.seo?.vi?.meta_description || '',
    keywords: data.seo?.vi?.meta_keywords || '',
    logoUrl: `${API_BASE_URL}/media/${data.logo_media_id}/view`,
    faviconUrl: `${API_BASE_URL}/media/${data.favicon_media_id}/view`,
    siteUrl: SITE_BASE_URL,
  };
}

function generateMetaTags(seo) {
  return `
    <!-- SEO Meta Tags - Generated at build time from API -->
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}" />
    <meta name="keywords" content="${seo.keywords}" />
    
    <!-- ✅ Canonical URL báo cho Google biết đây là trang chính thống -->
    <link rel="canonical" href="${seo.siteUrl}" />
    
    <!-- ✅ Open Graph (Facebook, Zalo, Messenger...) -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${seo.title}" />
    <meta property="og:description" content="${seo.description}" />
    <meta property="og:image" content="${seo.logoUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${seo.siteUrl}" />
    <meta property="og:site_name" content="${seo.title}" />
    <meta property="og:locale" content="vi_VN" />
    
    <!-- ✅ Twitter Card -->
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
    // console.log('📄 File:', indexPath);
    // console.log('🎯 Title:', seo.title);
    // console.log('🖼️  Image:', seo.logoUrl);
    
  } catch (error) {
    console.warn('⚠️ Warning: Could not fetch SEO data from API:', error.message);
    console.log('📄 Using hardcoded SEO meta tags from index.html source');
    // Không exit - giữ nguyên file dist/index.html với hardcode meta tags
    process.exit(0);
  }
}

injectSEO();
