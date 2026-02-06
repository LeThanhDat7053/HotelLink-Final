<?php
// ===== 1. LOAD CẤU HÌNH TỪ FILE config.php =====
// Đọc config từ file riêng - có thể chỉnh trên server mà không cần build lại
require_once __DIR__ . '/config.php';

$API_BASE_URL = API_BASE_URL;
$API_USERNAME = API_USERNAME;
$API_PASSWORD = API_PASSWORD;
$TENANT_CODE  = TENANT_CODE;
$PROPERTY_ID  = PROPERTY_ID;

$tokenCacheFile = __DIR__ . '/token_cache.txt';

// ===== 2. HÀM LOGIN & GỌI API =====
function loginAndGetToken($baseUrl, $user, $pass, $tenant) {
    $ch = curl_init("$baseUrl/auth/login");
    $formData = http_build_query(['username' => $user, 'password' => $pass]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $formData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["x-tenant-code: $tenant"]);
    $response = curl_exec($ch);
    $data = json_decode($response, true);
    curl_close($ch);
    return $data['access_token'] ?? null;
}

function getSettings($baseUrl, $token, $tenant, $propertyId) {
    $ch = curl_init("$baseUrl/vr-hotel/settings");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "accept: application/json", 
        "x-tenant-code: $tenant", 
        "x-property-id: $propertyId", 
        "Authorization: Bearer $token"
    ]);
    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['status' => $status, 'data' => json_decode($response, true)];
}

// ===== 3. XỬ LÝ CHÍNH =====
$authToken = @file_get_contents($tokenCacheFile);
if (!$authToken) {
    $authToken = loginAndGetToken($API_BASE_URL, $API_USERNAME, $API_PASSWORD, $TENANT_CODE);
    file_put_contents($tokenCacheFile, $authToken);
}

$result = getSettings($API_BASE_URL, $authToken, $TENANT_CODE, $PROPERTY_ID);
if ($result['status'] === 401) { // Token hết hạn
    $authToken = loginAndGetToken($API_BASE_URL, $API_USERNAME, $API_PASSWORD, $TENANT_CODE);
    file_put_contents($tokenCacheFile, $authToken);
    $result = getSettings($API_BASE_URL, $authToken, $TENANT_CODE, $PROPERTY_ID);
}

$data = $result['data'];
$seo = $data['seo']['vi'] ?? [];

// Dữ liệu Meta từ API
$title_api = $seo['meta_title'] ?? "Phoenix Hotel Vũng Tàu";
$desc_api  = $seo['meta_description'] ?? "";
$key_api   = $seo['meta_keywords'] ?? "";
// Ưu tiên meta_image_media_id, fallback logo_media_id, không có thì không dùng hình
$meta_image_id = $seo['meta_image_media_id'] ?? $data['logo_media_id'] ?? null;
$img_api   = $meta_image_id ? "https://travel.link360.vn/api/v1/media/" . $meta_image_id . "/view" : "";
// Favicon: ưu tiên favicon_media_id, fallback logo_media_id, không có thì không dùng
$favicon_id = $data['favicon_media_id'] ?? $data['logo_media_id'] ?? null;
$fav_api   = $favicon_id ? "https://travel.link360.vn/api/v1/media/" . $favicon_id . "/view" : "";

if (!file_exists('index.html')) {
    die("Lỗi: Không tìm thấy file index.html nguồn");
}
$html = file_get_contents('index.html');

// ===== 4. THAY THẾ CHUỖI (REGEX) =====
// Thay Title
$html = preg_replace('/<title>.*?<\/title>/', "<title>$title_api</title>", $html);

// Thay Meta Description, Keywords
$html = preg_replace('/<meta name="description" content=".*?"/i', '<meta name="description" content="'.$desc_api.'"', $html);
$html = preg_replace('/<meta name="keywords" content=".*?"/i', '<meta name="keywords" content="'.$key_api.'"', $html);

// Thay Open Graph (Facebook/Zalo)
$html = preg_replace('/<meta property="og:title" content=".*?"/i', '<meta property="og:title" content="'.$title_api.'"', $html);
$html = preg_replace('/<meta property="og:description" content=".*?"/i', '<meta property="og:description" content="'.$desc_api.'"', $html);
// Chỉ thay og:image nếu có hình
if ($img_api) {
    $html = preg_replace('/<meta property="og:image" content=".*?"/i', '<meta property="og:image" content="'.$img_api.'"', $html);
    $html = preg_replace('/<meta property="og:image:secure_url" content=".*?"/i', '<meta property="og:image:secure_url" content="'.$img_api.'"', $html);
}

// Thay Twitter Meta
$html = preg_replace('/<meta name="twitter:title" content=".*?"/i', '<meta name="twitter:title" content="'.$title_api.'"', $html);
$html = preg_replace('/<meta name="twitter:description" content=".*?"/i', '<meta name="twitter:description" content="'.$desc_api.'"', $html);
// Chỉ thay twitter:image nếu có hình
if ($img_api) {
    $html = preg_replace('/<meta name="twitter:image" content=".*?"/i', '<meta name="twitter:image" content="'.$img_api.'"', $html);
}

// Thay Favicon - chỉ thay nếu có favicon
if ($fav_api) {
    $html = str_replace('https://travel.link360.vn/api/v1/media/172/view', $fav_api, $html);
}

// ===== TIÊM DỮ LIỆU VÀO FRONTEND (BẢO MẬT) =====
// Config được nhúng trong __INITIAL_DATA__ (ít dễ thấy hơn)
$data['_config'] = [
    'api_base' => API_BASE_URL,
    'tenant' => TENANT_CODE,
    'tenant_id' => defined('TENANT_ID') ? TENANT_ID : '',
    'property_id' => PROPERTY_ID,
    'vr360_cdn' => defined('VR360_CDN_URL') ? VR360_CDN_URL : 'https://travel.link360.vn',
    'site_url' => defined('SITE_BASE_URL') ? SITE_BASE_URL : '',
    'app_name' => defined('APP_NAME') ? APP_NAME : ''
];

$injectData = "<script id='__SERVER_DATA__'>
    window.__SERVER_TOKEN__ = '" . $authToken . "';
    window.__INITIAL_DATA__ = " . json_encode($data) . ";
</script>";
$html = str_replace('</head>', $injectData . '</head>', $html);

echo $html;