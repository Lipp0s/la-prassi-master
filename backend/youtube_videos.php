<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

$API_KEY = 'AIzaSyAK4HK32jIG4Z_HpldaEis2YSyNXyefDu0';

// Mappa delle categorie verso query di ricerca
$categoryQueries = [
    'trailers' => 'movie trailer',
    'gameplay' => 'gameplay',
    'tutorial' => 'how to OR tutorial',
];

$category = isset($_GET['category']) ? strtolower(trim($_GET['category'])) : '';
if (!isset($categoryQueries[$category])) {
    echo json_encode(['success' => false, 'error' => 'Invalid or missing category.']);
    exit;
}

$query = $categoryQueries[$category];

// Parametri per la ricerca
$params = [
    'part' => 'snippet',
    'q' => $query,
    'type' => 'video',
    'maxResults' => 30, // Più risultati
    'videoEmbeddable' => 'true',
    'key' => $API_KEY,
];

$url = 'https://www.googleapis.com/youtube/v3/search?' . http_build_query($params);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$response = curl_exec($ch);
curl_close($ch);

if (!$response) {
    echo json_encode(['success' => false, 'error' => 'YouTube API request failed.']);
    exit;
}

$data = json_decode($response, true);
if (!isset($data['items']) || !is_array($data['items']) || count($data['items']) === 0) {
    // Video di esempio statici per test
    $videos = [
        [
            'id' => 'aqz-KE-bpKQ',
            'title' => 'Big Buck Bunny',
            'description' => 'A short animated film by Blender Foundation',
            'thumb' => 'https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg',
            'channel' => 'Blender Foundation',
        ],
        [
            'id' => 'eRsGyueVLvQ',
            'title' => 'Sintel',
            'description' => 'Another Blender Foundation open movie',
            'thumb' => 'https://img.youtube.com/vi/eRsGyueVLvQ/hqdefault.jpg',
            'channel' => 'Blender Foundation',
        ],
        [
            'id' => 'R6MlUcmOul8',
            'title' => 'Tears of Steel',
            'description' => 'Blender Foundation sci-fi short',
            'thumb' => 'https://img.youtube.com/vi/R6MlUcmOul8/hqdefault.jpg',
            'channel' => 'Blender Foundation',
        ],
        [
            'id' => 'SkVqJ1SGeL0',
            'title' => 'Caminandes 3: Llama Drama',
            'description' => 'Blender Foundation comedy short',
            'thumb' => 'https://img.youtube.com/vi/SkVqJ1SGeL0/hqdefault.jpg',
            'channel' => 'Blender Foundation',
        ],
        [
            'id' => 'WhWc3b3KhnY',
            'title' => 'Spring',
            'description' => 'Blender Foundation fantasy short',
            'thumb' => 'https://img.youtube.com/vi/WhWc3b3KhnY/hqdefault.jpg',
            'channel' => 'Blender Foundation',
        ],
    ];
    echo json_encode(['success' => true, 'videos' => $videos]);
    exit;
}

// Mischia i risultati per randomizzare
shuffle($data['items']);

// Mostra tutti i video trovati, senza filtro anti-shorts
$videos = [];
foreach ($data['items'] as $item) {
    $videos[] = [
        'id' => $item['id']['videoId'],
        'title' => $item['snippet']['title'],
        'description' => $item['snippet']['description'],
        'thumb' => $item['snippet']['thumbnails']['high']['url'],
        'channel' => $item['snippet']['channelTitle'],
    ];
}

echo json_encode(['success' => true, 'videos' => $videos]);

// Funzione per convertire la durata ISO8601 in secondi
function parseYouTubeDuration($duration) {
    $interval = new DateInterval($duration);
    $seconds = ($interval->h * 3600) + ($interval->i * 60) + $interval->s;
    return $seconds;
} 