<?php
header('Content-Type: application/json');

// Base directory for projects
$baseDir = __DIR__ . '/../Projects';
$category = isset($_GET['category']) ? $_GET['category'] : '';

// Map the URL category strings to actual folder names we expect
$categoryMap = [
    '3d' => '3D',
    'design' => 'Design',
    'it' => 'IT'
];

if (!array_key_exists($category, $categoryMap)) {
    echo json_encode(['error' => 'Invalid category']);
    exit;
}

$targetDir = $baseDir . '/' . $categoryMap[$category];

if (!is_dir($targetDir)) {
    echo json_encode([]); // Return empty array if folder doesn't exist yet
    exit;
}

$projects = [];
$folders = array_diff(scandir($targetDir), array('..', '.'));

foreach ($folders as $folder) {
    if (is_dir($targetDir . '/' . $folder)) {
        $files = array_diff(scandir($targetDir . '/' . $folder), array('..', '.'));
        $validFiles = [];
        
        foreach ($files as $file) {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf', 'mp4', 'webm'])) {
                $validFiles[] = $file;
            }
        }
        
        // Sort files by numerical prefix (e.g., "1 file.jpg" comes before "2 file.mp4")
        usort($validFiles, function($a, $b) {
            preg_match('/^\d+/', $a, $matchesA);
            preg_match('/^\d+/', $b, $matchesB);
            
            $numA = isset($matchesA[0]) ? intval($matchesA[0]) : 9999;
            $numB = isset($matchesB[0]) ? intval($matchesB[0]) : 9999;
            
            if ($numA !== $numB) return $numA - $numB;
            return strcasecmp($a, $b);
        });
        
        if (!empty($validFiles)) {
            $projects[] = [
                'folder' => $folder,
                'files' => array_values($validFiles)
            ];
        }
    }
}

// Optional: Sort projects alphabetically by folder name
usort($projects, function ($a, $b) {
    return strcmp($a['folder'], $b['folder']);
});

echo json_encode($projects, JSON_UNESCAPED_UNICODE);
