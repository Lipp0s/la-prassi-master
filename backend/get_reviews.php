<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');
header("Content-Type: application/json");
include 'db.php';
// --- AUTENTICAZIONE SESSIONE ---
$headers = getallheaders();
$auth = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : null);
if (!$auth || !preg_match('/Bearer\s+(\S+)/i', $auth, $matches)) {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Missing or invalid Authorization header"]);
    exit();
}
$session_token = $matches[1];
$stmt = $conn->prepare("SELECT user_id FROM sessions WHERE session_token = :token");
$stmt->execute([':token' => $session_token]);
$session = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$session) {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Invalid session token"]);
    exit();
}

$where = [];
$params = [];
// LOG: parametri GET ricevuti
error_log('GET video_id: ' . (isset($_GET['video_id']) ? $_GET['video_id'] : 'N/A'));
error_log('GET user_id: ' . (isset($_GET['user_id']) ? $_GET['user_id'] : 'N/A'));
if (isset($_GET['video_id'])) {
    $where[] = 'r.video_id = :video_id';
    $params[':video_id'] = $_GET['video_id'];
}
if (isset($_GET['user_id'])) {
    $where[] = 'r.user_id = :user_id';
    $params[':user_id'] = $_GET['user_id'];
}
$whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

try {
    $sql = "SELECT r.id, r.rating, r.comment, r.created_at, r.video_id, u.username 
            FROM reviews r JOIN users u ON r.user_id = u.id $whereSql ORDER BY r.created_at DESC";
    // LOG: query SQL e parametri
    error_log('SQL: ' . $sql);
    error_log('PARAMS: ' . json_encode($params));
    $stmt = $conn->prepare($sql);
    foreach ($params as $k => $v) {
        if ($k === ':video_id') {
            $stmt->bindValue($k, $v, PDO::PARAM_STR);
        } else {
            $stmt->bindValue($k, $v, PDO::PARAM_INT);
        }
    }
    $stmt->execute();
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // LOG: risultato query
    error_log('REVIEWS: ' . json_encode($reviews));
    echo json_encode(["success" => true, "reviews" => $reviews]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
?> 