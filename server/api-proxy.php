<?php
/**
 * ============================================
 * API PROXY - TOKEN REFRESH ENDPOINT
 * ============================================
 * Endpoint này cho phép frontend lấy token mới
 * mà KHÔNG CẦN biết credentials (bảo mật)
 * 
 * Frontend chỉ cần gọi: POST /api-proxy.php?action=get-token
 * Server sẽ login bằng config.php và trả về token
 */

// CORS Headers (nếu cần)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Load config
require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? '';

/**
 * ACTION: get-token
 * Trả về fresh token cho frontend
 */
if ($action === 'get-token') {
    $tokenCacheFile = __DIR__ . '/token_cache.txt';
    
    // Function để login và lấy token mới
    function getNewToken() {
        $ch = curl_init(API_BASE_URL . "/auth/login");
        $formData = http_build_query([
            'username' => API_USERNAME,
            'password' => API_PASSWORD
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $formData);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["x-tenant-code: " . TENANT_CODE]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            return null;
        }
        
        $data = json_decode($response, true);
        return $data['access_token'] ?? null;
    }
    
    // Đọc token từ cache
    $cachedToken = @file_get_contents($tokenCacheFile);
    
    // Nếu có cached token, verify nó còn valid không
    if ($cachedToken) {
        // Test token bằng cách gọi API settings
        $ch = curl_init(API_BASE_URL . "/vr-hotel/settings");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "accept: application/json",
            "x-tenant-code: " . TENANT_CODE,
            "x-property-id: " . PROPERTY_ID,
            "Authorization: Bearer " . $cachedToken
        ]);
        curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        // Nếu token còn valid, trả về luôn
        if ($httpCode === 200) {
            echo json_encode([
                'success' => true,
                'access_token' => $cachedToken,
                'source' => 'cache'
            ]);
            exit;
        }
    }
    
    // Token hết hạn hoặc không có → Login lại
    $newToken = getNewToken();
    
    if ($newToken) {
        // Lưu token mới vào cache
        file_put_contents($tokenCacheFile, $newToken);
        
        echo json_encode([
            'success' => true,
            'access_token' => $newToken,
            'source' => 'new'
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to authenticate with API'
        ]);
    }
    exit;
}

/**
 * ACTION: get-config
 * Trả về config CÔNG KHAI (không có credentials)
 */
if ($action === 'get-config') {
    echo json_encode([
        'API_BASE_URL' => API_BASE_URL,
        'TENANT_CODE' => TENANT_CODE,
        'TENANT_ID' => defined('TENANT_ID') ? TENANT_ID : '',
        'PROPERTY_ID' => PROPERTY_ID,
        'VR360_CDN_URL' => defined('VR360_CDN_URL') ? VR360_CDN_URL : 'https://travel.link360.vn',
        'SITE_BASE_URL' => defined('SITE_BASE_URL') ? SITE_BASE_URL : '',
        'APP_NAME' => defined('APP_NAME') ? APP_NAME : ''
    ]);
    exit;
}

// Invalid action
http_response_code(400);
echo json_encode([
    'success' => false,
    'error' => 'Invalid action. Use ?action=get-token or ?action=get-config'
]);
