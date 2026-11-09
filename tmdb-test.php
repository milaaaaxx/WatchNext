<?php 
require_once __DIR__ . "/config/tmdb.php";

$url = "https://api.themoviedb.org/3/search/movie?query=Interstellar&language=en-US";

$request = curl_init($url);

curl_setopt_array($request, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer " . $tmdbToken,
        "Accept: application/json",
    ],
]);

$response = curl_exec($request);
$status = curl_getinfo($request, CURLINFO_HTTP_CODE);

echo $status;
