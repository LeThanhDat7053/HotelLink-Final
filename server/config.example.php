<?php
/**
 * ==============================================
 * FILE MẪU CẤU HÌNH API - TOÀN BỘ DỰ ÁN
 * ==============================================
 * Đây là file mẫu. Để sử dụng:
 * 1. Copy file này thành `config.php`
 * 2. Điền thông tin API thật của bạn
 * 3. KHÔNG commit config.php lên git (đã được gitignore)
 * 
 * File này điều khiển API cho:
 * - Server-side: Meta link (index.php)
 * - Client-side: React frontend (src/api.ts)
 */

// ===== API Configuration =====
define('API_BASE_URL', 'https://travel.link360.vn/api/v1');
define('API_USERNAME', 'your-email@example.com');
define('API_PASSWORD', 'your-password-here');

// ===== Tenant & Property =====
define('TENANT_CODE', 'your-tenant-code');
define('TENANT_ID', '1');
define('PROPERTY_ID', '1');

// ===== Additional Config =====
define('VR360_CDN_URL', 'https://travel.link360.vn');
define('SITE_BASE_URL', 'https://yourhotel.com');
define('APP_NAME', 'Your Hotel Name');
